import { jsPDF } from 'jspdf';

export interface PDFData {
  quoteNumber?: string;
  date: string;
  shape: string;
  widthMm: number;
  heightMm: number;
  archApexMm?: number;
  glassTypeName: string;
  includeCover: boolean;
  coverModelName?: string;
  coverColorName?: string;
  quantity: number;
  calculatedAreaM2: number;
  rawGlassTotal: number;
  coverModelPrice?: number;
  coverDiscount?: number;
  kdvAmount: number;
  grandTotal: number;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
}

export const generateFireplacePDF = (data: PDFData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const clean = (text: string | undefined): string => {
    if (!text) return '';
    return text
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u').replace(/Ü/g, 'U')
      .replace(/ş/g, 's').replace(/Ş/g, 'S')
      .replace(/ı/g, 'i').replace(/İ/g, 'I')
      .replace(/ö/g, 'o').replace(/Ö/g, 'O')
      .replace(/ç/g, 'c').replace(/Ç/g, 'C');
  };

  const accentColor = [197, 138, 43]; // #C58A2B
  const darkColor = [33, 33, 33];
  const grayColor = [115, 115, 115];
  const lightBgColor = [250, 247, 242];

  // Top header bar
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 0, 210, 8, 'F');

  // Title Logo
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('MIMARICAM', 15, 22);

  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Somine Cami & Kapak Sistemleri', 15, 27);

  // Document Title
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TEKNIK KONFIGURASYON OZETI', 115, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Tarih: ${data.date}`, 115, 27);
  if (data.quoteNumber) {
    doc.text(`Teklif No: ${data.quoteNumber}`, 115, 31);
  }

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(15, 36, 195, 36);

  // Customer Info
  let nextY = 43;
  if (data.clientName) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('MUSTERI BILGILERI', 15, nextY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Isim: ${clean(data.clientName)}`, 15, nextY + 5);
    if (data.clientPhone) doc.text(`Telefon: ${clean(data.clientPhone)}`, 75, nextY + 5);
    if (data.clientEmail) doc.text(`E-Posta: ${clean(data.clientEmail)}`, 135, nextY + 5);

    nextY += 15;
    doc.line(15, nextY - 3, 195, nextY - 3);
  }

  // Technical Specifications Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('TEKNIK OZELLIKLER', 15, nextY);

  // Specs Columns
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

  const specs = [
    ['Cam Sekli', data.shape === 'rectangle' ? 'Dikdirtgen' : 'Tonoz / Kavisli'],
    ['Genislik (G)', `${data.widthMm} mm`],
    ['Yukseklik (Y / Y1)', `${data.heightMm} mm`],
  ];
  if (data.shape === 'arch' && data.archApexMm) {
    specs.push(['Tepe Yuksekligi (Y2)', `${data.archApexMm} mm`]);
  }
  specs.push(['Cam Tipi', data.glassTypeName]);
  specs.push(['Hesaplanan Cam Alani', `${data.calculatedAreaM2} m2`]);

  let specY = nextY + 6;
  specs.forEach(([label, val]) => {
    doc.setFillColor(248, 248, 248);
    doc.rect(15, specY - 4, 85, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text(clean(label), 17, specY);
    doc.setFont('helvetica', 'normal');
    doc.text(clean(val), 60, specY);
    specY += 7;
  });

  let coverY = nextY + 6;
  const coverSpecs = [
    ['Somine Kapagi', data.includeCover ? 'Dahil' : 'Haric'],
    ['Kapak Modeli', data.includeCover ? (data.coverModelName || 'Standart Tek Kanat') : '-'],
    ['Kapak Rengi', data.includeCover ? (data.coverColorName || 'Mat Siyah') : '-'],
    ['Siparis Adedi', `${data.quantity} Adet`],
  ];

  coverSpecs.forEach(([label, val]) => {
    doc.setFillColor(248, 248, 248);
    doc.rect(110, coverY - 4, 85, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text(clean(label), 112, coverY);
    doc.setFont('helvetica', 'normal');
    doc.text(clean(val), 155, coverY);
    coverY += 7;
  });

  nextY = Math.max(specY, coverY) + 5;
  doc.line(15, nextY - 3, 195, nextY - 3);

  // Pricing Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('FIYATLANDIRMA TABLOSU', 15, nextY);

  // Header row
  let tableY = nextY + 6;
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(15, tableY - 4, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Urun Aciklamasi', 18, tableY + 1);
  doc.text('Adet', 120, tableY + 1);
  doc.text('Birim Fiyat', 145, tableY + 1);
  doc.text('Toplam (TL)', 173, tableY + 1);

  tableY += 8;
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'normal');

  const formatTL = (num: number) => {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(num) + ' TL';
  };

  // Glass Price
  const glassUnit = Math.round(data.rawGlassTotal / data.quantity);
  doc.text(clean(`Isiya Dayanikli Cam (${data.glassTypeName})`), 18, tableY);
  doc.text(`${data.quantity}`, 122, tableY);
  doc.text(formatTL(glassUnit), 145, tableY);
  doc.text(formatTL(data.rawGlassTotal), 173, tableY);

  tableY += 7;
  doc.setDrawColor(240, 240, 240);
  doc.line(15, tableY - 4, 195, tableY - 4);

  // Cover Price
  if (data.includeCover) {
    const coverUnit = Math.round((data.coverModelPrice || 0) / data.quantity);
    doc.text(clean(`Somine Kapagi (${data.coverModelName || 'Standart'})`), 18, tableY);
    doc.text(`${data.quantity}`, 122, tableY);
    doc.text(formatTL(coverUnit), 145, tableY);
    doc.text(formatTL(data.coverModelPrice || 0), 173, tableY);

    tableY += 7;
    doc.line(15, tableY - 4, 195, tableY - 4);

    // Discount
    if (data.coverDiscount && data.coverDiscount > 0) {
      doc.setTextColor(0, 150, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Toplu Alim Indirimi (%15)', 18, tableY);
      doc.text('-', 122, tableY);
      doc.text('-', 145, tableY);
      doc.text(`-${formatTL(data.coverDiscount)}`, 173, tableY);

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'normal');
      tableY += 7;
      doc.line(15, tableY - 4, 195, tableY - 4);
    }
  }

  // Totals
  tableY += 3;
  const subTotal = data.rawGlassTotal + (data.coverModelPrice || 0) - (data.coverDiscount || 0);

  const rightLabels = [
    ['Ara Toplam', formatTL(subTotal)],
    ['KDV (%20)', formatTL(data.kdvAmount)],
  ];

  rightLabels.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(clean(label), 130, tableY);
    doc.setFont('helvetica', 'normal');
    doc.text(val, 173, tableY);
    tableY += 6;
  });

  // Grand Total banner
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.rect(125, tableY - 4, 70, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('GENEL TOPLAM', 130, tableY + 1.5);
  doc.text(formatTL(data.grandTotal), 173, tableY + 1.5);

  // Footer terms
  const footerY = 275;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, footerY - 5, 195, footerY - 5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Bu belge Mimaricam Somine Cami Tasarim Konfiguratoru uzerinden otomatik olarak uretilmistir.', 15, footerY);
  doc.text('Mimaricam markasi bir Atlas Pelet Enerji San. Tic. Ltd. Sti. istirakidir.', 15, footerY + 4);

  // Download trigger
  const dateStr = data.date.replace(/\./g, '-');
  doc.save(`mimaricam-teknik-ozet-${dateStr}.pdf`);
};
