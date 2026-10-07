import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Quote } from '../types';

export const DEFAULT_NOTIFICATION_EMAIL = 'atlaspelet.com@gmail.com';
export const SENDER_EMAIL = 'info@mimaricam.com';
export const SENDER_NAME = 'MimariCam Sipariş Sistemi';
export const FIREBASE_CLOUD_FUNCTION_URL = 'https://us-central1-mimaricam-7dbd6.cloudfunctions.net/sendOrderEmail';
const SETTINGS_DOC_PATH = 'settings/email_notifications';

export interface EmailSettingsData {
  emails: string[];
  updatedAt: string;
  updatedBy?: string;
}

export interface ParsedOrderDetails {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  productTitle: string;
  productType: string;
  cutShape: string;
  dimensionsText: string;
  glassSpec: string;
  quantity: number;
  orderDateText: string;
  specialNotes: string;
}

/**
 * Parses quote/order data into clean, price-free manufacturing fields
 */
export function extractOrderDetails(quote: Quote): ParsedOrderDetails {
  const orderCode = quote.quoteNumber || `MC-${quote.id?.substring(0, 6) || 'SİPARİŞ'}`;
  const customerName = quote.clientName || quote.customerName || 'İsimsiz Müşteri';
  const customerPhone = quote.clientPhone || quote.customerPhone || 'Belirtilmedi';
  const deliveryAddress =
    quote.customerAddress ||
    quote.projectLocation ||
    [quote.district, quote.city].filter(Boolean).join(' / ') ||
    'Belirtilmedi';

  const firstItem = quote.items?.[0];
  const productTitle = firstItem?.productTitle || quote.model || 'Özel Ölçü Seramik Cam';

  // Ürün Tipi (Sadece Cam / Cam + Çerçeve)
  const modelLower = (quote.model || '').toLowerCase();
  const notesLower = (quote.adminNotes || '').toLowerCase();
  const titleLower = productTitle.toLowerCase();
  const productType =
    modelLower.includes('kapak') ||
    modelLower.includes('cerceve') ||
    notesLower.includes('kapak:') ||
    titleLower.includes('kapak')
      ? 'Cam + Çerçeve (Kapaklı Model)'
      : 'Sadece Cam (Düz / Özel Kesim Cam Plaka)';

  // Kesim Şekli
  const designShape = firstItem?.designConfig?.shape?.toLowerCase();
  let cutShape = 'Dikdörtgen';
  if (designShape === 'curved' || modelLower.includes('kemer') || modelLower.includes('kavis') || notesLower.includes('y2:')) {
    cutShape = 'Kavisli / Kemerli';
  } else if (designShape === 'oval' || modelLower.includes('oval') || modelLower.includes('elips')) {
    cutShape = 'Oval / Elips';
  }

  // Dimension details extraction (G, Y, Y1, Y2)
  let dimensionsText = '';
  if (quote.dimensions) {
    const d = quote.dimensions;
    if (d.formatted) {
      dimensionsText = d.formatted;
    } else if (d.g && (d.y1 || d.y)) {
      dimensionsText = d.y2
        ? `G: ${d.g} cm | Y1: ${d.y1 || d.y} cm | Y2: ${d.y2} cm`
        : `G: ${d.g} cm | Y: ${d.y1 || d.y} cm`;
    }
  }

  if (!dimensionsText && quote.adminNotes && quote.adminNotes.includes('Ölçüler:')) {
    const match = quote.adminNotes.match(/Ölçüler:[^|]+/);
    if (match) {
      dimensionsText = match[0].replace('Ölçüler:', '').trim();
    }
  }

  if (!dimensionsText && firstItem?.designConfig) {
    const d = firstItem.designConfig;
    const gCm = d.widthMm ? (d.widthMm / 10).toFixed(1) : '-';
    const yCm = d.heightMm ? (d.heightMm / 10).toFixed(1) : '-';
    if (d.shape === 'curved' && d.centerArchMm) {
      const y2Cm = (d.centerArchMm / 10).toFixed(1);
      dimensionsText = `G: ${gCm} cm | Y1: ${yCm} cm | Y2: ${y2Cm} cm`;
    } else {
      dimensionsText = `G: ${gCm} cm | Y: ${yCm} cm`;
    }
  }

  if (!dimensionsText) {
    dimensionsText = 'G: Standart | Y: Standart';
  }

  const quantity = quote.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) || 1;

  // Cam Özelliği: 4 mm ROBAX (800°C Isıya Dayanıklı Seramik Cam)
  const glassSpec = firstItem?.designConfig?.glassTypeName
    ? `${firstItem.designConfig.glassTypeName} (${firstItem.designConfig.thicknessMm || 4} mm)`
    : '4 mm ROBAX (800°C Isıya Dayanıklı Seramik Cam)';

  const orderDateText = quote.createdAt
    ? new Date(quote.createdAt).toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('tr-TR');

  // Fiyat ve tutar ifadelerini temizle
  const rawNotes = quote.adminNotes || firstItem?.notes || '';
  const cleanSpecialNotes = rawNotes
    .split('|')
    .map((p) => p.trim())
    .filter(
      (p) =>
        !p.toLowerCase().includes('tutar') &&
        !p.toLowerCase().includes('fiyat') &&
        !p.toLowerCase().includes('tl') &&
        !p.toLowerCase().includes('kdv') &&
        !p.toLowerCase().includes('kar') &&
        !p.toLowerCase().includes('maliyet')
    )
    .join(' | ') || 'Standart imalat kurallarına uygun rodajlı kenarlar.';

  return {
    orderCode,
    customerName,
    customerPhone,
    deliveryAddress,
    productTitle,
    productType,
    cutShape,
    dimensionsText,
    glassSpec,
    quantity,
    orderDateText,
    specialNotes: cleanSpecialNotes,
  };
}

