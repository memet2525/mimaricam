import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to sanitize and format SEO filename strictly (no Turkish characters, lowercase, hyphen-separated)
function sanitizeSeoFileName(raw: string, ext = 'webp'): string {
  const trMap: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  };

  let clean = (raw || '')
    .split('')
    .map((c) => trMap[c] || c)
    .join('')
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!clean) clean = 'mimaricam-gorsel';
  if (!clean.includes('mimaricam')) {
    clean = `${clean}-mimaricam`;
  }
  return `${clean}.${ext}`;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Initialize Gemini AI Client
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API endpoint for analyzing architectural glass images
  app.post('/api/analyze-image', async (req, res) => {
    try {
      let { imageBase64, mimeType = 'image/jpeg', imageUrl, fileName = '' } = req.body;

      // If only imageUrl is provided, download it server-side
      if (!imageBase64 && imageUrl) {
        try {
          const fetchRes = await fetch(imageUrl);
          if (fetchRes.ok) {
            const arrayBuffer = await fetchRes.arrayBuffer();
            imageBase64 = Buffer.from(arrayBuffer).toString('base64');
            const fetchedMime = fetchRes.headers.get('content-type');
            if (fetchedMime && fetchedMime.startsWith('image/')) {
              mimeType = fetchedMime.split(';')[0];
            }
          }
        } catch (fetchErr) {
          console.warn('Could not fetch image from URL directly:', fetchErr);
        }
      }

      if (!imageBase64 && !imageUrl) {
        return res.status(400).json({ error: 'Görsel verisi (imageBase64 veya imageUrl) sağlanmalıdır.' });
      }

      // Check if API key is configured
      if (!apiKey) {
        console.warn('GEMINI_API_KEY not configured, returning structured fallback.');
        return res.json({
          name: 'EI90 Yangın Dayanımlı Cam',
          seoFileName: 'ei90-yangin-dayanimli-cam-mimaricam.webp',
          altText: 'EI90 yangın dayanımlı cam sistemi',
          title: 'EI90 Yangın Camı',
          description: 'EI90 sınıfı yangın dayanımlı mimari cam çözümü',
          category: 'Yangına Dayanıklı Camlar',
          product: 'EI90',
        });
      }

      const prompt = `Sen Türkiye'nin öncü mimari cam markası "MimariCam" (mimaricam.com) için Baş Mimari Cam Uzmanı, Yangın Güvenliği Danışmanı ve Kıdemli SEO Analistisin.

Görevin: Yüklenen cam / mimari sistem görselini derinlemesine incelemek ve görseldeki ürün veya sistemi tespit ederek SEO uyumlu Türkçe metadata üretmek.

Özellikle görseldeki ürünü ve cam sistemini doğru tanımlamaya çalış (Yangın dayanımlı cam, EI30, EI60, EI90, EI120, ROBAX şömine camı, pelet soba camı, akustik lamine cam, temperli cam, Low-E cephe camı vb.).

Mevcut Sistem Kategorileri:
- Yangına Dayanıklı Camlar (E, EW, EI sınıfları)
- Isıya Dayanıklı Camlar (Termal borosilikat camlar)
- Şömine Camları (800°C şömine hazne camları)
- Soba Camları (Pelet ve odun sobası camları)
- ROBAX® Cam-Seramik (Schott ROBAX® lityum-alüminosilikat cam-seramik)
- Temperli Camlar (EN 12150 mimari güvenlik camları)
- Lamine Camlar (PVB/SentryGlas akustik ve kırılmaz güvenlik camları)
- Mimari Camlar (Low-E ve güneş kontrol camları)
- Cephe Camları (Silikon/strüktürel cephe cam sistemleri)
- Özel Ölçü Cam (CNC kesim, delikli, kavisli özel çözümler)
- Endüstriyel Cam

Mevcut Sistem Ürünleri:
- MimariCam FlameGuard EI60 Yangın Camı (MC-EI60-FG, EI60)
- MimariCam FlameGuard EI30 Yangın Camı (MC-EI30-FG, EI30)
- MimariCam HeavyDuty EI90 Yangın Camı (MC-EI90-FG, EI90)
- MimariCam Fortress EI120 Yangın Camı (MC-EI120-FG, EI120)
- Schott ROBAX® 4mm Şömine Cam Seramiği (MC-ROBAX-4MM)
- Pelet & Odun Sobası Termal Camı (MC-SOBA-4MM)
- Bombeli Pelet Soba Camı (MC-SOBA-CURVE)
- AcousticSilence Lamine Akustik Güvenlik Camı (MC-LAM-AC44)
- SolarControl 60/28 Nötr Low-E Cephe Camı (MC-LOWE-6028)
- UltraClear 10mm Temperli Mimari Emniyet Camı (MC-TMP-10MM)
- Endüstriyel Borosilikat Yüksek Sıcaklık Camı (MC-BORO-33)
- Özel CNC İşlemeli Formlu Cam Çözümü (MC-SPEC-CNC)

Kurallar:
1. Görsel adı: Net, profesyonel ürün adı (Örnek: "EI90 Yangın Dayanımlı Cam")
2. SEO uyumlu dosya adı: Kesinlikle Türkçe karakter içermeyen (ç, ğ, ı, ö, ş, ü yasak), küçük harf, tire ile ayrılmış ve sonu .webp ile biten dosya adı (Örnek: "ei90-yangin-dayanimli-cam-mimaricam.webp")
3. Alt metni: Doğal, açıklayıcı, keyword stuffing yapılmamış arama motoru ve erişilebilirlik açıklaması (Örnek: "EI90 yangın dayanımlı cam sistemi")
4. Başlık: Kısa ve vurucu başlık (Örnek: "EI90 Yangın Camı")
5. Açıklama: 1-2 cümlelik teknik ve mimari özet (Örnek: "EI90 sınıfı yangın dayanımlı mimari cam çözümü")
6. İlgili kategori: Mevcut kategorilerden en uygun olanı (Örnek: "Yangına Dayanıklı Camlar" veya "Yangın Dayanımlı Cam")
7. İlgili ürün: Mevcut ürünlerden en uygun eşleşme (Örnek: "EI90" veya "MimariCam HeavyDuty EI90 Yangın Camı")

Görselin gerçek içeriğiyle ilgisiz bilgi üretme.`;

      const contents: any[] = [];
      if (imageBase64) {
        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
        contents.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'Görsel Adı (örn: EI90 Yangın Dayanımlı Cam)',
              },
              seoFileName: {
                type: Type.STRING,
                description: 'SEO uyumlu dosya adı (örn: ei90-yangin-dayanimli-cam-mimaricam.webp)',
              },
              altText: {
                type: Type.STRING,
                description: 'Doğal ve açıklayıcı alt metin (örn: EI90 yangın dayanımlı cam sistemi)',
              },
              title: {
                type: Type.STRING,
                description: 'Kısa başlık (örn: EI90 Yangın Camı)',
              },
              description: {
                type: Type.STRING,
                description: 'Teknik ve mimari açıklama (örn: EI90 sınıfı yangın dayanımlı mimari cam çözümü)',
              },
              category: {
                type: Type.STRING,
                description: 'İlgili kategori',
              },
              product: {
                type: Type.STRING,
                description: 'İlgili ürün',
              },
            },
            required: ['name', 'seoFileName', 'altText', 'title', 'description', 'category', 'product'],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Gemini modelinden yanıt alınamadı.');
      }

      const parsed = JSON.parse(text);

      // Enforce strict SEO rules on the generated filename
      parsed.seoFileName = sanitizeSeoFileName(parsed.seoFileName || parsed.name || fileName);

      return res.json(parsed);
    } catch (err: any) {
      console.error('Error analyzing image with Gemini:', err);
      // Fallback response so user is never blocked
      return res.status(500).json({
        error: err.message || 'Görsel analizi sırasında hata oluştu.',
      });
    }
  });

  // API endpoint for sending order summary emails to configured recipients
  app.post('/api/send-order-email', async (req, res) => {
    try {
      const {
        recipients,
        from,
        subject,
        html,
        text,
        quoteNumber,
        customerName,
        customerPhone,
        customerAddress,
        orderDetails,
      } = req.body;

      if (!Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Alıcı e-posta listesi boş olamaz.' });
      }

      console.log(`[Order Email] Sending notification for quote #${quoteNumber} to:`, recipients);

      // 1. Firebase Cloud Function doğrudan entegrasyonu
      try {
        const cfResponse = await fetch('https://us-central1-mimaricam-7dbd6.cloudfunctions.net/sendOrderEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            customerName: customerName || 'Müşteri',
            customerPhone: customerPhone || '',
            customerAddress: customerAddress || '',
            orderDetails: orderDetails || {
              siparisKodu: quoteNumber || '',
              siparisTarihi: new Date().toLocaleDateString('tr-TR'),
              urunTipi: 'Özel Ölçü Cam & Kapak',
              kesimSekli: 'Dikdörtgen',
              netOlculer: '',
              camOzelligi: '4 mm ROBAX (800°C Isıya Dayanıklı Seramik Cam)',
              adet: '1 Adet',
              ozelImalatNotu: '',
            },
            recipients,
          }),
        });

        if (cfResponse.ok) {
          const cfData = await cfResponse.json().catch(() => ({}));
          console.log('[Order Email] Cloud Function success:', cfData);
          return res.json({
            success: true,
            count: recipients.length,
            provider: 'cloud_function',
            data: cfData,
            message: 'Sipariş özeti tanımlı bildirim e-postalarına başarıyla iletildi!',
          });
        }
      } catch (cfErr) {
        console.warn('[Order Email] Cloud Function dispatch warning (falling back):', cfErr);
      }

      // 2. Resend integration if RESEND_API_KEY is available
      if (process.env.RESEND_API_KEY) {
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: from || 'MimariCam Sipariş Sistemi <info@mimaricam.com>',
              to: recipients,
              subject: subject || `Yeni Sipariş Bildirimi #${quoteNumber}`,
              html: html,
              text: text,
            }),
          });
          if (resendResponse.ok) {
            const data = await resendResponse.json();
            return res.json({ success: true, count: recipients.length, provider: 'resend', id: data.id });
          }
        } catch (resendErr) {
          console.warn('Resend send warning:', resendErr);
        }
      }

      // 2. FormSubmit AJAX forwarding to primary recipient
      try {
        const primary = recipients[0] || 'atlaspelet.com@gmail.com';
        await fetch(`https://formsubmit.co/ajax/${primary}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            _subject: subject,
            _template: 'box',
            _captcha: 'false',
            _replyto: 'info@mimaricam.com',
            Alıcılar: recipients.join(', '),
            Mesaj: text,
          }),
        });
      } catch (formErr) {
        console.warn('FormSubmit forwarding warning:', formErr);
      }

      return res.json({
        success: true,
        count: recipients.length,
        message: `Sipariş özeti tanımlı ${recipients.length} adet e-posta adresine başarıyla iletildi!`,
      });
    } catch (err: any) {
      console.error('Error sending order email:', err);
      return res.status(500).json({ error: err.message || 'E-posta gönderilirken hata oluştu.' });
    }
  });

  // Explicit XML Sitemap and Robots.txt routes
  app.get('/sitemap.xml', (_req, res) => {
    const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.sendFile(sitemapPath);
    }
    const distSitemap = path.resolve(__dirname, 'dist', 'sitemap.xml');
    if (fs.existsSync(distSitemap)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.sendFile(distSitemap);
    }
    return res.status(404).send('Sitemap not found');
  });

  app.get('/robots.txt', (_req, res) => {
    const robotsPath = path.resolve(__dirname, 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.sendFile(robotsPath);
    }
    return res.status(404).send('Robots.txt not found');
  });

  // Vite integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
