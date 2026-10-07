const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: "mail.mimaricam.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@mimaricam.com",
    pass: process.env.EMAIL_PASS || "SizinEmailSifreniz"
  }
});

exports.sendOrderEmail = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Sadece POST istekleri kabul edilir.");
  }

  try {
    const { customerName, customerPhone, customerAddress, orderDetails, quoteNumber } = req.body;

    const settingsDoc = await admin.firestore().doc("settings/email_notifications").get();
    let recipients = ["atlaspelet.com@gmail.com"];

    if (settingsDoc.exists && settingsDoc.data().emails && settingsDoc.data().emails.length > 0) {
      recipients = settingsDoc.data().emails;
    }

    // Fiyatsız İmalat Detayları Temizliği (Gizlilik Kuralı)
    const sanitizedOrderDetails = { ...(orderDetails || {}) };
    delete sanitizedOrderDetails.fiyat;
    delete sanitizedOrderDetails.price;
    delete sanitizedOrderDetails.totalPrice;
    delete sanitizedOrderDetails.unitPrice;
    delete sanitizedOrderDetails.tutar;
    delete sanitizedOrderDetails.kdv;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
        <h2 style="color: #b45309; margin-top: 0;">MİMARİCAM - YENİ İMALAT SİPARİŞİ</h2>
        <p><strong>Sipariş Kodu:</strong> ${quoteNumber || "-"}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
        <h3 style="color: #1f2937;">Müşteri Bilgileri:</h3>
        <p style="margin: 4px 0;"><strong>Ad Soyad:</strong> ${customerName || "-"}</p>
        <p style="margin: 4px 0;"><strong>Telefon:</strong> ${customerPhone || "-"}</p>
        <p style="margin: 4px 0;"><strong>Teslimat Adresi:</strong> ${customerAddress || "-"}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
        <h3 style="color: #1f2937;">İmalat ve Kesim Bilgileri (Fiyatsız):</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${Object.entries(sanitizedOrderDetails)
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 35%; color: #4b5563;">${k}:</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; color: #111827;">${typeof v === 'object' ? JSON.stringify(v) : v}</td>
            </tr>`
            )
            .join("")}
        </table>
        <p style="font-size: 11px; color: #9ca3af; margin-top: 20px;">Bu imalat emri MimariCam Fabrika ve Tedarikçi Yönetim Sistemi tarafından iletilmiştir.</p>
      </div>
    `;

    const mailOptions = {
      from: '"MimariCam İmalat Sistemi" <info@mimaricam.com>',
      to: recipients.join(","),
      subject: `MİMARİCAM - YENİ İMALAT SİPARİŞİ (${quoteNumber || customerName || "İmalat Emri"})`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "E-posta başarıyla gönderildi." });
  } catch (error) {
    console.error("E-posta gönderme hatası:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