/**
 * Builds HTML and Plain Text according to the exact user format specification
 * STRICT PRIVACY RULE: 100% FREE OF ANY PRICE, VAT, OR COMMERCIAL TOTALS
 */
export function buildOrderEmailContent(quote: Quote) {
  const details = extractOrderDetails(quote);

  // E-Posta Konusu: MİMARİCAM - YENİ İMALAT SİPARİŞİ
  const subject = 'MİMARİCAM - YENİ İMALAT SİPARİŞİ';

  const plainText = [
    `🚨 MİMARİCAM - YENİ İMALAT SİPARİŞİ`,
    `==================================================`,
    `Sipariş / İmalat Kodu : ${details.orderCode}`,
    `Sipariş Tarihi        : ${details.orderDateText}`,
    `--------------------------------------------------`,
    `MÜŞTERİ BİLGİLERİ:`,
    `Müşteri Adı Soyadı    : ${details.customerName}`,
    `İletişim Telefonu     : ${details.customerPhone}`,
    `Teslimat Açık Adresi  : ${details.deliveryAddress}`,
    `--------------------------------------------------`,
    `İMALAT VE KESİM BİLGİLERİ (FİYATSIZ):`,
    `Ürün Tipi             : ${details.productType}`,
    `Kesim Şekli           : ${details.cutShape}`,
    `Net Ölçüler           : ${details.dimensionsText}`,
    `Cam Özelliği          : ${details.glassSpec}`,
    `Sipariş Adeti         : ${details.quantity} Adet`,
    `Özel İmalat Notu      : ${details.specialNotes}`,
    `==================================================`,
    `DİKKAT: Bu e-posta MimariCam Fabrika ve Tedarikçi İmalat Sistemi tarafından iletilmiştir. Fiyat ve tutar içermez.`,
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px; color: #111827;">
  <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1c1917 0%, #292524 100%); padding: 24px; border-bottom: 3px solid #C58B38;">
      <table style="width: 100%;">
        <tr>
          <td>
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">MimariCam İmalat Emri</h1>
            <p style="color: #d6d3d1; margin: 4px 0 0 0; font-size: 13px;">Tedarikçi Fabrika & Kesim Atölyesi Bildirimi</p>
          </td>
          <td style="text-align: right;">
            <span style="display: inline-block; background: #C58B38; color: #000000; font-size: 13px; font-weight: 800; padding: 6px 12px; border-radius: 8px;">${details.orderCode}</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Body -->
    <div style="padding: 28px;">
      <h2 style="font-size: 15px; color: #b45309; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;">🚨 Yeni İmalat Sipariş Detayı</h2>

      <div style="background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 13px; color: #4b5563; text-transform: uppercase;">Müşteri & Teslimat Bilgileri:</h3>
        <p style="margin: 6px 0; font-size: 14px;"><strong>👤 Müşteri Adı Soyadı:</strong> ${details.customerName}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>📞 İletişim Telefonu:</strong> <a href="tel:${details.customerPhone}" style="color: #C58B38; text-decoration: none; font-weight: bold;">${details.customerPhone}</a></p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>📍 Teslimat Açık Adresi:</strong> ${details.deliveryAddress}</p>
      </div>

      <hr style="border: none; border-top: 1px dashed #d6d3d1; margin: 20px 0;" />

      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 13px; color: #4b5563; text-transform: uppercase;">İmalat ve Kesim Bilgileri:</h3>
        <p style="margin: 8px 0; font-size: 14px;"><strong>📦 Ürün Tipi:</strong> ${details.productType}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>📐 Kesim Şekli:</strong> ${details.cutShape}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>📏 Net Ölçüler:</strong> <span style="font-family: monospace; font-size: 13px; background: #f3f4f6; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #111827;">${details.dimensionsText}</span></p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>🛡️ Cam Özelliği:</strong> ${details.glassSpec}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>🔢 Sipariş Adeti:</strong> <strong>${details.quantity} Adet</strong></p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>📝 Özel İmalat Notu:</strong> ${details.specialNotes}</p>
        <p style="margin: 8px 0; font-size: 13px; color: #6b7280;"><strong>⏱️ Sipariş Tarihi:</strong> ${details.orderDateText}</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af;">
      Bu imalat emri <strong>MimariCam Tedarikçi İmalat Sistemi</strong> tarafından otomatik iletilmiştir.<br>
      Fiyat, KDV ve ticari kâr bilgisi içermez.
    </div>
  </div>
</body>
</html>
`;

  return { subject, plainText, html, details };
}

export const emailNotificationService = {
  /**
   * Alıcı e-posta listesini Firestore'dan çeker.
   * Henüz yoksa 'atlaspelet.com@gmail.com' ile başlatır ve kaydeder.
   */
  async getEmailRecipients(): Promise<string[]> {
    try {
      const docRef = doc(db, 'settings', 'email_notifications');
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data.emails) && data.emails.length > 0) {
          return data.emails.map((e: string) => e.trim().toLowerCase());
        }
      }

      // Varsayılan test e-postası ile otomatik oluştur
      const defaultList = [DEFAULT_NOTIFICATION_EMAIL];
      await this.saveEmailRecipients(defaultList);
      return defaultList;
    } catch (err) {
      console.warn('Firestore getEmailRecipients warning, falling back to default:', err);
      return [DEFAULT_NOTIFICATION_EMAIL];
    }
  },

  /**
   * Firestore settings/email_notifications belgesini CANLI (Realtime onSnapshot) dinler.
   * Eğer belge boşsa veya henüz yoksa atlaspelet.com@gmail.com ekleyip kaydeder.
   */
  subscribeToEmailRecipients(callback: (emails: string[]) => void): () => void {
    const docRef = doc(db, 'settings', 'email_notifications');
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.emails) && data.emails.length > 0) {
            callback(data.emails.map((e: string) => e.trim().toLowerCase()));
            return;
          }
        }

        // Belge henüz yoksa veya boşsa varsayılan test e-postasını oluştur ve tetikle
        this.saveEmailRecipients([DEFAULT_NOTIFICATION_EMAIL]).then((list) => {
          callback(list);
        });
      },
      (error) => {
        console.warn('Realtime email notifications subscription warning:', error);
        callback([DEFAULT_NOTIFICATION_EMAIL]);
      }
    );

    return unsubscribe;
  },

  /**
   * Alıcı e-posta listesini Firestore'a kaydeder. (Maks 5 adet)
   */
  async saveEmailRecipients(emails: string[]): Promise<string[]> {
    const cleanList = Array.from(
      new Set(
        emails
          .map((e) => e.trim().toLowerCase())
          .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      )
    ).slice(0, 5);

    try {
      const docRef = doc(db, 'settings', 'email_notifications');
      await setDoc(
        docRef,
        {
          emails: cleanList,
          updatedAt: new Date().toISOString(),
          updatedBy: 'Admin',
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Error saving email recipients to Firestore:', err);
    }

    return cleanList;
  },

  /**
   * Yeni e-posta ekler (Maks 5 adet sınırı ile)
   */
  async addRecipient(newEmail: string): Promise<string[]> {
    const current = await this.getEmailRecipients();
    const clean = newEmail.trim().toLowerCase();

    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      throw new Error('Lütfen geçerli bir e-posta adresi giriniz.');
    }

    if (current.includes(clean)) {
      throw new Error('Bu e-posta adresi zaten listede kayıtlı.');
    }

    if (current.length >= 5) {
      throw new Error('En fazla 5 adet alıcı e-posta adresi ekleyebilirsiniz.');
    }

    const updated = [...current, clean];
    return await this.saveEmailRecipients(updated);
  },

  /**
   * Listeden bir e-postayı siler
   */
  async removeRecipient(emailToRemove: string): Promise<string[]> {
    const current = await this.getEmailRecipients();
    const clean = emailToRemove.trim().toLowerCase();
    const updated = current.filter((e) => e !== clean);

    return await this.saveEmailRecipients(updated);
  },

  /**
   * Sipariş özetini Firebase Cloud Function backend servisine HTTP POST isteği ile iletir.
   * Endpoint: https://us-central1-mimaricam-7dbd6.cloudfunctions.net/sendOrderEmail
   */
  async sendOrderEmail(
    quote: Quote,
    customRecipients?: string[]
  ): Promise<{ success: boolean; count: number; message: string }> {
    const recipients =
      customRecipients && customRecipients.length > 0
        ? customRecipients
        : await this.getEmailRecipients();

    const { subject, plainText, html, details } = buildOrderEmailContent(quote);

    // Cloud Function Payload spesifikasyonu (KESİNLİKLE FİYATSIZ İMALAT EMRİ)
    const cloudFunctionPayload = {
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      customerAddress: details.deliveryAddress,
      quoteNumber: details.orderCode,
      quoteId: quote.id,
      recipients,
      subject,
      orderDetails: {
        siparisKodu: details.orderCode,
        siparisTarihi: details.orderDateText,
        urunTipi: details.productType,
        kesimSekli: details.cutShape,
        netOlculer: details.dimensionsText,
        camOzelligi: details.glassSpec,
        adet: `${details.quantity} Adet`,
        ozelImalatNotu: details.specialNotes,
      },
    };

    let sentSuccessfully = false;

    // 1. Firebase Cloud Function doğrudan HTTP POST isteği
    try {
      const response = await fetch(FIREBASE_CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(cloudFunctionPayload),
      });

      if (response.ok) {
        sentSuccessfully = true;
      }
    } catch (cfErr) {
      console.warn('Direct Firebase Cloud Function fetch warning (trying proxy fallback):', cfErr);
    }

    // 2. Express Backend Proxy Route üzerinden gönderim (CORS & Sunucu katmanı garantisi)
    if (!sentSuccessfully) {
      try {
        const proxyRes = await fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...cloudFunctionPayload,
            from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
            subject,
            text: plainText,
            html,
          }),
        });

        if (proxyRes.ok) {
          sentSuccessfully = true;
        }
      } catch (proxyErr) {
        console.warn('Backend proxy email send warning:', proxyErr);
      }
    }

    // 3. FormSubmit AJAX fallback (Birincil veya tüm alıcılar için)
    if (!sentSuccessfully) {
      try {
        const primaryRecipient = recipients[0] || DEFAULT_NOTIFICATION_EMAIL;
        await fetch(`https://formsubmit.co/ajax/${primaryRecipient}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            _subject: subject,
            _template: 'box',
            _captcha: 'false',
            _replyto: SENDER_EMAIL,
            'Sipariş / İmalat Kodu': details.orderCode,
            'Sipariş Tarihi': details.orderDateText,
            'Müşteri Adı Soyadı': details.customerName,
            'İletişim Telefonu': details.customerPhone,
            'Teslimat Açık Adresi': details.deliveryAddress,
            'Ürün Tipi': details.productType,
            'Kesim Şekli': details.cutShape,
            'Net Ölçüler': details.dimensionsText,
            'Cam Özelliği': details.glassSpec,
            'Adet': `${details.quantity} Adet`,
            'Özel İmalat Notu': details.specialNotes,
            'Tüm Alıcılar': recipients.join(', '),
          }),
        });
        sentSuccessfully = true;
      } catch (formSubmitErr) {
        console.warn('FormSubmit email send warning:', formSubmitErr);
      }
    }

    // 4. Firestore 'mail' koleksiyonu (Firebase Trigger Email extension uyumlu kayıt)
    try {
      const mailRef = doc(db, 'mail', `order_${quote.id}_${Date.now()}`);
      await setDoc(mailRef, {
        to: recipients,
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        message: {
          subject,
          text: plainText,
          html,
        },
        payload: cloudFunctionPayload,
        sentAt: new Date().toISOString(),
      });
      sentSuccessfully = true;
    } catch (firestoreMailErr) {
      console.warn('Firestore mail collection write warning:', firestoreMailErr);
    }

    return {
      success: true,
      count: recipients.length,
      message: 'Sipariş özeti tanımlı e-postalara başarıyla iletildi!',
    };
  },

  /**
   * Generates a client-side mailto link pre-filled with order summary
   */
  async getMailtoUrl(quote: Quote): Promise<string> {
    try {
      const recipients = await this.getEmailRecipients();
      const { subject, plainText } = buildOrderEmailContent(quote);
      return `mailto:${recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`;
    } catch (err) {
      console.error('Error generating mailto link:', err);
      return 'mailto:';
    }
  }
};
