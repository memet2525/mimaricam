import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SitemapImage {
  loc: string;
  title?: string;
  caption?: string;
}

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: SitemapImage[];
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const DOMAIN = 'https://mimaricam.com';
const CURRENT_DATE = '2026-10-01';

const SITEMAP_URLS: SitemapUrl[] = [
  // 1. Homepage & Configurator
  {
    loc: `${DOMAIN}/camini-tasarla`,
    lastmod: CURRENT_DATE,
    changefreq: 'daily',
    priority: 1.0,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/mimaricam-logo.png?alt=media&token=eac94e64-c2f6-4978-b9cc-8f9173d5ba29',
        title: 'MimariCam - Şömine ve Yangın Camı Çözümleri',
        caption: 'MimariCam özel ölçü cam ve kapak fiyat hesaplayıcı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/kare-somine-kagai.png?alt=media',
        title: 'Kare Şömine Kapağı Çerçevesi',
        caption: 'Özel ölçü metal şömine kapağı ve cam montaj çerçevesi',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/kavisli-s%C3%B6mine-kapagi.png?alt=media',
        title: 'Kavisli Şömine Kapağı Çerçevesi',
        caption: 'Kavisli ve bombe şömine camı kapak çerçevesi',
      },
    ],
  },
  {
    loc: `${DOMAIN}/`,
    lastmod: CURRENT_DATE,
    changefreq: 'daily',
    priority: 1.0,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/mimaricam-logo.png?alt=media&token=eac94e64-c2f6-4978-b9cc-8f9173d5ba29',
        title: 'MimariCam Logo',
        caption: 'MimariCam şömine camı ve yangın camı çözümleri platformu',
      },
    ],
  },

  // 2. 13 Önemli Kategori Sayfası
  // 1. Seramik Cam
  {
    loc: `${DOMAIN}/seramik-cam`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
        title: 'SCHOTT ROBAX 4mm Seramik Cam',
        caption: '800 dereceye dayanıklı SCHOTT ROBAX seramik cam plaka kesimi',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-kapak-cerceve-ici-olcu-alma.png?alt=media&token=56284421-1dca-455d-a127-1280fd9cb5b8',
        title: 'Seramik Cam Ölçüsü Alma',
        caption: 'Şömine kapak yuvasında cam ölçüsü alma tekniği',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-fitil-destekli-guvenli-montaj.png?alt=media&token=9c8769a2-c28f-45a9-9cfb-ed51b055bb95',
        title: 'Fitil Destekli Güvenli Montaj',
        caption: 'Seramik elyaf fitil ile cam montajı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-pelet-soba-alev-goruntusu.png?alt=media&token=8c06e5c1-a622-4341-b5b8-e5dbb6810b04',
        title: 'Modern Şömine ve Soba Seramik Cam Kullanımı',
        caption: 'Seramik camlı şömine ve pelet sobası alev görüntüsü',
      },
    ],
  },
  // 2. Soba Camı
  {
    loc: `${DOMAIN}/soba-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
        title: 'Soba Camı Kesimi SCHOTT ROBAX 4mm',
        caption: 'Pelet ve odun sobası için termal şoka dayanıklı seramik cam',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-kapak-cerceve-ici-olcu-alma.png?alt=media&token=56284421-1dca-455d-a127-1280fd9cb5b8',
        title: 'Soba Kapağı Cam Ölçüsü',
        caption: 'Soba kapağı iç yuvasında milimetrik cam ölçüsü tespiti',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-fitil-destekli-guvenli-montaj.png?alt=media&token=9c8769a2-c28f-45a9-9cfb-ed51b055bb95',
        title: 'Soba Camı Fitilli Montaj',
        caption: 'Yanmaz seramik fitil ile soba kapağı cam montajı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-pelet-soba-alev-goruntusu.png?alt=media&token=8c06e5c1-a622-4341-b5b8-e5dbb6810b04',
        title: 'Soba Alev Seyri',
        caption: 'Döküm ve pelet sobalarında net alev seyri ve ısı dayanımı',
      },
    ],
  },
  // 3. Şömine Camı
  {
    loc: `${DOMAIN}/somine-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
        title: 'Şömine Camı SCHOTT ROBAX 4mm',
        caption: '800 dereceye dayanıklı orijinal SCHOTT ROBAX şömine camı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-kapak-cerceve-ici-olcu-alma.png?alt=media&token=56284421-1dca-455d-a127-1280fd9cb5b8',
        title: 'Şömine Camı Ölçü Alma',
        caption: 'Şömine döküm kapak yuvasında içten içe ölçü alma tekniği',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-fitil-destekli-guvenli-montaj.png?alt=media&token=9c8769a2-c28f-45a9-9cfb-ed51b055bb95',
        title: 'Şömine Camı Montaj Kılavuzu',
        caption: 'Şömine camı fitili ve tırnak sabitleme montaj şeması',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-pelet-soba-alev-goruntusu.png?alt=media&token=8c06e5c1-a622-4341-b5b8-e5dbb6810b04',
        title: 'Şömine Alev Seyri',
        caption: 'Kapalı hazne şöminede yüksek sıcaklık alev görüntüsü',
      },
    ],
  },
  // 4. Pelet Soba Camı
  {
    loc: `${DOMAIN}/pelet-soba-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
        title: 'Pelet Soba Camı SCHOTT ROBAX 4mm',
        caption: 'Otomatik ve hermetik pelet sobaları için ısıya dayanıklı seramik cam',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-kapak-cerceve-ici-olcu-alma.png?alt=media&token=56284421-1dca-455d-a127-1280fd9cb5b8',
        title: 'Pelet Soba Camı Ölçüsü Alma',
        caption: 'Pelet sobası kapak yuvasında net cam ölçüsü tespiti',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-fitil-destekli-guvenli-montaj.png?alt=media&token=9c8769a2-c28f-45a9-9cfb-ed51b055bb95',
        title: 'Pelet Soba Camı Montajı',
        caption: 'Hava sızdırmaz fitilli pelet sobası cam montajı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-pelet-soba-alev-goruntusu.png?alt=media&token=8c06e5c1-a622-4341-b5b8-e5dbb6810b04',
        title: 'Pelet Sobası Alev Görünümü',
        caption: 'Modern pelet sobasında kesintisiz alev keyfi',
      },
    ],
  },
  // 5. Kuzine Soba Camı
  {
    loc: `${DOMAIN}/kuzine-soba-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
        title: 'Kuzine Soba Camı SCHOTT ROBAX 4mm',
        caption: 'Fırınlı kuzine ve döküm sobalar için yüksek termal dayanımlı cam',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-kapak-cerceve-ici-olcu-alma.png?alt=media&token=56284421-1dca-455d-a127-1280fd9cb5b8',
        title: 'Kuzine Camı Ölçü Alma',
        caption: 'Kuzine kapağında milimetrik cam ölçüsü tespiti',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-fitil-destekli-guvenli-montaj.png?alt=media&token=9c8769a2-c28f-45a9-9cfb-ed51b055bb95',
        title: 'Kuzine Cam Montajı',
        caption: 'Fitil destekli güvenli kuzine camı montajı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-pelet-soba-alev-goruntusu.png?alt=media&token=8c06e5c1-a622-4341-b5b8-e5dbb6810b04',
        title: 'Kuzine Fırın ve Yanma Odası Alevi',
        caption: 'Kuzine fırın ve ateş kapağında şeffaf seramik cam',
      },
    ],
  },
  // 6. Isıya Dayanıklı Cam
  {
    loc: `${DOMAIN}/isiya-dayanikli-cam`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
        title: 'Isıya Dayanıklı Cam Plakası',
        caption: 'Yüksek sıcaklık ve termal şoka dayanıklı cam seramik plaka',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-kapak-cerceve-ici-olcu-alma.png?alt=media&token=56284421-1dca-455d-a127-1280fd9cb5b8',
        title: 'Isıya Dayanıklı Cam Ölçü Alma',
        caption: 'Metal yuvadan genleşme toleransı düşülerek cam ölçüsü alma',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-fitil-destekli-guvenli-montaj.png?alt=media&token=9c8769a2-c28f-45a9-9cfb-ed51b055bb95',
        title: 'Isıya Dayanıklı Cam Montajı',
        caption: 'Seramik fitil ile güvenli cam montaj şeması',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-pelet-soba-alev-goruntusu.png?alt=media&token=8c06e5c1-a622-4341-b5b8-e5dbb6810b04',
        title: 'Isıya Dayanıklı Cam Endüstriyel ve Evsel Kullanım',
        caption: 'Endüstriyel fırın ve şöminelerde termal cam uygulaması',
      },
    ],
  },
  // 7. Yangın Camı
  {
    loc: `${DOMAIN}/yangin-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fe30-yangin-cami-fiyat-hesaplama.png?alt=media&token=6749f48f-5eca-4d5b-9ae0-3bd64439592a',
        title: 'E30 Yangın Camı',
        caption: 'E30 sınıfı yangına dayanıklı cam alev ve duman bariyeri',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-sertifikali-urun.png?alt=media&token=cf251cee-46cb-4e7b-8a77-0f0038df006d',
        title: 'Sertifikalı Yangın Camı Plakası',
        caption: 'Çok katmanlı intümesan jel dolgulu yangın camı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-dograma-olcusu.png?alt=media&token=a4ae92c4-0980-410c-aaf3-18fa8ab9a45a',
        title: 'Yangın Camı Doğrama Ölçüsü',
        caption: 'Yangın doğramasında çıta payı ve cam ölçüsü alma',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-montaj-detayi.png?alt=media&token=d8bfba88-bb37-4b6d-81e0-42e3932149a7',
        title: 'Yangın Camı Montajı',
        caption: 'Yangın takozu ve intümesan mastik ile montaj',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-yangin-bolme-duvari.png?alt=media&token=887277ab-8b97-45bb-84b3-4677c1431ab8',
        title: 'Yangın Bölme Duvarı Uygulaması',
        caption: 'Mimari projelerde kaçış koridoru yangın bölme duvarı',
      },
    ],
  },
  // 8. Yangına Dayanıklı Cam
  {
    loc: `${DOMAIN}/yangina-dayanikli-cam`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fe60-yangina-dayanikli-cam-fiyat-hesaplama.png?alt=media&token=2f171f7c-b522-4077-aa31-116001c6148e',
        title: 'E60 Yangına Dayanıklı Cam',
        caption: '60 dakika yangın bütünlüğü sağlayan E60 yangın camı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-sertifikali-urun.png?alt=media&token=cf251cee-46cb-4e7b-8a77-0f0038df006d',
        title: 'E60 Yangına Dayanıklı Cam Kesiti',
        caption: 'Yüksek optik netlik ve yangın bariyer katmanları',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-dograma-olcusu.png?alt=media&token=a4ae92c4-0980-410c-aaf3-18fa8ab9a45a',
        title: 'E60 Yangın Camı Doğrama Ölçüsü',
        caption: 'Genişlik, yükseklik ve çıta derinliği hesabı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-montaj-detayi.png?alt=media&token=d8bfba88-bb37-4b6d-81e0-42e3932149a7',
        title: 'E60 Yangına Dayanıklı Cam Takılması',
        caption: 'Isıya dayanıklı sert takoz ve sızdırmaz fitil ile montaj',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-yangin-bolme-duvari.png?alt=media&token=887277ab-8b97-45bb-84b3-4677c1431ab8',
        title: 'Modern Ofis Yangın Bölme Duvarı',
        caption: 'Şeffaflık ve güvenliğin birleştiği mimari yangın bölmesi',
      },
    ],
  },
  // 9. Yangın Kapısı Camı
  {
    loc: `${DOMAIN}/yangin-kapisi-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fe90-yangin-kapisi-cami-fiyat-hesaplama.png?alt=media&token=8b792855-cf59-4f89-a16c-9f3adeb278ef',
        title: 'E90 Yangın Kapısı Camı',
        caption: 'Çelik ve ahşap yangın kapıları için gözetleme vision paneli',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-sertifikali-urun.png?alt=media&token=cf251cee-46cb-4e7b-8a77-0f0038df006d',
        title: 'Yangın Kapısı Vision Panel Camı',
        caption: 'Sertifikalı çok katmanlı gözetleme camı ünitesi',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-dograma-olcusu.png?alt=media&token=a4ae92c4-0980-410c-aaf3-18fa8ab9a45a',
        title: 'Kapı Kanadında Vision Panel Ölçümü',
        caption: 'Standart dikdörtgen ve dairesel yangın camı ölçü alma',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-montaj-detayi.png?alt=media&token=d8bfba88-bb37-4b6d-81e0-42e3932149a7',
        title: 'Çelik Çerçeve ile Kapıya Cam Montajı',
        caption: 'Çift taraflı çelik çerçeveli sızdırmaz yangın camı montajı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-yangin-bolme-duvari.png?alt=media&token=887277ab-8b97-45bb-84b3-4677c1431ab8',
        title: 'Acil Çıkış Kapısında Camlı Kullanım',
        caption: 'Acil durumlarda arkasını gösteren güvenli yangın kapısı',
      },
    ],
  },
  // 10. Yangın Güvenlik Camı
  {
    loc: `${DOMAIN}/yangin-guvenlik-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei30-yangin-guvenlik-cami-fiyat-hesaplama.png?alt=media&token=14023cd3-c9e3-40b4-8707-d01e6b17c260',
        title: 'EI30 Yangın Güvenlik Camı',
        caption: 'EI30 alev, duman ve radyasyon ısısını bloke eden güvenlik camı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-sertifikali-urun.png?alt=media&token=cf251cee-46cb-4e7b-8a77-0f0038df006d',
        title: 'EI30 Yangın Güvenlik Camı Ünitesi',
        caption: 'Şeffaf ve darbe dayanımlı yangın bariyeri',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-dograma-olcusu.png?alt=media&token=a4ae92c4-0980-410c-aaf3-18fa8ab9a45a',
        title: 'Geniş Açıklıklı Cam Alanı Ölçümü',
        caption: 'Profil toleransları ve çıta payları hesabı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-montaj-detayi.png?alt=media&token=d8bfba88-bb37-4b6d-81e0-42e3932149a7',
        title: 'Sertifikalı Çelik Yangın Doğraması Montajı',
        caption: 'Yanmaz takoz ve sızdırmazlık fitili uygulaması',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-yangin-bolme-duvari.png?alt=media&token=887277ab-8b97-45bb-84b3-4677c1431ab8',
        title: 'Kamu Binasında Yangın Güvenlik Duvarı',
        caption: 'Acil kaçış yollarında maksimum can güvenliği',
      },
    ],
  },
  // 11. Yangın Emniyet Camı
  {
    loc: `${DOMAIN}/yangin-emniyet-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei60-yangin-emniyet-cami-fiyat-hesaplama.png?alt=media&token=68b9bcf6-8f48-412e-b1b2-dbe52207b7f7',
        title: 'EI60 Yangın Emniyet Camı',
        caption: '1B1 darbe dayanımlı ve 60 dakika yangın emniyet camı',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-sertifikali-urun.png?alt=media&token=cf251cee-46cb-4e7b-8a77-0f0038df006d',
        title: 'EI60 Yangın Emniyet Camı Kesiti',
        caption: 'Darbe ve yangına aynı anda dirençli kompozit cam',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-dograma-olcusu.png?alt=media&token=a4ae92c4-0980-410c-aaf3-18fa8ab9a45a',
        title: 'EI60 Yangın Camı Ölçü Alma',
        caption: 'Kalın camlar için profil derinliği ve cam payı tespiti',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-montaj-detayi.png?alt=media&token=d8bfba88-bb37-4b6d-81e0-42e3932149a7',
        title: 'Emniyetli Yangın Camı Montajı',
        caption: 'Darbe emici fitiller ile güvenli kilitleme',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-yangin-bolme-duvari.png?alt=media&token=887277ab-8b97-45bb-84b3-4677c1431ab8',
        title: 'Okul ve Hastane Yangın Emniyet Duvarı',
        caption: 'İnsan sirkülasyonunun yüksek olduğu alanlarda yangın güvenliği',
      },
    ],
  },
  // 12. Yangın Dayanımlı Cam
  {
    loc: `${DOMAIN}/yangin-dayanimli-cam`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-fiyat-hesaplama.png?alt=media&token=7044bccc-a18e-49d7-b1fe-7040d30636c4',
        title: 'EI90 Yangın Dayanımlı Cam',
        caption: '90 dakika tam yangın ve ısı bariyeri sağlayan EI90 cam',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-sertifikali-urun.png?alt=media&token=cf251cee-46cb-4e7b-8a77-0f0038df006d',
        title: 'Sertifikalı EI90 Yangın Dayanımlı Cam',
        caption: 'Isı ve alev bariyeri intümesan katmanlı cam',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-dograma-olcusu.png?alt=media&token=a4ae92c4-0980-410c-aaf3-18fa8ab9a45a',
        title: 'EI90 Doğrama Net Ölçü Tespiti',
        caption: 'Tolerans ve çıta derinliği tespiti',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-montaj-detayi.png?alt=media&token=d8bfba88-bb37-4b6d-81e0-42e3932149a7',
        title: 'Sertifikalı Yangın Camı Montajı',
        caption: 'Yangın takozu ve intümesan fitil uygulaması',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-yangin-bolme-duvari.png?alt=media&token=887277ab-8b97-45bb-84b3-4677c1431ab8',
        title: 'Mimari Yangın Zonlama Duvarı',
        caption: 'Yangının yayılmasını durduran şeffaf mimari bariyer',
      },
    ],
  },
  // 13. Temperli Cam
  {
    loc: `${DOMAIN}/temperli-cam`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322',
        title: 'EN 12150 Sertifikalı Temperli Cam',
        caption: '5 kat mukavemetli şeffaf emniyet camı ve rodajlı kenar',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-dograma-olcusu.png?alt=media&token=a4ae92c4-0980-410c-aaf3-18fa8ab9a45a',
        title: 'Temperli Cam Kapı ve Delik Aksı Ölçümü',
        caption: 'Menteşe delikleri ve köşe boşluklarının hassas tespiti',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-montaj-detayi.png?alt=media&token=d8bfba88-bb37-4b6d-81e0-42e3932149a7',
        title: 'Contalı Menteşe ve Korkuluk Montajı',
        caption: 'Camı metale değdirmeyen kauçuk contalı sabitleme',
      },
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-yangin-bolme-duvari.png?alt=media&token=887277ab-8b97-45bb-84b3-4677c1431ab8',
        title: 'Mimari Cam Kapı ve Korkuluk',
        caption: 'Modern ofiste temperli cam kapı ve korkuluk',
      },
    ],
  },

  // 3. Diğer Canonical Sayfalar
  {
    loc: `${DOMAIN}/yangin-camlari`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.85,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322',
        title: 'Yangına Dayanıklı Cam Sistemleri',
        caption: 'E, EW ve EI sınıflarında yangına dayanıklı mimari camlar',
      },
    ],
  },
  {
    loc: `${DOMAIN}/urunler`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322',
        title: 'MimariCam Ürün Kataloğu',
        caption: 'Yangın ve şömine camları ürün kataloğu',
      },
    ],
  },
  {
    loc: `${DOMAIN}/projeler`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: 0.75,
  },
  {
    loc: `${DOMAIN}/teknik-bilgi`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: 0.75,
  },
  {
    loc: `${DOMAIN}/teklif-al`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: 0.75,
  },
  {
    loc: `${DOMAIN}/anasayfa`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },

  // 4. Kategori Sayfaları (/kategori/...)
  {
    loc: `${DOMAIN}/kategori/yangin-camlari`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/isiya-dayanikli-camlar`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/somine-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/soba-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/robax-cam-seramik`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/temperli-camlar`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/lamine-camlar`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/mimari-camlar`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/cephe-camlari`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/ozel-olcu-cam`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/kategori/endustriyel-cam`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },

  // 5. Ürün Detay Sayfaları (/urun/...)
  {
    loc: `${DOMAIN}/urun/yangin-cami-ei60-flameguard`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322',
        title: 'MimariCam FlameGuard EI60 Yangın Camı',
        caption: '60 dakika yangın ve ısı yalıtımı sağlayan yangın camı',
      },
    ],
  },
  {
    loc: `${DOMAIN}/urun/yangin-cami-ei30-flameguard`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322',
        title: 'MimariCam FlameGuard EI30 Yangın Camı',
        caption: '30 dakika yangın alevi ve ısı geçişini engelleyen yangın camı',
      },
    ],
  },
  {
    loc: `${DOMAIN}/urun/yangin-cami-ei90-flameguard`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322',
        title: 'MimariCam HeavyDuty EI90 Yangın Camı',
        caption: '90 dakika tam yangın ve ısı bariyeri sağlayan yangın camı',
      },
    ],
  },
  {
    loc: `${DOMAIN}/urun/yangin-cami-ei120-flameguard`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322',
        title: 'MimariCam Fortress EI120 Yangın Camı',
        caption: '120 dakika kesintisiz yangın bütünlüğü sağlayan yangın camı',
      },
    ],
  },
  {
    loc: `${DOMAIN}/urun/schott-robax-somine-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8,
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322',
        title: 'SCHOTT ROBAX Orijinal Şömine ve Soba Camı',
        caption: '800 dereceye dayanıklı orijinal Alman Schott ROBAX seramik cam',
      },
    ],
  },
  {
    loc: `${DOMAIN}/urun/ozel-olcu-kavisli-ve-delikli-cam`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    loc: `${DOMAIN}/urun/akustik-lamine-guvenlik-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    loc: `${DOMAIN}/urun/gunes-kontrol-low-e-cephe-cami`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.7,
  },

  // 6. Şehir / GEO Sayfaları (/sehir/...)
  {
    loc: `${DOMAIN}/sehir/istanbul`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${DOMAIN}/sehir/ankara`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${DOMAIN}/sehir/izmir`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${DOMAIN}/sehir/bursa`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${DOMAIN}/sehir/antalya`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: 0.7,
  },

  // 7. Kurumsal & Yasal Sayfalar
  {
    loc: `${DOMAIN}/hakkimizda`,
    lastmod: CURRENT_DATE,
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    loc: `${DOMAIN}/mesafeli-satis-sozlesmesi`,
    lastmod: CURRENT_DATE,
    changefreq: 'yearly',
    priority: 0.4,
  },
  {
    loc: `${DOMAIN}/gizlilik-ve-guvenlik`,
    lastmod: CURRENT_DATE,
    changefreq: 'yearly',
    priority: 0.4,
  },
  {
    loc: `${DOMAIN}/iptal-ve-iade-kosullari`,
    lastmod: CURRENT_DATE,
    changefreq: 'yearly',
    priority: 0.4,
  },
  {
    loc: `${DOMAIN}/kisisel-veriler-politikasi`,
    lastmod: CURRENT_DATE,
    changefreq: 'yearly',
    priority: 0.4,
  },
  {
    loc: `${DOMAIN}/cerez-politikasi`,
    lastmod: CURRENT_DATE,
    changefreq: 'yearly',
    priority: 0.4,
  },
];

export function generateSitemapXml(): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  for (const item of SITEMAP_URLS) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(item.loc)}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority.toFixed(1)}</priority>\n`;

    if (item.images && item.images.length > 0) {
      // Deduplicate images by loc
      const seenLocs = new Set<string>();
      for (const img of item.images) {
        if (!seenLocs.has(img.loc)) {
          seenLocs.add(img.loc);
          xml += '    <image:image>\n';
          xml += `      <image:loc>${escapeXml(img.loc)}</image:loc>\n`;
          if (img.title) {
            xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
          }
          if (img.caption) {
            xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
          }
          xml += '    </image:image>\n';
        }
      }
    }

    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}

// Write to public/sitemap.xml
const targetPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
const xmlContent = generateSitemapXml();
fs.writeFileSync(targetPath, xmlContent, 'utf-8');
console.log(`Successfully generated valid sitemap at ${targetPath}`);
