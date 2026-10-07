import { LegalPage, LegalPageSlug } from '../types';

export interface LegalPageDefinition {
  slug: LegalPageSlug;
  title: string;
  iconName: string;
  summary: string;
  defaultContent: string;
}

export const LEGAL_PAGES_CONFIG: LegalPageDefinition[] = [
  {
    slug: 'hakkimizda',
    title: 'Hakkımızda',
    iconName: 'Building2',
    summary: 'MimariCam / Gala Makina yüksek ısı ve mimari cam işleme teknolojileri',
    defaultContent: `## MimariCam & Gala Makina Hakkında

**MimariCam**, endüstriyel fırın, soba, şömine ve mimari cam sistemleri alanında çeyrek asırlık imalat ve mühendislik tecrübesine sahip **Gala Makina** çatısı altında faaliyet gösteren özel ölçü cam ve metal işleme markasıdır.

Şirketimiz, Almanya merkezli dünya devi **SCHOTT AG** üretimi **SCHOTT ROBAX®** cam seramiklerinin yetkili işleme, CNC kesim, rodaj, delik ve kavis büküm standartlarına tam uyumlu olarak Türkiye genelinde doğrudan tüketiciye ve sektör profesyonellerine ulaştırmaktadır.

### Faaliyet Alanlarımız ve Uzmanlıklarımız
1. **Şömine ve Soba Camları (SCHOTT ROBAX®):** 800°C'ye kadar ani termal şoklara ve yüksek çalışma sıcaklıklarına dayanıklı, sıfır genleşme katsayısına sahip orijinal Alman menşeili cam seramikler.
2. **Özel Ölçü Metal Şömine Kapakları:** Milimetrik lazer kesim, ısıya dayanıklı elektrostatik fırın boyalı, fitilli ve kavisli (kemerli) her türlü açık şömine haznesine özel kapak sistemleri.
3. **Yangına Dayanıklı Mimari Camlar:** Akredite laboratuvar onaylı, EN 1364 standartlarında E, EW ve EI30 - EI120 sınıfı yangın durdurucu cam üniteleri.
4. **Endüstriyel Isıtma ve Pelet Ekipmanları:** Yüksek verimli çevre dostu ısıtma sistemleri yedek parça ve cam tedariği.

### Kalite ve İmalat İlkemiz
Her siparişiniz, Erzurum Pasinler Yeni Sanayi Sitesi'ndeki modern CNC cam işleme ve metal fabrikamızda son teknoloji tezgahlarla milimetrik tolerans dahilinde üretilmektedir. Özel ahşap sandıklı, strafor destekli ve kırılmaya karşı **%100 kargo garantili** ambalajlama standartlarımız sayesinde ürünleriniz Türkiye'nin 81 iline ve yurt dışına hasarsız sevk edilmektedir.

* **Firma Ünvanı:** Gala Makina & MimariCam İmalat Sanayi
* **Adres:** Kethüda Mah. Transit Cad. Yeni Sanayi Sitesi No: 173/13B, 25300 Pasinler, Erzurum / Türkiye
* **Telefon:** +90 542 145 25 25 / 0442 606 07 75
* **E-Posta:** info@mimaricam.com
* **Web:** mimaricam.com / mimaricam.com.tr`,
  },
  {
    slug: 'mesafeli-satis-sozlesmesi',
    title: 'Mesafeli Satış Sözleşmesi',
    iconName: 'FileText',
    summary: '6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca mesafeli satış şartları',
    defaultContent: `## Mesafeli Satış Sözleşmesi

### Madde 1 - Taraflar
**Satıcı:**
* **Ünvan:** Gala Makina - MimariCam İmalat Sanayi
* **Adres:** Kethüda Mah. Transit Cad. Yeni Sanayi Sitesi No: 173/13B Pasinler / Erzurum
* **Telefon:** +90 542 145 25 25 / 0442 606 07 75
* **E-posta:** info@mimaricam.com
* **Mersis / Vergi No:** Erzurum V.D. - 3880456128

**Alıcı:**
mimaricam.com internet sitesi üzerinden sipariş oluşturan, ölçü giren ve ödeme/onay gerçekleştiren gerçek veya tüzel kişi ("Müşteri").

---

### Madde 2 - Sözleşmenin Konusu
İşbu Sözleşme, Alıcı'nın Satıcı'ya ait mimaricam.com internet sitesinden elektronik ortamda siparişini verdiği, nitelikleri ve satış fiyatı web sitesinde belirtilen özel ölçü şömine camı, SCHOTT ROBAX® cam seramik, şömine kapağı ve yangın camı ürünlerinin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.

---

### Madde 3 - Sipariş, Fiyatlandırma ve Ödeme
1. Sitede yer alan konfigüratör aracılığıyla girilen genişlik (G), yükseklik (Y / Y1 / Y2) ve kavis parametrelerine göre anlık hesaplanan fiyat geçerlidir.
2. Fiyatlara aksi belirtilmedikçe KDV dahildir.
3. Ödemeler banka havalesi/EFT, güvenli online kredi kartı ödemesi veya mutabık kalınan resmi kanallar üzerinden tahsil edilir.

---

### Madde 4 - Teslimat ve Kargo Güvencesi
1. Özel ölçü cam ve metal kapak siparişleri, onay tarihinden itibaren iş yoğunluğuna bağlı olarak **2 ila 5 iş günü** içerisinde imal edilerek kargoya teslim edilir.
2. Ürünler darbe emici polietilen köpük, strafor ve güçlendirilmiş mukavva/ahşap koruma sandıklarında sevk edilir.
3. Kargo teslimi sırasında ambalajda belirgin hasar bulunması halinde tutanak tutulması tavsiye edilir; ancak MimariCam nakliye kaynaklı kırılmaları müşteri mağduriyeti yaratmaksızın **birebir yenileme garantisi** ile telafi etmektedir.

---

### Madde 5 - Cayma Hakkı ve İstisnaları (Özel İmalat Hükmü)
1. **6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği'nin 15. Maddesinin (b) bendi uyarınca:** *"Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz."*
2. Müşterinin kendi verdiği milimetrik ölçülere (en, boy, kavis, delik, özel kesim) göre imal edilen şömine camları ve metal şömine kapakları **kişiselleştirilmiş özel üretim** kapsamındadır.
3. Bu nedenle, üretim hatası veya yanlış ölçü kesimi Satıcı'dan kaynaklanmadığı sürece, Alıcı'nın keyfi cayma ve iade hakkı bulunmamaktadır. Alıcı, sipariş onayından önce ölçülerini dikkatle kontrol etmekle yükümlüdür.
4. Standart fabrika çıkışlı, kesilmemiş ve üzerinde işlem yapılmamış aksesuarlarda cayma hakkı 14 gündür.

---

### Madde 6 - Yetkili Mahkeme
İşbu sözleşmeden doğabilecek uyuşmazlıklarda Sanayi ve Ticaret Bakanlığı'nca ilan edilen değere kadar Tüketici Hakem Heyetleri, bu değerin üzerindeki ihtilaflarda Erzurum Tüketici Mahkemeleri ve İcra Daireleri yetkilidir.`,
  },
  {
    slug: 'gizlilik-ve-guvenlik',
    title: 'Gizlilik ve Güvenlik',
    iconName: 'ShieldCheck',
    summary: '256-bit SSL şifreleme, veri güvenliği ve ödeme altyapısı politikaları',
    defaultContent: `## Gizlilik ve Güvenlik Politikası

**MimariCam (mimaricam.com)** olarak müşterilerimizin ve ziyaretçilerimizin güvenliğine en üst düzeyde önem veriyoruz. Sitemiz üzerinden gerçekleştirilen tüm veri transferleri ve sipariş süreçleri uluslararası güvenlik protokolleri ile korunmaktadır.

---

### 1. 256-Bit SSL Sertifikalı Şifreleme
* Sitemizdeki tüm sayfalar ve formlar, 256-bit SSL (Secure Sockets Layer) şifreleme sertifikası ile korunmaktadır.
* Tarayıcınız ile sunucularımız arasındaki tüm veri trafiği şifreli olarak iletilir ve üçüncü şahıslar tarafından dinlenemez, müdahale edilemez.

---

### 2. Kredi Kartı ve Ödeme Güvenliği
* MimariCam, hiçbir müşterisinin kredi kartı numarasını, CVV kodunu veya kart şifresini **sunucularında veya veritabanında kesinlikle saklamaz**.
* Online ödeme işlemleri, BDDK lisanslı güvenli ödeme kuruluşları ve bankaların 3D Secure onay sistemleri üzerinden doğrudan banka altyapısında tamamlanır.

---

### 3. Kişisel Bilgilerin Korunması
* Sipariş esnasında veya teklif formlarında paylaştığınız ad, soyad, telefon, teslimat adresi ve e-posta bilgileriniz sadece siparişin imalatı, faturası ve kargo teslimatı amacıyla kullanılır.
* Bilgileriniz yasal zorunluluklar ve adli mercilerin resmi talepleri haricinde hiçbir şekilde üçüncü kişi, kurum veya reklam ağları ile ticari amaçla paylaşılmaz, satılmaz.

---

### 4. Sistem Güvenliği ve Altyapı
* Veritabanı altyapımız Google Cloud ve Firebase kurumsal bulut mimarisi üzerinde, otomatik yedeklemeli ve yetkisiz erişimlere karşı katı güvenlik duvarları (Zero-Trust Security Rules) ile korunmaktadır.
* Sistemlerimizde düzenli güvenlik açığı ve penetrasyon testleri uygulanmaktadır.`,
  },
  {
    slug: 'iptal-ve-iade-kosullari',
    title: 'İptal ve İade Koşulları',
    iconName: 'RefreshCw',
    summary: 'Özel ölçü imalat istisnaları, kırılma güvencesi ve iade süreçleri',
    defaultContent: `## İptal ve İade Koşulları

MimariCam üzerinden vermiş olduğunuz siparişlerin iptal, değişim ve iade süreçleri Tüketici Hakları Mevzuatı ve özel imalat standartlarına göre aşağıda açıklanmıştır:

---

### 1. Sipariş İptali
* Özel ölçü cam ve şömine kapakları sipariş verildikten sonra hızla CNC kesim ve metal hazırlık sürecine girmektedir.
* Siparişinizi, onayladığınız gün içerisinde henüz **imalat/kesim aşamasına geçilmeden önce** müşteri hizmetlerimizle (+90 542 145 25 25) iletişime geçerek iptal edebilir ve ödemenizin tamamını kesintisiz iade alabilirsiniz.
* Cam seramik plakası CNC tezgahında kesilmiş veya metal şömine kapağı kaynak/boya işlemine girmiş ürünlerde iptal işlemi gerçekleştirilememektedir.

---

### 2. İade Hakkı ve Özel Ölçü İstisnası
* **Kişiselleştirilmiş İmalat:** Sitemizdeki hesaplayıcı üzerinden tarafınızca milimetrik olarak belirlenen genişlik, yükseklik ve kavis ölçülerine göre kesilen camlar ve özel imal edilen kapaklar, Mesafeli Sözleşmeler Yönetmeliği m. 15/b uyarınca **cayma ve keyfi iade hakkı kapsamı dışındadır**.
* Bu ürünlerin başka bir şöminede veya alıcıda yeniden satılması mümkün olmadığından, ölçü hatası müşteriden kaynaklandığı takdirde iade kabul edilemez.
* **Üretim Kusurları:** Tarafımızdan kaynaklanan ölçü sapması (+/- 2 mm üzerindeki tolerans dışı hatalar), yanlış cam tipi gönderimi veya hatalı kavis bükümleri firmamızın %100 sorumluluğundadır. Bu durumlarda ürün derhal bedelsiz olarak yeniden üretilip gönderilir veya ücret iadesi yapılır.

---

### 3. Kargo Kırılma ve Hasar Garantisi
* Cam ürünler kırılmaya karşı özel ahşap sandık ve kalın koruyucu ambalajlarla kargolanır.
* Kargodan teslim aldığınız pakette kırık veya çatlak tespit etmeniz durumunda, paketin fotoğrafını çekerek aynı gün içinde WhatsApp (+90 542 145 25 25) hattımıza iletmeniz yeterlidir.
* Tutanak aranmaksızın, kırılan camınız **hiçbir ek ücret talep edilmeden** en geç 2 iş günü içinde yeniden imal edilip adresinize kargolanır.

---

### 4. İade Prosedürü (Standart Aksesuarlar İçin)
Özel kesim olmayan standart montaj contaları, temizleme spreyleri ve bağlantı aparatları için teslimat tarihinden itibaren 14 gün içinde ambalajı açılmamış ve kullanılmamış olmak kaydıyla iade talep edebilirsiniz. İade kargo bedeli Alıcı'ya aittir.`,
  },
  {
    slug: 'kisisel-veriler-politikasi',
    title: 'Kişisel Veriler Politikası (KVKK)',
    iconName: 'FileCheck',
    summary: '6698 sayılı Kişisel Verilerin Korunması Kanunu Aydınlatma Metni',
    defaultContent: `## Kişisel Verilerin Korunması ve İşlenmesi Politikası (KVKK)

**Gala Makina - MimariCam İmalat Sanayi** ("Şirket") olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin güvenliğine ve gizliliğine azami hassasiyet göstermekteyiz.

---

### 1. İşlenen Kişisel Verileriniz
Sitemizi ziyaret ettiğinizde ve sipariş oluşturduğunuzda aşağıdaki kişisel verileriniz işlenebilmektedir:
* **Kimlik Bilgileri:** Ad, soyad, T.C. kimlik numarası (fatura zorunluluğu halinde).
* **İletişim Bilgileri:** Telefon numarası, teslimat ve fatura adresi, e-posta adresi.
* **Müşteri İşlem Bilgisi:** Sipariş verilen cam ölçüleri, ürün tipi, kavis bilgileri, sipariş notları, fatura ve ödeme tutarları.
* **İşlem Güvenliği Bilgileri:** IP adresi, site içi gezinti logları, cihaz ve tarayıcı bilgileri.

---

### 2. Kişisel Verilerin İşlenme Amaçları
Toplanan kişisel verileriniz aşağıdaki hukuki ve ticari amaçlarla işlenmektedir:
* Özel ölçü cam ve metal şömine kapağı imalatının gerçekleştirilmesi,
* Siparişinizin adrese teslimi, kargo takibi ve montaj bilgilendirmelerinin yapılması,
* Yasal muhasebe, e-fatura ve vergi yükümlülüklerinin yerine getirilmesi,
* Satış sonrası garanti, hasar telafisi ve müşteri destek hizmetlerinin yürütülmesi,
* Web sitesinin teknik güvenliğinin ve performansının temin edilmesi.

---

### 3. Kişisel Verilerin Aktarılması
Kişisel verileriniz, yalnızca yukarıda belirtilen amaçların gerçekleştirilebilmesi için zorunlu olan taraflara aktarılır:
* Siparişinizin teslimi amacıyla anlaşmalı **kargo ve lojistik şirketleri** (Yurtiçi Kargo, MNG Kargo, Aras Kargo, ambar firmaları),
* Yasal mevzuat gereği yetkili kamu kurum ve kuruluşları (Gelir İdaresi Başkanlığı vb.),
* Bulut sunucu ve veri güvenliği altyapısı hizmeti sağlayıcıları (Google Cloud / Firebase).

---

### 4. KVKK Kapsamındaki Haklarınız (Madde 11)
Kanun'un 11. maddesi uyarınca veri sorumlusuna başvurarak;
* Kişisel verilerinizin işlenip işlenmediğini öğrenme,
* İşlenmişse buna ilişkin bilgi talep etme,
* İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,
* Eksik veya yanlış işlenmişse düzeltilmesini isteme,
* Kanun'un 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme haklarına sahipsiniz.

Başvurularınızı **info@mimaricam.com** e-posta adresine veya yazılı olarak Kethüda Mah. Transit Cad. Yeni Sanayi Sitesi No: 173/13B Pasinler / Erzurum adresimize iletebilirsiniz.`,
  },
  {
    slug: 'cerez-politikasi',
    title: 'Çerez Politikası',
    iconName: 'Cookie',
    summary: 'Web sitesinde kullanılan zorunlu, fonksiyonel ve analitik çerezler',
    defaultContent: `## Çerez (Cookie) Politikası

**MimariCam (mimaricam.com)** olarak sitemizden en verimli şekilde faydalanabilmeniz ve kullanıcı deneyiminizi geliştirebilmek adına çerezler (cookies) ve benzeri teknolojiler kullanmaktayız.

---

### 1. Çerez Nedir?
Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler web sitesinin daha verimli çalışmasını, tercihlerinizi hatırlamasını ve site sahiplerine analitik bilgiler sunmasını sağlar.

---

### 2. Sitemizde Kullanılan Çerez Türleri

#### A. Zorunlu Çerezler (Strictly Necessary Cookies)
Web sitemizin temel fonksiyonlarının çalışabilmesi için kesinlikle gereklidir. Şömine camı konfigüratöründe girdiğiniz ölçülerin (G, Y1, Y2), seçtiğiniz kapak ve cam seçeneklerinin sayfa yenilendiğinde kaybolmaması, oturum güvenliğinin sağlanması için kullanılır. Bu çerezler devre dışı bırakılamaz.

#### B. İşlevsel Çerezler (Functional Cookies)
Kullanıcı tercihlerini (örneğin seçilen şömine modeli, son hesaplanan ölçüler, dil tercihi) hatırlayarak size kişiselleştirilmiş ve kolay bir alışveriş deneyimi sunar.

#### C. Performans ve Analiz Çerezleri (Analytical Cookies)
Ziyaretçilerin web sitemizi nasıl kullandığını anlamamıza yardımcı olur (hangi sayfaların daha çok ziyaret edildiği, hata sayfaları, sayfa yüklenme süreleri). Bu veriler anonim olarak toplanır ve sitemizi geliştirmemize olanak tanır.

---

### 3. Çerezleri Nasıl Kontrol Edebilirsiniz?
Tarayıcınızın ayarlarını değiştirerek çerez tercihlerinizi dilediğiniz zaman yönetebilirsiniz. Çerezleri tamamen engelleyebilir, daha önce kaydedilmiş çerezleri silebilir veya bir çerez kaydedilmek istendiğinde uyarı almayı seçebilirsiniz.

* **Google Chrome:** Ayarlar > Gizlilik ve Güvenlik > Çerezler ve Diğer Site Verileri
* **Mozilla Firefox:** Seçenekler > Gizlilik ve Güvenlik > Çerezler ve Site Verileri
* **Safari:** Tercihler > Gizlilik > Çerezleri ve Web Sitesi Verilerini Yönet
* **Microsoft Edge:** Ayarlar > Site İzinleri > Çerezler ve Site Verileri

*Not: Zorunlu çerezlerin engellenmesi halinde şömine camı konfigüratörü ve sipariş hesaplama işlevleri düzgün çalışmayabilir.*`,
  },
];

export const getSeedLegalPage = (slug: string): LegalPage | null => {
  const found = LEGAL_PAGES_CONFIG.find((p) => p.slug === slug);
  if (!found) return null;
  return {
    id: found.slug,
    slug: found.slug,
    title: found.title,
    summary: found.summary,
    content: found.defaultContent,
    updatedAt: new Date().toISOString(),
    isCustom: false,
  };
};
