import { CategorySeoItem } from './categorySeoTypes';

export const CATEGORY_SEO_LIST: CategorySeoItem[] = [
  // 1. Seramik Cam
  {
    slug: 'seramik-cam',
    path: '/seramik-cam',
    name: 'Seramik Cam',
    navTitle: 'Seramik Cam',
    title: 'Seramik Cam – 800°C Isıya ve Termal Şoka Dayanıklı Cam Seramik',
    metaDescription: 'SCHOTT ROBAX® lityum-alüminosilikat seramik camlar. Sıfır genleşme katsayısı, 800°C termal şok dayanımı, özel ölçü CNC kesim ve güvenli montaj çözümleri.',
    canonical: 'https://mimaricam.com/seramik-cam',
    h1: 'Seramik Cam (Cam Seramik) – Yüksek Termal Dirençli Özel Ölçü Çözümler',
    badge: '800°C Sürekli Termal Şok Dayanımı | Sıfıra Yakın Isıl Genleşme',
    intro: 'Seramik cam (lityum-alüminosilikat cam-seramik), klasik camlardan farklı olarak mikrokristalin yapısı sayesinde termal genleşme katsayısı neredeyse sıfır olan ileri teknoloji bir malzemedir. Doğrudan açık alev ve 800°C sıcaklığa maruz kalsa dahi çatlamaz ve biçim değiştirmez.',
    searchIntentSummary: 'Seramik camın ne olduğunu, teknik farklarını, kullanım alanlarını, milimetrik ölçü alma tekniklerini ve montajda dikkat edilmesi gereken genleşme toleranslarını keşfedin.',
    whatIs: {
      title: 'Seramik Cam Nedir ve Standart Camdan Farkı Nelerdir?',
      description: 'Seramik cam, özel bir ısıyla seramizasyon sürecinden geçirilmiş lityum-alüminosilikat matristir. Standart pencere camı (float cam) 80°C sıcaklık farkında, temperli cam ise 250-300°C aralığında çatlarken; seramik cam 800°C ani sıcaklık değişimine ve doğrudan alev temasına mükemmel direnç gösterir.',
      highlights: [
        'Termal Genleşme Katsayısı: Yaklaşık (-0.3 ile +0.1) x 10^-6 K^-1 (pratikte sıfır genleşme)',
        'Kullanım Sıcaklığı: Sürekli 700°C, kısa süreli piklerde 800°C',
        'Işık Geçirgenliği: %88 üzerinde şeffaflık ve alev parlaklığı',
        'Yüksek Kalite Marka: SCHOTT ROBAX® orijinal cam-seramik plakalar'
      ]
    },
    whereUsed: {
      title: 'Seramik Camın Temel Kullanım Alanları',
      items: [
        { name: 'Şömine Hazneleri', desc: 'Kapalı döküm şömineler, asansörlü kapaklar ve özel tasarım köşe hazneler.' },
        { name: 'Pelet ve Odun Sobaları', desc: 'Yüksek yanma odası sıcaklığına sahip hermetik ve otomatik pelet sobaları.' },
        { name: 'Kuzineler ve Taş Fırınlar', desc: 'Fırın içi gözetleme ve alev kapaklarında doğrudan sıcaklık teması.' },
        { name: 'Laboratuvar ve Endüstriyel Fırınlar', desc: 'Gözetleme pencereleri, termal fırın vizörleri ve kurutma hatları.' }
      ]
    },
    howToMeasure: {
      title: 'Seramik Cam Ölçüsü Nasıl Alınır?',
      steps: [
        { step: 1, title: 'Kapak Yuvasını Temizleyin', desc: 'Eski cam kalıntılarını, kurumuş yapışkanları ve yanmış eski fitilleri tel fırça ve kazıyıcı ile tamamen arındırın.' },
        { step: 2, title: 'İç Metal Yuvanın Net Ölçüsünü Alın', desc: 'Çelik şerit metreyle metal yuvanın içten içe genişlik ve yükseklik ölçüsünü milimetre cinsinden ölçün.' },
        { step: 3, title: 'Gerekli Montaj Boşluğunu (Toleransı) Düşün', desc: 'Metalin ısıyla genleşmesini karşılamak için ölçtüğünüz genişlik ve yükseklikten toplam 4 ila 6 mm (her kenardan 2-3 mm) eksilterek sipariş verin.' }
      ],
      toleranceTip: 'Cam yuvası 500x400 mm ise, camınızı 495x395 mm olarak kestiriniz. Cam asla metal çerçeveye birebir sıkışmamalıdır.'
    },
    howToInstall: {
      title: 'Seramik Cam Nasıl Monte Edilir?',
      steps: [
        { step: 1, title: 'Isıya Dayanıklı Fitili Yerleştirin', desc: 'Metal yuvanın tabanına kendinden yapışkanlı seramik elyaf veya cam elyaf fitili gerdirmeden yapıştırın.' },
        { step: 2, title: 'Camı Ortalayarak Oturtun', desc: 'Seramik camı fitilin üzerine yerleştirin; dört bir kenarında metal ile en az 2 mm hava boşluğu kaldığından emin olun.' },
        { step: 3, title: 'Kıskaç Vidalarını Aşırı Sıkmadan Sabitleyin', desc: 'Tutucu metal tırnakların altına da fitil koyup vidaları yalnızca parmak gücüyle, sıkışma yaratmayacak şekilde tutturun.' }
      ]
    },
    installationCautions: {
      title: 'Montajda Dikkat Edilmesi Gereken Kritik Noktalar',
      points: [
        { title: 'Metal İle Cam Doğrudan Temas Etmemelidir', desc: 'Metal ile cam arasına mutlaka ısıyla dayanıklı yanmaz fitil yerleştirilmelidir.', isWarning: true },
        { title: 'Vidaları Sonuna Kadar Sıkmayın', desc: 'Vidalar aşırı sıkıldığında metal kapak ısınarak genleşir ve camın köşesini kırar.', isWarning: true },
        { title: 'Asla Sert Mastik veya Silikon Kullanmayın', desc: 'Donup sertleşen yapıştırıcılar esneme payını yok ederek ilk yakışta camı patlatabilir.', isWarning: true },
        { title: 'Kapak Contasını Yılda Bir Kez Yenileyin', desc: 'Sertleşen fitiller darbe emiciliğini kaybeder, sızdırmazlık ve güvenlik azalır.' }
      ]
    },
    whyGlassCracks: {
      title: 'Seramik Cam Neden Çatlar?',
      summary: 'Seramik camlar alev sıcaklığından dolayı çatlamaz; mekanik gerilim, metal çerçeve sıkışması ve yetersiz esneme payı nedeniyle çatlar.',
      thermalExpansionExplanation: 'Seramik camın genleşme katsayısı neredeyse sıfırdır, ancak etrafındaki çelik veya döküm çerçeve ısıyla ciddi oranda genleşir. Boşluk bırakılmazsa genişleyen metal camı mengene gibi sıkar.',
      overtighteningExplanation: 'Montaj vidaları tornavidayla aşırı sıkıldığında tork kuvveti camın köşesinde kılcal mikro çatlaklar başlatır ve ilk ateşlemede cam kırılır.',
      gasketExplanation: 'Cam doğrudan metal metale temas ederse sertlik farkından ötürü lokal gerilim kırılması meydana gelir. Uygun seramik fitil olmadan montaj yapılamaz.',
      preventionRules: [
        'Metal yuvadan en az 4 mm daha ufak cam sipariş edin (her kenardan 2 mm tolerans payı).',
        'Vidaları sıkarken tırnakların camı gevşekçe tutmasını sağlayın; cam elinizle hafifçe titreşebilmelidir.',
        'Her zaman 800°C dayanımlı cam elyaf fitil kullanın.'
      ]
    },
    priceCalculationInfo: {
      title: 'Fiyat Nasıl Hesaplanır?',
      explanation: 'Seramik cam fiyatı, istenen genişlik ve yükseklik ölçülerine göre hesaplanan alan (metrekare), cam seramik kalınlığı (standart 4 mm) ve kenar işleme (rodaj/pah) detaylarına göre belirlenir.',
      standardThickness: '4 mm SCHOTT ROBAX® Orijinal Plaka',
      steps: [
        'Genişlik (cm) ve Yükseklik (cm) çarpılarak alan bulunur (m²).',
        'Cam alanı metrekare birim fiyatı ile çarpılır.',
        'Köşe rodajı veya özel CNC form kesimi varsa ek işçilik uygulanır.'
      ]
    },
    visuals: {
      product: { title: 'SCHOTT ROBAX® 4mm Seramik Cam', alt: 'SCHOTT ROBAX seramik cam plaka kesimi', desc: 'Orijinal seramik cam levha yüksek ışık geçirgenliği ve pürüzsüz yüzey', tag: 'Ürün' },
      measure: { title: 'Çerçeve İçi Milimetrik Ölçü Alma', alt: 'Şömine kapak yuvasında cam ölçüsü alma tekniği', desc: 'Metal yuvadan tolerans payı düşülerek alınan net ölçüm şeması', tag: 'Ölçü Alma' },
      install: { title: 'Fitil Destekli Güvenli Montaj', alt: 'Seramik elyaf fitil ile cam montajı', desc: 'Metal temasını önleyen seramik fitilli montaj detayı', tag: 'Montaj' },
      application: { title: 'Modern Kapalı Şömine ve Soba Kullanımı', alt: 'Seramik camlı şömine ve pelet sobası alev görüntüsü', desc: '800 dereceye dayanıklı estetik alev seyri', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru montaj: Cam ile metal arasında fitil ve 2mm genleşme boşluğu',
        correctDesc: 'Doğru: Çepeçevre esnek fitil ve vidalarda hareket payı mevcut.',
        incorrectAlt: 'Yanlış montaj: Cama doğrudan temas eden sıkılmış metal vidalar',
        incorrectDesc: 'Yanlış: Cam metale sürtüyor ve vidalar aşırı sıkılmış.'
      }
    },
    faqs: [
      { question: 'Seramik cam kesilebilir mi?', answer: 'Seramik cam fabrikasyon ortamında elmas ve CNC su jeti ile hassasça kesilir. Ev ortamında standart elmasla kesilmesi kırılmaya yol açabileceğinden tavsiye edilmez.' },
      { question: 'Seramik cam ile temperli cam arasındaki fark nedir?', answer: 'Temperli cam en fazla 250-300°C ani ısıya dayanır ve doğrudan ateşte patlar. Seramik cam ise 800°C termal şoka dayanıklıdır ve ateşe doğrudan temas edebilir.' },
      { question: 'Camın temizliği nasıl yapılmalıdır?', answer: 'Yalnızca cam tamamen soğuduktan sonra özel şömine camı temizleyicisi veya nemli bir beze batırılmış odun külü ile silinmelidir. Sıcak cama asla soğuk su sıkılmamalıdır.' }
    ],
    relatedCategorySlugs: ['soba-cami', 'somine-cami', 'pelet-soba-cami', 'isiya-dayanikli-cam']
  },

  // 2. Soba Camı
  {
    slug: 'soba-cami',
    path: '/soba-cami',
    name: 'Soba Camı',
    navTitle: 'Soba Camı',
    title: 'Soba Camı – Odun ve Kömür Sobaları İçin Isıya Dayanıklı Cam',
    metaDescription: 'Döküm odun ve kömür sobaları için yüksek ısıya dayanıklı ROBAX® soba camı. Kırılan soba camı değişimi, ölçü alma, yanmaz fitil ve güvenli montaj rehberi.',
    canonical: 'https://mimaricam.com/soba-cami',
    h1: 'Soba Camı – Döküm ve Sac Sobalar İçin Isıya Dayanıklı Özel Kesim Camlar',
    badge: 'Odun ve Kömür Sobalarına Uygun | Yüksek Isı Direnci',
    intro: 'Döküm soba, emaye soba ve sac sobaların yanma odası kapakları için özel olarak üretilen soba camları, yoğun köz ve yüksek alev sıcaklığına karşı tam koruma sağlar. Kırılan veya kararan soba camınızı milimetrik olarak yenileyebilirsiniz.',
    searchIntentSummary: 'Kırılan soba camınızı nasıl doğru ölçeceğinizi, odun veya kömür sobasına nasıl takacağınızı ve camın kararmasını ile çatlamasını nasıl önleyeceğinizi öğrenin.',
    whatIs: {
      title: 'Soba Camı Nedir?',
      description: 'Soba camı, odun ve linyit kömürünün yarattığı ani alev yükselmelerine dayanabilen özel cam-seramik malzemedir. Standart pencere camları ya da otomobil camları soba ısısına dayanamaz ve saniyeler içinde patlar. Bu sebeple soba kapaklarında yalnızca ROBAX® tipi cam-seramik kullanılmalıdır.',
      highlights: [
        '800°C ani ısı değişikliklerine dayanıklılık',
        'Köz sıçramalarına ve doğrudan odun alevine karşı direnç',
        'Her marka döküm soba kapağına özel ölçüde CNC kesim',
        'Yüksek şeffaflık ile keyifli alev izleme imkânı'
      ]
    },
    whereUsed: {
      title: 'Soba Camı Hangi Sobalarda Kullanılır?',
      items: [
        { name: 'Döküm Odun Sobaları', desc: 'İnter, Prity, Hosseven vb. tüm yerli ve ithal döküm gövdeli sobalar.' },
        { name: 'Kömürlü Salon Sobaları', desc: 'Yüksek kalori üreten linyit kömürü yakan şömine tipi salon sobaları.' },
        { name: 'Fırınlı Kuzine Sobaları', desc: 'Hem ısıtma hem pişirme sağlayan yayla ve köy kuzineleri.' },
        { name: 'Bahçe ve Veranda Sobaları', desc: 'Açık alan, kış bahçesi ve veranda döküm şömine sobaları.' }
      ]
    },
    howToMeasure: {
      title: 'Soba Camı Ölçüsü Nasıl Alınır?',
      steps: [
        { step: 1, title: 'Eski Cam Sağlamsa Doğrudan Ölçün', desc: 'Eski cam elinizdeyse en ve boyunu kumpas veya çelik metreyle milimetre olarak ölçün.' },
        { step: 2, title: 'Cam Kırıksa Kapak Yuvasını Ölçün', desc: 'Kapağın arka kısmındaki cam oluğunun içten içe en ve boyunu net olarak tespit edin.' },
        { step: 3, title: '4 mm Esneme Payı Düşün', desc: 'Döküm kapağın ısıl genleşmesi için ölçtüğünüz yuva ölçüsünden genişlik ve yükseklikte 4 mm pay çıkartın.' }
      ],
      toleranceTip: 'Örneğin soba kapağındaki cam yuvası 28x20 cm ise, sipariş ölçünüz 27.6x19.6 cm (276x196 mm) olmalıdır.'
    },
    howToInstall: {
      title: 'Soba Camı Değişimi ve Montajı',
      steps: [
        { step: 1, title: 'Kapağı Sökün ve Düz Zemine Alın', desc: 'Soba kapağını menteşelerinden çıkararak temiz, yumuşak bir bezin üzerine yatırın.' },
        { step: 2, title: 'Eski Fitil ve Cıvataları Temizleyin', desc: 'Eski sertleşmiş fitilleri kazıyın, cıvata yuvalarını pas sökücü ile temizleyin.' },
        { step: 3, title: 'Yeni Yanmaz Fitili Yerleştirin ve Camı Sıkıştırmadan Sabitleyin', desc: 'Kendinden yapışkanlı fitili çekip yapıştırın, camı yerleştirin ve baskı tırnaklarını tatlı sert sıkın.' }
      ]
    },
    installationCautions: {
      title: 'Soba Camı Montajında Yapılan Hatalar',
      points: [
        { title: 'Vidaları Alyan veya Penseyle Sonuna Kadar Sıkmak', desc: 'Döküm demir ısınıp genleştiğinde camı ezer ve cam orta yerinden çatlar.', isWarning: true },
        { title: 'Fitilsiz Doğrudan Demire Oturtmak', desc: 'Metal ile cam arasındaki sıcaklık iletim farkı camda gerilim çatlağı oluşturur.', isWarning: true },
        { title: 'Soba Yanarken Islak Odun Koyup Cama Değdirmek', desc: 'Yanan odunların cama doğrudan baskı yapması mekanik kırılma yaratır.' }
      ]
    },
    whyGlassCracks: {
      title: 'Soba Camı Neden Çatlar?',
      summary: 'Soba camı sıcaktan değil; kapak genleştiğinde camın sıkışmasından, odun darbesinden veya aşırı sıkılan vidalardan çatlar.',
      thermalExpansionExplanation: 'Döküm soba kapağı yüksek ısıyla genişler. Cam yuvasına sıfıra sıfır takılmış bir cam, kapağın genleşmesiyle sıkışarak kırılır.',
      overtighteningExplanation: 'Cam tutucu pabuçların vidaları tornavidayla aşırı sıkıldığında camın kenarından gerilim dalgası yayılır ve ilk yanmada kırılma olur.',
      gasketExplanation: 'Zamanla sertleşen veya hiç takılmayan fitil yüzünden demir çerçeve doğrudan cama basar ve şok dalgası camı patlatır.',
      preventionRules: [
        'Yuva ölçüsünden en az 4 mm küçük cam takın.',
        'Cam tutucu vidaları gevşek bırakın; cam tırnakların arasında hafifçe oynayabilmelidir.',
        'Soba kapağını kapatırken odunların cama çarpmamasına dikkat edin.'
      ]
    },
    priceCalculationInfo: {
      title: 'Soba Camı Fiyatı Nasıl Belirlenir?',
      explanation: 'Soba camı fiyatı camın genişlik ve boy ölçülerinden doğan net metrekareye ve kenar rodaj işlemine göre anında hesaplanır.',
      standardThickness: '4 mm Yüksek Isı Dirençli Cam Seramik',
      steps: [
        'Kapak ölçüsünü milimetre cinsinden girin.',
        'Cam alanı otomatik olarak m² birimine çevrilir.',
        'KDV dahil fiyat anında hesaplanır ve kargo koruma kasası eklenir.'
      ]
    },
    visuals: {
      product: { title: '4mm Özel Ölçü Soba Camı', alt: 'Döküm soba için özel kesim seramik soba camı', desc: 'Kenarları zımparalanmış el kesmeyen emniyetli soba camı', tag: 'Ürün' },
      measure: { title: 'Soba Kapağında Doğru Ölçü Alma', alt: 'Soba kapağı cam yuvası ölçümü', desc: 'Kapak tırnaklarının arasındaki net boşluğun tespiti', tag: 'Ölçü Alma' },
      install: { title: 'Soba Camı Fitil Uygulaması', alt: 'Soba camı seramik yanmaz fitil çekimi', desc: 'Isıya dayanıklı kendinden yapışkanlı fitil ile montaj', tag: 'Montaj' },
      application: { title: 'Odun ve Kömür Sobasında Güvenli Yanış', alt: 'Döküm şömine sobasında alev görüntüsü', desc: 'Kıvılcım sıçratmayan tam sızdırmaz camlı soba kullanımı', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru soba camı montajı: esnek fitilli ve boşluklu',
        correctDesc: 'Doğru: Cam kenarlarında 2 mm genleşme payı bırakılmış.',
        incorrectAlt: 'Hatalı soba camı montajı: demire değen aşırı sıkı vidalar',
        incorrectDesc: 'Hatalı: Vidalar sonuna kadar sıkılmış, fitil kullanılmamış.'
      }
    },
    faqs: [
      { question: 'Soba camı kararması nasıl önlenir?', answer: 'Yalnızca kuru odun yakmak, hava klepesini tam kapatmamak ve alevin cama doğrudan temas etmemesini sağlamak kararmayı büyük oranda engeller.' },
      { question: 'Soba camı kargoda kırılır mı?', answer: 'MimariCam siparişleri özel ahşap straforlu zırhlı sandık ambalajıyla sevk edilir. Kargo teslimatında kırılma garantilidir.' },
      { question: 'Kömür yakılan sobaya bu cam uyar mı?', answer: 'Evet, camlarımız 800°C termal şoka dayanıklı ROBAX® malzeme olduğu için yüksek kalorili linyit ve kok kömüründe güvenle çalışır.' }
    ],
    relatedCategorySlugs: ['pelet-soba-cami', 'kuzine-soba-cami', 'somine-cami', 'seramik-cam']
  },

  // 3. Şömine Camı
  {
    slug: 'somine-cami',
    path: '/somine-cami',
    name: 'Şömine Camı',
    navTitle: 'Şömine Camı',
    title: 'Şömine Camı – SCHOTT ROBAX® Özel Ölçü Şömine Camı ve Kapak Sistemleri',
    metaDescription: 'Özel ölçü düz ve kavisli şömine camları. SCHOTT ROBAX® 800°C alev dayanımı, milimetrik kesim, montaj fitilleri ve şömine kapağı imalatı.',
    canonical: 'https://mimaricam.com/somine-cami',
    h1: 'Şömine Camı – Açık ve Kapalı Şömine Hazneleri İçin Isı Camları',
    badge: 'Orijinal ROBAX® Cam Seramik | Düz ve Kemerli Formlar',
    intro: 'Şömine hazneleri, 700°C ile 800°C arasında yüksek alev ve kor sıcaklığı üretir. Açık şöminenizi kapalı hazneye dönüştürmek veya mevcut asansörlü/menteşeli kapağınızın kırılan camını yenilemek için özel CNC kesimli ROBAX® şömine camı tercih edilir.',
    searchIntentSummary: 'Şömineniz için gereken cam modelini, düz veya kavisli cam ölçüm yöntemlerini, şömine camı montaj kurallarını ve online fiyatlandırma adımlarını inceleyin.',
    whatIs: {
      title: 'Şömine Camı Nedir?',
      description: 'Şömine camı, şöminenin alev odası ile yaşam alanı arasında hem yüksek güvenlik hem de yüksek verimli ısı transferi sağlayan özel bir cam-seramiktir. Odanın oksijenini tüketmeden odun dumanını ve zehirli gazları bacaya yönlendirirken radyant ısıyı %90 verimle yaşam alanına iletir.',
      highlights: [
        'Alev ve yüksek ısıya karşı 800°C dayanım garantisi',
        'Kıvılcım sıçramalarını engelleyen yangın güvenliği',
        'Yakıt tasarrufunu %40 artıran kontrollü yanma verimi',
        'Kare, dikdörtgen ve kavisli (kemerli) özel form kesimleri'
      ]
    },
    whereUsed: {
      title: 'Şömine Camı Kullanım Tipleri',
      items: [
        { name: 'Gömme Şömine Hazneleri', desc: 'Döküm veya çelik kapalı şömine haznelerinin açılır veya asansörlü kapakları.' },
        { name: 'Açık Şömine Kapatma Kapakları', desc: 'Geleneksel tuğla açık şöminelere özel üretilen camlı çelik kapak sistemleri.' },
        { name: 'U ve L Tipi Köşe Şömineler', desc: 'İki veya üç tarafı camlı modern panoramik şömineler.' },
        { name: 'Kavisli (Kemerli) Rustik Şömineler', desc: 'Tepe noktası bombeli nostaljik şömine kapakları.' }
      ]
    },
    howToMeasure: {
      title: 'Şömine Camı Ölçüsü Nasıl Alınır?',
      steps: [
        { step: 1, title: 'Kapak Yuvasının Dış Sınırlarını Belirleyin', desc: 'Kapak üzerindeki cam yuvasının metal çerçevesini genişlik ve yükseklik yönünde ölçün.' },
        { step: 2, title: 'Kavisli İse Omuz ve Tepe Yüksekliğini Ölçün', desc: 'Kemerli modellerde sol kenar omuz yüksekliği (Y1) ile orta kavis tepe noktasını (Y2) ayrı ayrı ölçün.' },
        { step: 3, title: 'Metal Genleşme Boşluğu Bırakın', desc: 'Genişlikten 4-6 mm, yükseklikten 4-6 mm eksilterek camın çerçeve içine serbestçe girmesini sağlayın.' }
      ],
      toleranceTip: 'Kapak içine sıkı sıkıya oturan cam ilk yanışta çatlayacaktır. 2 mm yan boşluklar fitil ile doldurulmalıdır.'
    },
    howToInstall: {
      title: 'Şömine Camı Montaj Kılavuzu',
      steps: [
        { step: 1, title: 'Yanmaz Seramik Fitili Yapıştırın', desc: 'Kapağın cam basma yüzeyine yüksek sıcaklığa dayanıklı grafitli veya seramik fitili çekin.' },
        { step: 2, title: 'Camı Yuvanın Ortasına Alın', desc: 'Camı metal yüzeylere sürtmeyecek şekilde fitilin üzerine hassasça bırakın.' },
        { step: 3, title: 'Vidaları El Torkuyla Tutun', desc: 'Sabitleme pabuçlarının vidalarını gevşek bırakın; cam parmakla itildiğinde fitil üzerinde 1 mm kadar yaylanabilmelidir.' }
      ]
    },
    installationCautions: {
      title: 'Şömine Camı Montajında Hayati Kurallar',
      points: [
        { title: 'Asla Metal Baskı Tırnağını Cama Doğrudan Bastırmayın', desc: 'Metal tırnak ile cam arasında mutlaka fitil parçası bulunmalıdır.', isWarning: true },
        { title: 'Şarjlı Matkapla Vida Sıkmayın', desc: 'Şarjlı matkap kontrolsüz tork uygulayarak camda görünmeyen stres çatlağı oluşturur.', isWarning: true },
        { title: 'Boru Tipi Silikon Kullanmayın', desc: 'Camın esnemesini engelleyen yapıştırıcılar şömine yandığında camı kırar.' }
      ]
    },
    whyGlassCracks: {
      title: 'Şömine Camı Neden Çatlar?',
      summary: 'Şömine camı sıcaklık derecesinden çatlamaz; metal çerçevenin ısıl genleşerek camı köşelerden sıkıştırmasından çatlar.',
      thermalExpansionExplanation: 'Çelik ve döküm kapaklar 500°C sıcaklıkta milimetrik olarak genişler. Seramik cam genişlemediği için aradaki tolerans yoksa metal camı ezer.',
      overtighteningExplanation: 'Kapak sabitleme pabuçları tornavidayla çok sıkıldığında camın kenarında mikroskobik çentikler oluşur ve ısı görünce çatlak yürür.',
      gasketExplanation: 'Cam elyaf conta aşındığında veya takılmadığında döküm metali doğrudan cama baskı yapar ve termomekanik kırılma gerçekleşir.',
      preventionRules: [
        'Her kenardan en az 2 mm boşluk bırakılacak ölçü verilmelidir.',
        'Cam tutucu tırnaklar camı sıkmamalı, yalnızca düşmesini engelleyecek gevşeklikte durmalıdır.',
        'Soba ve şöminenin ilk yakımında ateşi yavaş yavaş yükseltin.'
      ]
    },
    priceCalculationInfo: {
      title: 'Şömine Camı Fiyatı Nasıl Hesaplanır?',
      explanation: 'Şömine camı fiyatı m² bazında hesaplanır. Kemerli veya kavisli modellerde CNC kesim ve şablon işçiliği eklenir.',
      standardThickness: '4 mm SCHOTT ROBAX® Cam-Seramik',
      steps: [
        'Genişlik ve yükseklik santimetre/milimetre olarak girilir.',
        'Hesaplanan alan taban m² fiyatı ile çarpılır.',
        'Toplu alımlarda ve çerçeveli kapak siparişlerinde indirimler yansıtılır.'
      ]
    },
    visuals: {
      product: { title: 'Düz ve Kemerli Şömine Camı', alt: 'Şömine camı kesimi ve rodajlı kenarlar', desc: 'Şeffaf SCHOTT ROBAX cam plaka', tag: 'Ürün' },
      measure: { title: 'Şömine Kapağında Kemer ve Omuz Ölçümü', alt: 'Kavisli şömine kapağı ölçüsü alma şeması', desc: 'Genişlik, Y1 ve Y2 ölçü noktaları', tag: 'Ölçü Alma' },
      install: { title: 'Şömine Kapağı Fitil ve Vida Montajı', alt: 'Şömine kapağına cam takılması', desc: 'Yanmaz fitil ile metal temasını kesen pabuç montajı', tag: 'Montaj' },
      application: { title: 'Yanan Şöminede Camlı Koruma', alt: 'Camlı kapaklı modern şömine yanışı', desc: 'Kıvılcımsız, yüksek verimli şömine alevi', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru şömine montajı: serbest yaylanan cam',
        correctDesc: 'Doğru: Vidalar gevşek, fitil darbe emici görev yapıyor.',
        incorrectAlt: 'Hatalı montaj: vidalar sonuna kadar sıkılmış ve fitilsiz',
        incorrectDesc: 'Hatalı: Vidalar cama doğrudan baskı yapıyor, genleşme payı yok.'
      }
    },
    faqs: [
      { question: 'Açık şömineme sadece cam takabilir miyim?', answer: 'Açık şöminelerde sadece cam tek başına duramaz; özel çelik çerçeveli kapak sistemi imal edilmeli ve cam bu kapağa monte edilmelidir.' },
      { question: 'Şömine camı kendi kendine kırılır mı?', answer: 'Hayır, cam seramik kendi kendine kırılmaz. Çatlamaların %99 sebebi montaj vidasının fazla sıkılması veya çerçevenin genleşip camı sıkıştırmasıdır.' },
      { question: 'Kavisli şömineme nasıl cam yaptırabilirim?', answer: 'Sitemizdeki hesaplayıcıdan kavisli formu seçip G, Y1 ve Y2 ölçülerinizi girerek milimetrik üretim yaptırabilirsiniz.' }
    ],
    relatedCategorySlugs: ['seramik-cam', 'soba-cami', 'pelet-soba-cami', 'isiya-dayanikli-cam']
  },

  // 4. Pelet Soba Camı
  {
    slug: 'pelet-soba-cami',
    path: '/pelet-soba-cami',
    name: 'Pelet Soba Camı',
    navTitle: 'Pelet Soba Camı',
    title: 'Pelet Soba Camı – Yüksek Isı ve Basınca Dayanıklı Özel Camlar',
    metaDescription: 'Hermetik ve fanlı pelet sobaları için özel kesim pelet soba camı. Yüksek sızdırmazlık fitili, is tutmaz pürüzsüz yüzey ve 800°C ısı dayanımı.',
    canonical: 'https://mimaricam.com/pelet-soba-cami',
    h1: 'Pelet Soba Camı – Otomatik ve Hermetik Pelet Sobaları İçin Cam Çözümleri',
    badge: 'Basınçlı Yanma Odalarına Uygun | Yüksek Sızdırmazlık Fitilli',
    intro: 'Pelet sobaları, cebri hava üfleme fanı ve otomatik yakıt beslemesiyle çalışan yüksek verimli cihazlardır. Yanma odasında oluşan pozitif hava basıncına ve yüksek sıcaklığa dayanıklı orijinal pelet soba camları sızdırmazlık güvenliğinin temelidir.',
    searchIntentSummary: 'Pelet sobanızın kırılan camını yenilemek için doğru ölçü alma, fanlı sistemlerde sızdırmazlık fitili montajı ve camın is tutmasını önleme yöntemlerini öğrenin.',
    whatIs: {
      title: 'Pelet Soba Camı Nedir?',
      description: 'Pelet soba camı, pelet yakıtının ürettiği 700°C sıcaklığa ve fan basıncına dayanıklı 4 mm SCHOTT ROBAX® cam-seramiktir. Hermetik pelet sobalarında duman sızıntısını önlemek için yüksek kaliteli seramik fitiller ile birlikte kullanılır.',
      highlights: [
        'Cebri fan üflemesi ve yüksek basınç dayanımı',
        '800°C termal şok dayanımı ile sıfır genleşme',
        'İs tutmayı geciktiren pürüzsüz mikrokristalin yüzey',
        'Her marka pelet sobasına uygun özel CNC kesim'
      ]
    },
    whereUsed: {
      title: 'Hangi Pelet Cihazlarında Kullanılır?',
      items: [
        { name: 'Hermetik Ev Tipi Pelet Sobaları', desc: 'Salon tipi üflemeli veya sulu sistem pelet sobası kapakları.' },
        { name: 'Kazan Dairesi Pelet Kazanları', desc: 'Otomatik ateşlemeli merkezi sistem pelet kazan gözetleme pencereleri.' },
        { name: 'Pelet Yakıtlı Şömineler', desc: 'Duvara gömme otomatik pelet şöminesi ön camları.' },
        { name: 'Pelet Pizzası Fırınları', desc: 'Yüksek sıcaklığa ulaşan bahçe tipi pelet fırını kapakları.' }
      ]
    },
    howToMeasure: {
      title: 'Pelet Soba Camı Ölçüsü Nasıl Alınır?',
      steps: [
        { step: 1, title: 'Kapak Contasını Çıkarıp Yuva Ölçüsünü Alın', desc: 'Kapak içindeki cam basma kanalının genişlik ve yüksekliğini milimetrik ölçün.' },
        { step: 2, title: 'Termal Genleşme Boşluğu Bırakın', desc: 'Pelet sobalarında sac ve döküm kapağın genleşmesi için ölçüden toplam 4 mm eksiltin.' },
        { step: 3, title: 'Cam Kalınlığını Kontrol Edin', desc: 'Standart kalınlık 4 mm’dir. Yuva klipslerinin 4 mm cama uygunluğunu teyit edin.' }
      ],
      toleranceTip: 'Kanal ölçüsü 320x240 mm ise siparişinizi 316x236 mm olarak veriniz.'
    },
    howToInstall: {
      title: 'Pelet Soba Camı Montaj Adımları',
      steps: [
        { step: 1, title: 'Sızdırmazlık Fitilini Yenileyin', desc: 'Pelet sobasında fitil hava kaçırmamalıdır; yanmaz kendinden yapışkanlı fitili kanala eksiz döşeyin.' },
        { step: 2, title: 'Camı Yuvanın Ortasına Oturtun', desc: 'Camın hiçbir köşesi doğrudan metal kapak gövdesine sürtmemelidir.' },
        { step: 3, title: 'Tutucu Vidaları Hafifçe Sıkın', desc: 'Vidaları aşırı sıkıp camı ezmeyin; contanın hafifçe ezilmesi sızdırmazlık için yeterlidir.' }
      ]
    },
    installationCautions: {
      title: 'Pelet Sobası Montajında Dikkat Edilecekler',
      points: [
        { title: 'Hava Sızdırmazlığı Eksiksiz Olmalı', desc: 'Pelet sobası içten basınçlıdır; fitilde boşluk kalırsa odaya duman sızabilir.', isWarning: true },
        { title: 'Vidaları Fazla Sıkmayın', desc: 'Vidaların aşırı torklanması camın köşelerini çatlatır.', isWarning: true },
        { title: 'Kalitesiz Pelet Kullanmayın', desc: 'Yüksek kimyasal katkılı peletler camda asidik kalıcı lekeler bırakabilir.' }
      ]
    },
    whyGlassCracks: {
      title: 'Pelet Soba Camı Neden Çatlar?',
      summary: 'Pelet soba camları sıcaklıktan değil; kapağın ısıl genleşerek camı köşelerden sıkıştırmasından ve aşırı sıkılan montaj vidalarından çatlar.',
      thermalExpansionExplanation: 'Pelet sobası gövdesi çalışırken hızla ısınır ve çelik kapak esner. Tolerans boşluğu verilmemiş cam genleşen metalin altında ezilir.',
      overtighteningExplanation: 'Sızdırmazlık sağlayacağım endişesiyle vidaların sonuna kadar sıkılması camda gerilim yükler ve ilk çalıştırmada kırılma yaratır.',
      gasketExplanation: 'Eski sertleşmiş fitiller esnekliğini kaybeder; darbe emici katman kalktığında cam kırılır.',
      preventionRules: [
        'Yuva ölçüsünden 4 mm küçük cam kestirin.',
        'Yeni seramik elyaf fitil kullanın.',
        'Vidaları sıkarken camın fitil üzerinde hafifçe esneyebilmesini sağlayın.'
      ]
    },
    priceCalculationInfo: {
      title: 'Pelet Soba Camı Fiyat Hesaplama',
      explanation: 'Genişlik ve yükseklik ölçülerine göre hesaplanan metrekare alanı üzerinden şeffaf ve anında fiyat üretilir.',
      standardThickness: '4 mm ROBAX® Pelet Camı',
      steps: [
        'Ölçülerinizi santimetre veya milimetre cinsinden girin.',
        'Alan hesabı ve kargo güvenliği otomatik eklenir.',
        'Siparişi WhatsApp veya form üzerinden doğrudan iletin.'
      ]
    },
    visuals: {
      product: { title: '4mm Pelet Soba Camı', alt: 'Özel kesim pelet sobası cam seramik plaka', desc: 'Basınca ve ısıya dayanıklı pürüzsüz pelet camı', tag: 'Ürün' },
      measure: { title: 'Pelet Soba Kapağı Ölçümü', alt: 'Pelet sobası cam yuvasının ölçülmesi', desc: 'İç kanal ölçüsü ve tolerans payı çıkarma', tag: 'Ölçü Alma' },
      install: { title: 'Hermetik Fitil ve Klips Montajı', alt: 'Pelet soba camı fitil değişimi', desc: 'Basınç kaçırmayan seramik fitil montajı', tag: 'Montaj' },
      application: { title: 'Hermetik Pelet Sobasında Alev', alt: 'Yanan pelet sobası camından alev seyri', desc: 'Temiz yanma ve estetik camlı görünüm', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru pelet soba montajı: eksiksiz fitilli ve boşluklu',
        correctDesc: 'Doğru: Hava kaçırmayan seramik fitil ve esneme payı mevcut.',
        incorrectAlt: 'Hatalı montaj: aşırı sıkılmış vidalar',
        incorrectDesc: 'Hatalı: Vidalar sonuna kadar sıkılmış, cam kasıntı altında.'
      }
    },
    faqs: [
      { question: 'Pelet soba camı neden kararır?', answer: 'Yetersiz baca çekişi, düşük kaliteli nemli pelet ve fan ayarının düşük olması camın is tutmasına neden olur.' },
      { question: 'Pelet soba camı kaç günde gelir?', answer: 'Verdiğiniz özel ölçülere göre aynı gün CNC kesim ve rodaj yapılarak ahşap koruma kasasında kargoya verilir.' },
      { question: 'Eski camdaki fitili tekrar kullanabilir miyim?', answer: 'Eski fitiller ısıyla sertleşip elastikiyetini kaybettiği için her cam değişiminde yeni yanmaz fitil kullanılmalıdır.' }
    ],
    relatedCategorySlugs: ['soba-cami', 'somine-cami', 'kuzine-soba-cami', 'seramik-cam']
  },

  // 5. Kuzine Soba Camı
  {
    slug: 'kuzine-soba-cami',
    path: '/kuzine-soba-cami',
    name: 'Kuzine Soba Camı',
    navTitle: 'Kuzine Soba Camı',
    title: 'Kuzine Soba Camı – Ateş ve Fırın Kapakları İçin Isıya Dayanıklı Cam',
    metaDescription: 'Kuzine soba ateş ve fırın kapakları için özel kesim camlar. 800°C ateşe dayanıklı ROBAX® cam seramik, ölçü alma ve pratik değişim rehberi.',
    canonical: 'https://mimaricam.com/kuzine-soba-cami',
    h1: 'Kuzine Soba Camı – Fırınlı ve Ateşlik Kapaklı Kuzineler İçin Özel Camlar',
    badge: 'Ateşlik ve Fırın Kapaklarına Uygun | Yüksek Isı ve Yağ Direnci',
    intro: 'Fırınlı köy kuzineleri ve modern şömine kuzinelerinde hem ateşlik kapağında hem de fırın bölümünde yüksek ısıya dayanıklı camlar kullanılır. Kırılan kuzine camınızı milimetrik özel ölçüde hemen temin edebilirsiniz.',
    searchIntentSummary: 'Kuzine sobası camı değişimi, ateşlik ile fırın kapağı cam farkları, yağ ve is tutmayan seramik cam bakımı ile doğru montaj yönergelerini öğrenin.',
    whatIs: {
      title: 'Kuzine Soba Camı Nedir?',
      description: 'Kuzine soba camı, hem alt ateş odasının direkt alevine hem de üst fırın bölümünün 300-400°C pişirme sıcaklığına dayanıklı cam seramik malzemedir. Fırın kapağını açmadan yemeklerin pişme durumunu görmeyi sağlarken ateşlik bölümünde emniyetli alev keyfi sunar.',
      highlights: [
        'Ateşlik kapağında 800°C doğrudan alev direnci',
        'Fırın kapağında yüksek sıcaklık ve buhar dayanımı',
        'Köy kuzinesi ve şömine kuzinelerine özel ölçü CNC kesim',
        'Yemek yağları ve ise karşı kolay temizlenebilir yüzey'
      ]
    },
    whereUsed: {
      title: 'Kuzinelerde Kullanım Alanları',
      items: [
        { name: 'Kuzine Ateşlik Kapağı', desc: 'Odun ve kömürün yandığı alt yanma odası gözetleme camı.' },
        { name: 'Kuzine Fırın Kapağı', desc: 'Börek, ekmek ve yemeklerin pişmesini izleten fırın camı.' },
        { name: 'Döküm Şömine Kuzineler', desc: 'Geniş camlı salon tipi rustik şömine kuzineleri.' },
        { name: 'Dış Mekan Bahçe Kuzineleri', desc: 'Veranda ve bağ evi açık fırınlı kuzine sistemleri.' }
      ]
    },
    howToMeasure: {
      title: 'Kuzine Camı Ölçüsü Nasıl Alınır?',
      steps: [
        { step: 1, title: 'Kapağı Açıp Cam Yuvasını Belirleyin', desc: 'Kapağın arkasındaki montaj tırnakları arasındaki iç net mesafeyi ölçün.' },
        { step: 2, title: 'Esneme Boşluğu Bırakın', desc: 'Genişlik ve boydan 4 mm (her kenardan 2 mm) düşerek sipariş ölçünüzü belirleyin.' },
        { step: 3, title: 'Fırın ve Ateşlik Camını Karıştırmayın', desc: 'Ateşlik ve fırın kapaklarının ölçüleri çoğunlukla farklıdır; iki kapağı ayrı ayrı ölçün.' }
      ],
      toleranceTip: 'Kapak yuvası 250x180 mm ise siparişiniz 246x176 mm olmalıdır.'
    },
    howToInstall: {
      title: 'Kuzine Soba Camı Montajı',
      steps: [
        { step: 1, title: 'Eski Cam ve Kül Kalıntılarını Temizleyin', desc: 'Kapak kanalındaki yanmış kalıntıları tel fırça ile temizleyin.' },
        { step: 2, title: 'Yanmaz Fitil Uygulayın', desc: 'Yeni seramik fitili metal yüzeye yapıştırın.' },
        { step: 3, title: 'Camı Yerleştirip Hafifçe Tutturun', desc: 'Tutucu kıskaç vidalarını tatlı sert sıkarak camı sabitleyin.' }
      ]
    },
    installationCautions: {
      title: 'Kuzine Montajında Dikkat Edilecekler',
      points: [
        { title: 'Vidaları Aşırı Sıkmayın', desc: 'Kuzine demiri ısınıp genleştiğinde sıkı vidalar camı kırar.', isWarning: true },
        { title: 'Fitilsiz Montaj Yapmayın', desc: 'Doğrudan demire oturan cam ilk ateşlemede çatlar.', isWarning: true },
        { title: 'Fırın Kapağını Çarpmayın', desc: 'Kuzine kapaklarının sertçe çarpılması mekanik kırılma yaratır.' }
      ]
    },
    whyGlassCracks: {
      title: 'Kuzine Camı Neden Çatlar?',
      summary: 'Kuzine camları sıcaktan çatlamaz; döküm veya sac çerçevenin genleşmesi, aşırı sıkılmış vidalar veya sert kapak çarpmaları sebebiyle çatlar.',
      thermalExpansionExplanation: 'Kuzine soba gövdesi yüksek ısıyla genleşir. Cam ile çerçeve arasında boşluk bırakılmazsa demir camı sıkar ve kırar.',
      overtighteningExplanation: 'Tutucu tırnak vidaları aşırı sıkıldığında cam köşesinde gerilim oluşur ve çatlak tetiklenir.',
      gasketExplanation: 'Eskiyen fitil darbe emiciliğini yitirdiğinde metal doğrudan cama basar ve cam çatlar.',
      preventionRules: [
        'Kapak ölçüsünden 4 mm küçük cam kullanın.',
        'Vidaları sıkarken camın fitil üzerinde hafifçe yaylanmasını sağlayın.',
        'Her zaman 800°C dayanımlı cam elyaf fitil kullanın.'
      ]
    },
    priceCalculationInfo: {
      title: 'Kuzine Camı Fiyat Hesaplama',
      explanation: 'Genişlik ve boy ölçülerine göre hesaplanan metrekare alanı üzerinden anında net fiyat belirlenir.',
      standardThickness: '4 mm ROBAX® Cam-Seramik',
      steps: [
        'Ateşlik veya fırın kapağı ölçünüzü girin.',
        'Alan hesabı ve kargo kasası fiyata dahil edilir.',
        'Siparişi anında oluşturun.'
      ]
    },
    visuals: {
      product: { title: 'Kuzine Sobası Seramik Camı', alt: 'Kuzine fırın ve ateşlik kapağı camı', desc: 'Yüksek sıcaklığa dayanıklı orijinal 4mm cam seramik', tag: 'Ürün' },
      measure: { title: 'Kuzine Kapağı Ölçüm Noktaları', alt: 'Kuzine kapağında cam yuvası ölçümü', desc: 'Fırın ve ateşlik yuvalarında net toleranslı ölçüm', tag: 'Ölçü Alma' },
      install: { title: 'Kuzine Camı Fitil ve Tırnak Montajı', alt: 'Kuzine cam montajı seramik conta', desc: 'Yanmaz fitil ile metal temasını kesen uygulama', tag: 'Montaj' },
      application: { title: 'Geleneksel Kuzinede Cam Konforu', alt: 'Yanan kuzine sobası fırın ve alev görüntüsü', desc: 'Pişirme ve ısıtmayı aynı anda izleten cam tasarımı', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru kuzine camı montajı: fitilli ve toleranslı',
        correctDesc: 'Doğru: Çepeçevre esnek fitil ve hareket payı bırakılmış.',
        incorrectAlt: 'Hatalı kuzine montajı: fitilsiz ve aşırı sıkılmış vidalar',
        incorrectDesc: 'Hatalı: Cam doğrudan demire basıyor, vidalar aşırı sıkılmış.'
      }
    },
    faqs: [
      { question: 'Kuzine fırın camına sıçrayan yemek yağları nasıl temizlenir?', answer: 'Cam tamamen soğuduktan sonra fırın temizleme köpüğü veya karbonatlı nemli bezle kolayca temizlenir.' },
      { question: 'Ateş kapağı ile fırın kapağında aynı cam mı kullanılır?', answer: 'Evet, her iki kapakta da 800°C termal şoka dayanıklı ROBAX® cam seramik kullanılır.' },
      { question: 'Kuzine kapağım eğri, cam uyar mı?', answer: 'Eğer kapakta eğrilik varsa cam düz olduğundan boşluk kalabilir veya kasabilir. Bu durumda kalın fitil kullanarak dengeleme yapılmalıdır.' }
    ],
    relatedCategorySlugs: ['soba-cami', 'somine-cami', 'pelet-soba-cami', 'seramik-cam']
  },

  // 6. Isıya Dayanıklı Cam
  {
    slug: 'isiya-dayanikli-cam',
    path: '/isiya-dayanikli-cam',
    name: 'Isıya Dayanıklı Cam',
    navTitle: 'Isıya Dayanıklı Cam',
    title: 'Isıya Dayanıklı Cam – Yüksek Sıcaklık ve Termal Şok Camları',
    metaDescription: '800°C ısıya ve ani termal şoka dayanıklı seramik ve borosilikat camlar. Endüstriyel fırınlar, şömineler, kazan gözetleme camları ve CNC özel kesim.',
    canonical: 'https://mimaricam.com/isiya-dayanikli-cam',
    h1: 'Isıya Dayanıklı Cam – Endüstriyel ve Mimari Yüksek Sıcaklık Cam Çözümleri',
    badge: '800°C Termal Şok Dayanımı | Endüstriyel ve Mimari Uygulamalar',
    intro: 'Yüksek sıcaklığa maruz kalan endüstriyel fırınlar, kurutma kabinleri, gözetleme menholleri ve şömineler için termal şok katsayısı minimize edilmiş özel teknik camlar üretmekteyiz. İhtiyacınıza göre borosilikat 3.3 ve cam-seramik (ROBAX®) seçenekleri sunulmaktadır.',
    searchIntentSummary: 'Isıya dayanıklı cam türlerini (borosilikat vs seramik cam), sıcaklık limitlerini, endüstriyel montaj toleranslarını ve fiyatlandırma mantığını keşfedin.',
    whatIs: {
      title: 'Isıya Dayanıklı Cam Nedir?',
      description: 'Isıya dayanıklı camlar, yüksek çalışma sıcaklıklarında kırılmadan veya optik bozulmaya uğramadan görev yapabilen özel formülasyonlu camlardır. 300°C seviyeleri için borosilikat camlar, 700-800°C doğrudan alev teması için ise cam-seramik plakalar kullanılır.',
      highlights: [
        '800°C ani sıcaklık farkı dayanımı',
        'Borosilikat 3.3 ve lityum-alüminosilikat cam-seramik seçenekleri',
        'Endüstriyel asit ve kimyasal buharlara yüksek korozyon direnci',
        'CNC dairesel, delikli, kavisli ve dikdörtgen özel kesim kabiliyeti'
      ]
    },
    whereUsed: {
      title: 'Endüstriyel ve Mimari Kullanım Alanları',
      items: [
        { name: 'Endüstriyel Fırınlar', desc: 'Metal ergitme, seramik pişirme ve kurutma fırını gözetleme pencereleri.' },
        { name: 'Kazan ve Buhar Menholleri', desc: 'Basınçlı kaplar ve sıcak buhar hatları akış kontrol camları.' },
        { name: 'Laboratuvar Cihazları', desc: 'Yüksek sıcaklık otoklav ve test kabini pencereleri.' },
        { name: 'Aydınlatma Armatürleri', desc: 'Yüksek güçlü projektör ve sahne aydınlatma koruma camları.' }
      ]
    },
    howToMeasure: {
      title: 'Isıya Dayanıklı Cam Ölçümü Nasıl Yapılır?',
      steps: [
        { step: 1, title: 'Flanş veya Çerçeve Boşluğunu Ölçün', desc: 'Metal flanşın iç çapını veya kasanın iç ölçülerini hassas kumpasla ölçün.' },
        { step: 2, title: 'Termal Genleşme Payını Hesaplayın', desc: 'Çelik gövdenin çalışma sıcaklığındaki uzama miktarına göre en az 4-5 mm tolerans düşülmelidir.' },
        { step: 3, title: 'Basınç Varsa Kalınlığı Belirleyin', desc: 'Basınçlı hatlar için 4 mm, 5 mm, 8 mm borosilikat cam kalınlıkları hesaplanmalıdır.' }
      ],
      toleranceTip: 'Yüksek sıcaklıkta çelik çerçeve hızla genleşir. Cam asla çelikle sıkı temas etmemelidir.'
    },
    howToInstall: {
      title: 'Isıya Dayanıklı Cam Montaj Yöntemi',
      steps: [
        { step: 1, title: 'Isıl Dayanımlı Conta Seçin', desc: 'Klingrit, grafitli salmastra veya seramik elyaf şerit conta kullanın.' },
        { step: 2, title: 'Camı Flanş Arasına Merkezleyin', desc: 'Camın metal gövdeye değmediğini kontrol edin.' },
        { step: 3, title: 'Cıvataları Çapraz Olarak Eşit Torkla Sıkın', desc: 'Lokal baskı noktası oluşturmamak için karşılıklı çapraz sıkım yapın.' }
      ]
    },
    installationCautions: {
      title: 'Endüstriyel Isı Camı Montaj Uyarıları',
      points: [
        { title: 'Çapraz ve Dengeli Sıkım Yapın', desc: 'Tek taraflı aşırı sıkılan flanş cıvataları camı anında kırar.', isWarning: true },
        { title: 'Metal-Cam Temasını Önleyin', desc: 'Yüksek sıcaklıkta metalin mikro titreşimleri camı çizer ve patlatır.', isWarning: true },
        { title: 'Çalışma Sıcaklığına Uygun Malzeme Seçin', desc: 'Alevle doğrudan temas varsa temperli cam değil seramik cam kullanılmalıdır.' }
      ]
    },
    whyGlassCracks: {
      title: 'Isıya Dayanıklı Cam Neden Çatlar?',
      summary: 'Isıya dayanıklı camlar sıcaklıktan değil; mekanik sıkışma, flanş eğriliği veya metalin ısıl genleşmesiyle oluşan stres yüzünden çatlar.',
      thermalExpansionExplanation: 'Metalin genleşme katsayısı seramik cama göre çok yüksektir. Sıcaklık arttıkça metal çerçeve genişleyip camı ezer.',
      overtighteningExplanation: 'Flanş cıvataları tork anahtarı olmadan aşırı sıkıldığında camda bükülme gerilimi başlar.',
      gasketExplanation: 'Uygun yanmaz conta kullanılmadığında metal pürüzleri doğrudan cama temas eder ve stres kırılması yaratır.',
      preventionRules: [
        'Metalin çalışma sıcaklığındaki genleşme payı hesaplanarak cam küçük kesilmelidir.',
        'Her iki yüze eşit kalınlıkta seramik/grafit conta konulmalıdır.',
        'Cıvatalar tork sınırlayıcı ile dengeli sıkılmalıdır.'
      ]
    },
    priceCalculationInfo: {
      title: 'Fiyatlandırma Mantığı',
      explanation: 'Metrekare bazlı ham cam seramik plaka fiyatı, CNC kesim, delik açma ve rodaj işlemlerine göre hesaplanır.',
      standardThickness: '4 mm - 5 mm Seramik Cam / Borosilikat',
      steps: [
        'İstenen en ve boy ölçüsü veya çap girilir.',
        'Alan hesabı ve özel kenar işçilikleri eklenir.',
        'Anında fiyat oluşturularak sipariş verilebilir.'
      ]
    },
    visuals: {
      product: { title: 'Teknik Isı Camı Plakaları', alt: 'Isıya dayanıklı endüstriyel gözetleme camı', desc: 'Yüksek sıcaklık fırınları için rodajlı cam seramik', tag: 'Ürün' },
      measure: { title: 'Flanş İçi Hassas Kumpas Ölçümü', alt: 'Endüstriyel fırın camı ölçü alma', desc: 'Çap ve tolerans paylarının belirlenmesi', tag: 'Ölçü Alma' },
      install: { title: 'Çapraz Cıvata ve Conta Montajı', alt: 'Isıya dayanıklı cam montaj şeması', desc: 'Grafitli conta ile dengeli flanş sıkımı', tag: 'Montaj' },
      application: { title: 'Endüstriyel Fırın ve Kazan Uygulaması', alt: 'Kazan gözetleme camı uygulaması', desc: 'Yüksek ısıda güvenli proses takibi', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru montaj: çift taraflı conta ve çapraz tork',
        correctDesc: 'Doğru: Metal teması yok, çift taraflı conta ile dengelenmiş.',
        incorrectAlt: 'Hatalı montaj: contanın tek taraflı olması ve dengesiz sıkım',
        incorrectDesc: 'Hatalı: Cıvata tek taraftan aşırı sıkılmış, cam bükülmüş.'
      }
    },
    faqs: [
      { question: 'Borosilikat cam ile ROBAX seramik cam farkı nedir?', answer: 'Borosilikat cam yaklaşık 300-450°C sıcaklığa dayanır. ROBAX seramik cam ise 800°C termal şoka dayanıklıdır ve doğrudan alevle temas edebilir.' },
      { question: 'Dairesel formda ısı camı kesilebilir mi?', answer: 'Evet, CNC su jeti tezgahlarımızda dairesel, oval veya delikli formlarda milimetrik kesim yapılmaktadır.' },
      { question: 'Camın üzerine su sıçrarsa çatlar mı?', answer: 'ROBAX® seramik camlar 800°C akkor haldeyken üzerine soğuk su dökülse dahi çatlamaz; sıfır termal genleşmeye sahiptir.' }
    ],
    relatedCategorySlugs: ['seramik-cam', 'somine-cami', 'soba-cami', 'temperli-cam']
  },

  // 7. Yangın Camı
  {
    slug: 'yangin-cami',
    path: '/yangin-cami',
    name: 'E30 Yangın Camı',
    navTitle: 'E30 Yangın Camı',
    title: 'E30 Yangın Camı – EI30, EI60, EI90, EI120 Sertifikalı Yangın Camları',
    metaDescription: 'E30 Yangın Camı özellikleri, EN 1364-1 ve EN 1634-1 sertifikalı yangın camları. Yangın anında alev, duman ve ısı radyasyonunu durduran EI30 - EI120 mimari yangın cam sistemleri.',
    canonical: 'https://mimaricam.com/yangin-cami',
    h1: 'E30 Yangın Camı – Binaların Yangın Güvenliği İçin Sertifikalı Yangın Bariyerleri',
    badge: 'EN 1364 & EN 1634 Sertifikalı | EI30 - EI120 Tam Isı İzolasyonu',
    intro: 'E30 Yangın Camı, yangın esnasında can ve mal kaybını önlemek amacıyla alevlerin, zehirli dumanların ve öldürücü ısı transferinin diğer bina bölümlerine geçişini 30 ila 120 dakika boyunca engelleyen çok katmanlı sertifikalı güvenlik camlarıdır.',
    searchIntentSummary: 'E30 Yangın Camı sınıflarını (E, EW, EI), yönetmelik gerekliliklerini, sertifikalı montaj kurallarını ve projeleriniz için fiyatlandırma adımlarını inceleyin.',
    whatIs: {
      title: 'E30 Yangın Camı Nedir ve Nasıl Çalışır?',
      description: 'E30 Yangın Camı, cam plakalar arasına yerleştirilmiş şeffaf intümesan jel tabakalarından oluşur. Yangın çıktığında sıcaklık 120°C’yi aştığında ara katmandaki jel köpürerek opak ve sert bir ısı yalıtım kalkanına dönüşür. Bu sayede yangın tarafında 1000°C sıcaklık varken diğer tarafta yüzey sıcaklığı 140°C’yi geçmez.',
      highlights: [
        'E Sınıfı: Alev ve duman sızdırmazlık bütünlüğü',
        'EW Sınıfı: Alev bütünlüğü ve sınırlı radyasyon iletimi',
        'EI Sınıfı (EI30 - EI120): Tam ısı yalıtımı ve yangın bariyeri',
        'Avrupa normlarına uygun laboratuvar test sertifikaları'
      ]
    },
    whereUsed: {
      title: 'Mimari Projelerde E30 Yangın Camı Nerelerde Zorunludur?',
      items: [
        { name: 'Yangın Kaçış Koridorları ve Merdivenleri', desc: 'Bina tahliyesi sırasında insanların güvenle geçebileceği şeffaf yangın duvarları.' },
        { name: 'Yangın Kapıları (Vision Panel)', desc: 'Çelik veya ahşap yangın kapılarında içeriyi gözetleme camı.' },
        { name: 'Hastaneler ve Okullar', desc: 'Yoğun insan sirkülasyonu olan binalarda yangın kompartıman bölmeleri.' },
        { name: 'AVM ve Otel Atriumları', desc: 'Katlar arası duman ve alev geçişini durduran dikey şeffaf yangın cepheleri.' }
      ]
    },
    howToMeasure: {
      title: 'E30 Yangın Camı Ölçüsü Nasıl Alınır?',
      steps: [
        { step: 1, title: 'Sertifikalı Yangın Doğramasını Ölçün', desc: 'Yangın camı yalnızca onaylı yangın profilleri (çelik/alüminyum) içine takılır. Profil cam yuvasını ölçün.' },
        { step: 2, title: 'Genleşme ve Takoz Boşluklarını Düşün', desc: 'Yangın camları intümesan genleşme gereği çerçeveden her kenarda en az 5 mm küçük olmalıdır.' },
        { step: 3, title: 'Cam Kalınlığına Göre Çıta Seçin', desc: 'EI sınıfına göre cam kalınlığı 15 mm ile 55 mm arasında değişir. Profil çıta derinliğini teyit edin.' }
      ],
      toleranceTip: 'E30 Yangın Camı fabrikada lamine edilip kenar bantlandığından şantiyede kesinlikle kesilemez; ölçü baştan net verilmelidir.'
    },
    howToInstall: {
      title: 'E30 Yangın Camı Nasıl Monte Edilir?',
      steps: [
        { step: 1, title: 'Yangına Dayanıklı Takozlar Kullanın', desc: 'Cam tabanına sertifikalı kalsiyum silikat veya sert ahşap yangın takozları yerleştirin.' },
        { step: 2, title: 'İntümesan Fitil ve Yangın Mastiği Uygulayın', desc: 'Cam kenarlarına yangında köpüren intümesan fitil çekin.' },
        { step: 3, title: 'Yangın Çıtalarını Vidalarla Sabitleyin', desc: 'Proje test raporuna uygun aralıklarla çelik vidalar ile çıtaları monte edin.' }
      ]
    },
    installationCautions: {
      title: 'E30 Yangın Camı Montajında Yapılmaması Gerekenler',
      points: [
        { title: 'Şantiyede Kesim Yapılamaz', desc: 'E30 Yangın Camı kesilirse ara jel sızar ve yangın dayanımını tamamen kaybeder.', isWarning: true },
        { title: 'Standart Silikon Kullanılamaz', desc: 'Sertifikalı yangın mastiği yerine standart silikon kullanılırsa duman sızar.', isWarning: true },
        { title: 'Kenar Bantları Sökülmemelidir', desc: 'Camın etrafındaki koruyucu alüminyum buhar bandı neme karşı korur; sökülmemelidir.' }
      ]
    },
    whyGlassCracks: {
      title: 'E30 Yangın Camı Neden Hasar Görür?',
      summary: 'E30 Yangın Camı darbe, kenar bandı hasarı ve neme maruz kalma sebebiyle ara jel bozulması veya mekanik çatlama yaşar.',
      thermalExpansionExplanation: 'Doğrama içinde genleşme boşluğu bırakılmazsa bina oturmalarında veya yangın testinde metal cam kenarlarını sıkar.',
      overtighteningExplanation: 'Montaj çıtalarının vidaları orantısız sıkıldığında çok katmanlı lamine camın dış katı çatlar.',
      gasketExplanation: 'Kenar bantları su veya asidik neme temas ederse intümesan jel bulanıklaşır (delaminasyon) ve koruma zafiyeti doğar.',
      preventionRules: [
        'Cam kenar bantlarını montaj sonuna kadar koruyun.',
        'Yangın takozlarını doğru yerleştirerek cam ağırlığını eşit dağıtın.',
        'Sertifikalı sistem profili haricinde montaj yapmayın.'
      ]
    },
    priceCalculationInfo: {
      title: 'E30 Yangın Camı Fiyatı Nasıl Belirlenir?',
      explanation: 'E30 Yangın Camı fiyatları yangın dayanım süresi (30, 60, 90, 120 dakika), EI veya E sınıfı, metrekare alanı ve proje nakliyesine göre hesaplanır.',
      standardThickness: 'EI30: ~15-18 mm | EI60: ~25-28 mm | EI90: ~35 mm | EI120: ~50 mm',
      steps: [
        'Gerekli yangın sınıfını seçin (örn: EI60).',
        'En ve boy ölçülerini girerek toplam metrekareyi belirleyin.',
        'Yangın test sertifikası ve sevkiyat dahil teklifinizi anında alın.'
      ]
    },
    visuals: {
      product: { title: 'Çok Katmanlı EI Sınıfı E30 Yangın Camı', alt: 'İntümesan jelli E30 yangın camı katmanları', desc: 'Yangın anında köpürerek opaklaşan sertifikalı cam', tag: 'Ürün' },
      measure: { title: 'Yangın Doğraması Cam Yuvası Ölçümü', alt: 'E30 yangın kapısı cam boşluğu ölçümü', desc: 'Profil çıta derinliği ve takoz boşlukları', tag: 'Ölçü Alma' },
      install: { title: 'Yangın Takozu ve İntümesan Fitil Montajı', alt: 'Sertifikalı E30 yangın camı montajı', desc: 'Yangın mastiği ve yangın çıtası montajı', tag: 'Montaj' },
      application: { title: 'Kaçış Koridorunda Yangın Bariyeri', alt: 'Mimari E30 yangın camı koridor bölmesi', desc: 'Can güvenliği sağlayan şeffaf yangın duvarı', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru E30 yangın camı montajı: kalsiyum silikat takozlu ve intümesan fitilli',
        correctDesc: 'Doğru: Sertifikalı yangın takozu ve yangın mastiği kullanılmış.',
        incorrectAlt: 'Hatalı montaj: plastik takoz ve standart silikon',
        incorrectDesc: 'Hatalı: Plastik takoz yangında erir, standart silikon alev alır.'
      }
    },
    faqs: [
      { question: 'EI30 ile EI60 arasındaki fark nedir?', answer: 'EI30 yangına ve ısı geçişine karşı 30 dakika, EI60 ise 60 dakika boyunca tam koruma sağlar.' },
      { question: 'E30 Yangın Camı şantiyede küçültülebilir mi?', answer: 'Kesinlikle hayır. E30 Yangın Camları özel jel katmanlı lamine camlardır; şantiyede kesilirse jel boşalır ve cam kullanılamaz hale gelir.' },
      { question: 'E30 Yangın Camı itfaiye onaylı mıdır?', answer: 'Evet, ürünlerimiz akredite laboratuvarlarca test edilmiş ve Türkiye Yangından Korunma Yönetmeliği ile uyumlu sertifikalara sahiptir.' }
    ],
    relatedCategorySlugs: ['yangina-dayanikli-cam', 'yangin-kapisi-cami', 'yangin-guvenlik-cami', 'yangin-dayanimli-cam']
  },

  // 8. Yangına Dayanıklı Cam
  {
    slug: 'yangina-dayanikli-cam',
    path: '/yangina-dayanikli-cam',
    name: 'E60 Yangına Dayanıklı Cam',
    navTitle: 'E60 Yangına Dayanıklı Cam',
    title: 'E60 Yangına Dayanıklı Cam – Yangın Bölmeleri ve Kompartıman Camları',
    metaDescription: 'E60 Yangına Dayanıklı Cam özellikleri, test standartları ve mimari çözümler. Alev, duman ve ısı radyasyonu engelleyici şeffaf yangın bariyerleri.',
    canonical: 'https://mimaricam.com/yangina-dayanikli-cam',
    h1: 'E60 Yangına Dayanıklı Cam – Yüksek Yangın Güvenliği Standartlarında Mimari Camlar',
    badge: 'Alev & Isı İzolasyonu | Yangın Yönetmeliğine %100 Uygun',
    intro: 'E60 Yangına Dayanıklı Camlar, modern mimaride şeffaflıktan ödün vermeden yangın kompartıman sınırlarını korumak için tasarlanmıştır. Yangın tehlikesini belirli bir hacme hapsederek tahliye ve itfaiye müdahalesi için hayati zaman kazandırır.',
    searchIntentSummary: 'E60 Yangına Dayanıklı Camların çalışma prensibini, intümesan jel bariyer teknolojisini, E-EW-EI sınıflandırmalarını ve projeniz için uygun cam seçimini öğrenin.',
    whatIs: {
      title: 'E60 Yangına Dayanıklı Camların Temel Özellikleri',
      description: 'E60 Yangına Dayanıklı Cam, alevin sıcaklığıyla aktive olan özel yangın ara katmanlarına sahip laminasyonlu bir kompozit malzemedir. Yangın anında alevleri fiziksel olarak durdurur ve arkasına ısı radyasyonu geçirmeyerek eşyaların kendiliğinden tutuşmasını engeller.',
      highlights: [
        'Bütünlük (E): Duman ve sıcak gazların geçişine tam set çekme',
        'Radyasyon Sınırlama (EW): Isı ışımasını 15 kW/m² altında tutma',
        'Isı Yalıtımı (EI): Arka yüzey sıcaklığını maksimum 140°C ortalamada tutma',
        'Mükemmel ses yalıtımı ve güvenlik laminasyonu'
      ]
    },
    whereUsed: {
      title: 'Kullanım Alanları ve Proje Tipleri',
      items: [
        { name: 'Ticari Plazalar ve Ofisler', desc: 'Katlar arası yangın bölme duvarları ve yangın kaçış holleri.' },
        { name: 'Okullar ve Yurtlar', desc: 'Tahliye yolları ve merdiven boşluğu yangın yalıtımlı cam cepheleri.' },
        { name: 'Endüstriyel Tesisler', desc: 'Üretim sahası ile idari bina arasındaki yangın duvarı pencereleri.' },
        { name: 'Müzeler ve Kütüphaneler', desc: 'Tarihi ve değerli eserlerin yangın dumanından korunması.' }
      ]
    },
    howToMeasure: {
      title: 'E60 Yangına Dayanıklı Cam Ölçü Belirleme',
      steps: [
        { step: 1, title: 'Doğrama Sistem Test Raporunu İnceleyin', desc: 'E60 Yangına Dayanıklı Cam testi yapılmış onaylı doğrama ile bir bütündür. Profil üreticisinin cam ölçü boşluğunu baz alın.' },
        { step: 2, title: 'Cam Ağırlığını ve Kalınlığını Dikkate Alın', desc: 'Kalınlık 18-55 mm arasında değişir. Cam ağırlığı m² başına 40-120 kg arasında olabilir.' },
        { step: 3, title: 'Kenar Tolerans Payı Bırakın', desc: 'Isınmayla genleşen doğrama için her kenardan en az 5 mm montaj payı bırakılmalıdır.' }
      ],
      toleranceTip: 'Cam boyutları E60 Yangına Dayanıklı Cam test raporundaki maksimum izin verilen boyutları aşmamalıdır.'
    },
    howToInstall: {
      title: 'Montaj Prensipleri',
      steps: [
        { step: 1, title: 'Onaylı Yangın Doğraması Montajı', desc: 'Yangın çelik veya alüminyum karkasının montajını teraziye alarak tamamlayın.' },
        { step: 2, title: 'Kalsiyum Silikat Takozlama', desc: 'Yangında erimeyen sert inorganik takozlar ile camı tabandan yükseltin.' },
        { step: 3, title: 'Yangın Mastiği ile İzolasyon', desc: 'Çepeçevre yangın sızdırmazlık mastiği çekerek montajı bitirin.' }
      ]
    },
    installationCautions: {
      title: 'Kritik Montaj Kuralları',
      points: [
        { title: 'Plastik Takoz Kullanımı Yasaktır', desc: 'Plastik takoz yangında erir ve camın yuvasından düşmesine sebep olur.', isWarning: true },
        { title: 'Cam Kenarları Islatılmamalıdır', desc: 'Su ve nem intümesan jel tabakasını bozarak camı beyazlatabilir.', isWarning: true },
        { title: 'Yetkili Ekiplerce Takılmalıdır', desc: 'Sertifikasız montajlar yangın denetiminde uygunsuzluk alır.' }
      ]
    },
    whyGlassCracks: {
      title: 'E60 Yangına Dayanıklı Cam Neden Bozulur veya Çatlar?',
      summary: 'E60 Yangına Dayanıklı Camlar montaj esnasında darbe alması, doğrama eğriliği veya kenar buhar bandının hasar görmesiyle bozulur.',
      thermalExpansionExplanation: 'Doğramada genleşme boşluğu verilmezse yangın testinde veya bina termal hareketinde kenarlardan ezilme oluşur.',
      overtighteningExplanation: 'Cam sabitleme çıtaları aşırı torklandığında lamine cam katmanlarında bölgesel çatlaklar başlar.',
      gasketExplanation: 'Kenar bandı sökülürse ortam nemi jel katmanına girer ve camda delaminasyon (beyazlama/kabarma) oluşur.',
      preventionRules: [
        'Kenar koruyucu alüminyum folyo bantları asla kesmeyin veya çıkarmayın.',
        'Camı kaldırırken vantuzlu taşıyıcılar kullanarak kenar darbelerini engelleyin.',
        'Doğrama iç yüzeyinde çapak veya kaynak çıkıntısı bırakmayın.'
      ]
    },
    priceCalculationInfo: {
      title: 'Fiyatlandırma Esasları',
      explanation: 'E60 Yangına Dayanıklı Cam sınıfı (EI30, EI60, EI90, EI120), ebatlar, ses yalıtımı veya ekstra güvenlik laminasyonu ihtiyaçlarına göre fiyatlandırılır.',
      standardThickness: 'Yangın Sınıfına Göre 15 mm – 52 mm',
      steps: [
        'Gereken yangın sınıfını ve ebatları belirleyin.',
        'Metrekare hesabı ile liste fiyatı üzerinden proje iskontosu uygulanır.',
        'Özel kasa ambalajlı teslimat teklifi hazırlanır.'
      ]
    },
    visuals: {
      product: { title: 'E60 Yangına Dayanıklı Şeffaf Cam Katmanları', alt: 'E60 Yangına Dayanıklı Cam kesiti', desc: 'Yüksek optik netlik and yangın bariyer jeli', tag: 'Ürün' },
      measure: { title: 'Sistem Doğramasında Cam Payı Belirleme', alt: 'E60 Yangına Dayanıklı Cam doğrama ölçüsü', desc: 'Genişlik, yükseklik ve çıta derinliği hesabı', tag: 'Ölçü Alma' },
      install: { title: 'Yangına Dayanıklı Mastik ve Takozlama', alt: 'E60 Yangına Dayanıklı Cam takılması', desc: 'Isıya dayanıklı sert takoz ve sızdırmaz fitil', tag: 'Montaj' },
      application: { title: 'Ofis Bölmesinde Yangın Kompartımanı', alt: 'Modern ofiste E60 Yangına Dayanıklı Cam bölme', desc: 'Şeffaflık ve güvenliğin birleştiği mimari tasarım', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru montaj: yanmaz takoz ve kenar bant korumalı',
        correctDesc: 'Doğru: Kenar bantları sağlam ve yangın takozu yerleştirilmiş.',
        incorrectAlt: 'Hatalı montaj: kenar bandı hasarlı ve silikonsuz',
        incorrectDesc: 'Hatalı: Kenar bandı yırtılmış, nem temasına açık.'
      }
    },
    faqs: [
      { question: 'E60 Yangına Dayanıklı Cam kırılmaz mı?', answer: 'Yangın camları lamine yapıdadır. Ağır mekanik darbelerde kırılabilir ancak parçaları intümesan jel tutar ve yangın bariyeri işlevini sürdürür.' },
      { question: 'Güneş ışığı E60 Yangına Dayanıklı Cama zarar verir mi?', answer: 'Dış cephede kullanılacak yangın camları UV filtreli lamine katmanla üretilmelidir; aksi halde jel güneşte sararma yapabilir.' },
      { question: 'Sertifika belgesi camla birlikte verilir mi?', answer: 'Evet, sevk edilen her parti E60 Yangına Dayanıklı Cam için akredite laboratuvar test raporu ve üretici uygunluk sertifikası teslim edilir.' }
    ],
    relatedCategorySlugs: ['yangin-cami', 'yangin-kapisi-cami', 'yangin-dayanimli-cam', 'yangin-guvenlik-cami']
  },

  // 9. Yangın Kapısı Camı
  {
    slug: 'yangin-kapisi-cami',
    path: '/yangin-kapisi-cami',
    name: 'E90 Yangın Kapısı Camı',
    navTitle: 'E90 Yangın Kapısı Camı',
    title: 'E90 Yangın Kapısı Camı – Çelik ve Ahşap Yangın Kapısı Gözetleme Camları',
    metaDescription: 'E90 Yangın Kapısı Camı, yangın kapıları için sertifikalı gözetleme camları (vision panel). EI30, EI60 ve EI90 çelik ve ahşap yangın kapısı cam kesimleri ve montaj çerçeveleri.',
    canonical: 'https://mimaricam.com/yangin-kapisi-cami',
    h1: 'E90 Yangın Kapısı Camı – Acil Çıkış ve Yangın Kapıları İçin Sertifikalı Vision Panel Camlar',
    badge: 'EN 1634-1 Onaylı | Çelik ve Ahşap Kapılara Uygun Vision Panel',
    intro: 'E90 Yangın Kapısı Camı, acil tahliye kapılarında ve yangın kapısı kanatlarında diğer taraftaki duman veya alev durumunu görmeyi sağlayan (vision panel), kapının yangın dayanım süresiyle birebir uyumlu sertifikalı cam üniteleridir.',
    searchIntentSummary: 'E90 Yangın Kapısı Camı ölçü sınırlarını, dairesel ve dikdörtgen vision panel montajını, sertifikalı montaj çerçevelerini ve fiyatlandırma adımlarını inceleyin.',
    whatIs: {
      title: 'E90 Yangın Kapısı Camı (Vision Panel) Nedir?',
      description: 'E90 Yangın Kapısı Camı, yangın kapısı kanadında açılan boşluğa takılan ve kapının EI30, EI60 veya EI90 dayanım sınıfını düşürmeden can güvenliği ve görünürlük sağlayan özel yangın yalıtım camıdır. Yangın anında kapı arkasındaki personelin tahliye güvenliğini artırır.',
      highlights: [
        'EN 1634-1 yangın kapısı standartlarına tam uyum',
        'Dairesel, kare and dikdörtgen gözetleme ölçüleri',
        'Çelik ve ahşap yangın kapısı profillerine uygun montaj',
        'Duman ve alev geçişini kapıyla eşzamanlı durdurma'
      ]
    },
    whereUsed: {
      title: 'Kullanım Alanları',
      items: [
        { name: 'Merdiven Boşluğu Yangın Kapıları', desc: 'Bina kaçış merdiveni giriş kapılarında gözetleme camı.' },
        { name: 'Otopark Yangın Çıkış Kapıları', desc: 'Kapalı otoparklardan bina içine geçiş yangın kapıları.' },
        { name: 'Otel Oda ve Koridor Kapıları', desc: 'Yangına dayanıklı ahşap otel oda kapısı pencereleri.' },
        { name: 'Kazan Dairesi Yangın Kapıları', desc: 'Teknik hacim ve trafo odası çelik yangın kapıları.' }
      ]
    },
    howToMeasure: {
      title: 'E90 Yangın Kapısı Camı Ölçüsü Nasıl Alınır?',
      steps: [
        { step: 1, title: 'Kapı Kanadındaki Cam Boşluğunu Ölçün', desc: 'Kapı üreticisinin açtığı vision panel boşluğunun en, boy ve saç derinliğini ölçün.' },
        { step: 2, title: 'Sertifika Limitlerini Kontrol Edin', desc: 'Yangın kapısı sertifikasında izin verilen maksimum cam alanını (genellikle 0.5 m² veya üretici limitleri) aşmayın.' },
        { step: 3, title: 'Çerçeve Çıtası İçi Net Cam Ölçüsü Çıkarın', desc: 'Çelik montaj çerçevesinin içine oturacak cam için her kenarda 4 mm tolerans bırakın.' }
      ],
      toleranceTip: 'Standart dairesel E90 Yangın Kapısı Camları sıklıkla Ø 300 mm, Ø 400 mm veya dikdörtgen 300x600 mm, 400x800 mm olarak tercih edilir.'
    },
    howToInstall: {
      title: 'E90 Yangın Kapısına Cam Nasıl Monte Edilir?',
      steps: [
        { step: 1, title: 'Yangın Çerçevesini Hazırlayın', desc: 'Kapı sacına intümesan yangın fitilini yerleştirin.' },
        { step: 2, title: 'Camı Seramik Takozlarla Merkezleyin', desc: 'Vision panel camını kapı boşluğunun ortasına yerleştirin.' },
        { step: 3, title: 'Karşı Çelik Çerçeveyi Vidalayın', desc: 'Yangına dayanıklı çelik vidalar ile iki çerçeveyi kapı kanadına kilitleyin.' }
      ]
    },
    installationCautions: {
      title: 'E90 Yangın Kapısı Cam Montajında Dikkat Edilecekler',
      points: [
        { title: 'Kapı Yangın Sertifikası Bozulmamalı', desc: 'İzinsiz büyük cam açılması kapının sertifikasını geçersiz kılar.', isWarning: true },
        { title: 'Kenar Bandı Kesilmemelidir', desc: 'Cam kenarlarındaki intümesan koruma bandına dokunulmamalıdır.', isWarning: true },
        { title: 'Çelik Çerçeve Isıya Dayanıklı Olmalıdır', desc: 'Alüminyum çerçeveler çelik kapılarda eriyebileceğinden çelik çerçeve kullanılmalıdır.' }
      ]
    },
    whyGlassCracks: {
      title: 'E90 Yangın Kapısı Camı Neden Hasar Görür?',
      summary: 'Yangın kapısının sert kapanması, kapı hidroliği çarpmaları veya çerçeve vidalarının aşırı sıkılması camda hasar oluşturur.',
      thermalExpansionExplanation: 'Yangın çıktığında çelik kapı gövdesi genleşir. Çerçevede boşluk bırakılmamışsa saç sacı camı sıkar.',
      overtighteningExplanation: 'Vision panel çerçeve vidaları haddinden fazla sıkıldığında camın köşelerine lokal baskı biner.',
      gasketExplanation: 'Yangın kapısının rüzgarla sert çarpması sonucu fitilsiz camlar anında çatlar.',
      preventionRules: [
        'Kapıya mutlaka ayarlı kapı hidroliği takın; sert çarpmaları önleyin.',
        'Vision panel çerçevesine esnek yangın contası uygulayın.',
        'Cam ölçüsünde en az 4 mm montaj payı bırakın.'
      ]
    },
    priceCalculationInfo: {
      title: 'E90 Yangın Kapısı Camı Fiyat Hesaplama',
      explanation: 'EI30 veya EI60 yangın sınıfına, dairesel veya dikdörtgen formuna ve ebatlara göre anında şeffaf fiyat sunulur.',
      standardThickness: 'EI30: 16-18 mm | EI60: 25-28 mm',
      steps: [
        'Kapı cam boşluğu ebatlarını girin.',
        'Yangın sınıfını (EI30 / EI60) seçin.',
        'Montaj çerçeveli veya sadece cam teklifinizi anında alın.'
      ]
    },
    visuals: {
      product: { title: 'EI60 E90 Yangın Kapısı Vision Panel Camı', alt: 'E90 Yangın Kapısı Camı ünitesi', desc: 'Sertifikalı çok katmanlı gözetleme camı', tag: 'Ürün' },
      measure: { title: 'Kapı Kanadında Vision Panel Ölçümü', alt: 'E90 Yangın Kapısı Camı deliği ölçüsü alma', desc: 'Standart dikdörtgen ve dairesel ölçüm', tag: 'Ölçü Alma' },
      install: { title: 'Çelik Çerçeve ile Kapıya Cam Montajı', alt: 'E90 Yangın Kapısı Camı çerçevesi montajı', desc: 'Çift taraflı çelik çerçeveli sızdırmaz montaj', tag: 'Montaj' },
      application: { title: 'Acil Çıkış Kapısında Camlı Kullanım', alt: 'Çelik yangın kapısında camlı uygulama', desc: 'Acil durumlarda arkasını gösteren güvenli yangın kapısı', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru montaj: çift çelik çerçeveli ve esnek yangın fitilli',
        correctDesc: 'Doğru: Çelik yangın çıtalarıyla sağlam ve contalı montaj.',
        incorrectAlt: 'Hatalı montaj: vidasız yapıştırma veya fitilsiz cam',
        incorrectDesc: 'Hatalı: Yangın fitili konulmamış, duman geçişine açık.'
      }
    },
    faqs: [
      { question: 'Yangın kapısına sonradan cam açılabilir mi?', answer: 'Kapı üreticisinin test raporunda camlı opsiyon mevcutsa ve yetkili kişi tarafından açılırsa uygundur; aksi halde kapının yangın sertifikası bozulabilir.' },
      { question: 'Dairesel E90 Yangın Kapısı Camı var mı?', answer: 'Evet, Ø 300 mm, Ø 350 mm ve Ø 400 mm çaplarında dairesel yangın camları ve özel çelik çerçeveleri üretilmektedir.' },
      { question: 'Kapı camı duman geçirir mi?', answer: 'Ahır, intümesan yangın fitilleri ve lamine jel tabakası alev ve duman geçişini tamamen kilitler.' }
    ],
    relatedCategorySlugs: ['yangin-cami', 'yangina-dayanikli-cam', 'yangin-guvenlik-cami', 'yangin-emniyet-cami']
  },

  // 10. Yangın Güvenlik Camı
  {
    slug: 'yangin-guvenlik-cami',
    path: '/yangin-guvenlik-cami',
    name: 'EI30 Yangın Güvenlik Camı',
    navTitle: 'EI30 Yangın Güvenlik Camı',
    title: 'EI30 Yangın Güvenlik Camı – Yangın ve İnsan Güvenliği Çözümleri',
    metaDescription: 'EI30 Yangın Güvenlik Camı, yangın güvenliği ve mimari emniyeti bir arada sunar. EI sınıfı alev, duman ve ısı korumalı sertifikalı cam sistemleri.',
    canonical: 'https://mimaricam.com/yangin-guvenlik-cami',
    h1: 'EI30 Yangın Güvenlik Camı – İnsan Hayatını ve Yapı Bütünlüğünü Koruyan Camlar',
    badge: 'Yangın Güvenliği & İnsan Tahliyesi | Sertifikalı Yangın Bariyerleri',
    intro: 'EI30 Yangın Güvenlik Camı, kamu binalarında, plazalarda ve konutlarda yangının yayılmasını engellerken insan tahliyesini güvenli kılan, ısı radyasyonunu engelleyerek kaçış yollarını serin tutan üst düzey mimari camlardır.',
    searchIntentSummary: 'EI30 Yangın Güvenlik Camı standartlarını, can güvenliği tahliye koridorlarındaki kritik rolünü, montaj kurallarını ve teknik hesaplama detaylarını öğrenin.',
    whatIs: {
      title: 'EI30 Yangın Güvenlik Camı Nedir?',
      description: 'EI30 Yangın Güvenlik Camı, binaların yangından korunması yönetmeliği uyarınca kaçış merdivenleri, asansör holleri ve yangın zonlarında kullanılan çok işlevli güvenlik camıdır. Yangın anında alevleri engellerken normal zamanda darbelere karşı güvenlik camı performansı gösterir.',
      highlights: [
        'Yangın alevine ve yüksek ısısına karşı tam bariyer (EI30 - EI120)',
        'İnsan çarpmalarına karşı emniyet camı dayanımı',
        'Akustik gürültü azaltma (40 dB+ ses yalıtımı)',
        'Optik berraklık ile aydınlık mimari mekanlar'
      ]
    },
    whereUsed: {
      title: 'Kullanım Alanları',
      items: [
        { name: 'Havalimanı ve Tren Garları', desc: 'Büyük yolcu terminallerinde yangın zonu ayırıcı cam duvarlar.' },
        { name: 'Alışveriş Merkezleri', desc: 'Mağazalar ile kaçış koridorları arasındaki yangın güvenlik camları.' },
        { name: 'Üniversite ve Kampüsler', desc: 'Amfi ve laboratuvar binalarında sertifikalı yangın cam bölmeleri.' },
        { name: 'Veri Merkezleri (Data Center)', desc: 'Sunucu odalarını dış yangın tehlikelerinden izole eden camlar.' }
      ]
    },
    howToMeasure: {
      title: 'Ölçü Alma Adımları',
      steps: [
        { step: 1, title: 'Mimari Doğrama Planını İnceleyin', desc: 'Çelik yangın doğramasının net cam yuva ölçülerini belirleyin.' },
        { step: 2, title: 'İntümesan Esneme Payını Düşün', desc: 'Her kenardan 5 mm olmak üzere toplam 10 mm tolerans boşluğu hesaplayın.' },
        { step: 3, title: 'Ağırlık ve Taşıma Hesabı Yapın', desc: 'Geniş cam panellerde vinç veya vantuzlu taşıma gereksinimini planlayın.' }
      ],
      toleranceTip: 'Büyük ebatlı EI30 Yangın Güvenlik Camlarında rüzgar ve sismik hareket payları da gözetilmelidir.'
    },
    howToInstall: {
      title: 'Montaj Standartları',
      steps: [
        { step: 1, title: 'Karkas Mukavemetini Doğrulayın', desc: 'Yangın doğramasının binaya çelik dübellerle rijit sabitlendiğinden emin olun.' },
        { step: 2, title: 'Sertifikalı Yangın Fitili ve Takozu Koyun', desc: 'Takozların cam ağırlığını doğru taşıyacak noktalara yerleştirin.' },
        { step: 3, title: 'Yangın Çıtalarını Vidalarla Kapatın', desc: 'Yangın mastiği çekerek montajı tamamlayın.' }
      ]
    },
    installationCautions: {
      title: 'Montajda Dikkat Edilecekler',
      points: [
        { title: 'Şantiyede Kesilmez', desc: 'Ölçü hata kabul etmez; fabrikada özel ölçüde üretilir.', isWarning: true },
        { title: 'Kenarları Çarpmayın', desc: 'Cam köşeleri en hassas kısımdır, zemine doğrudan temas ettirilmemelidir.', isWarning: true },
        { title: 'UV Filtreli Olmalı', desc: 'Güneş gören cephelerde UV koruyucu laminasyon şarttır.' }
      ]
    },
    whyGlassCracks: {
      title: 'EI30 Yangın Güvenlik Camı Neden Çatlar?',
      summary: 'Bina hareketleri, uygunsuz montaj takozları veya kenar darbesi alması durumunda lamine yangın camı hasar görebilir.',
      thermalExpansionExplanation: 'Doğramada genleşme boşluğu bırakılmadığında termal uzama camı kenardan sıkıştırır.',
      overtighteningExplanation: 'Montaj vidaları dengesiz sıkılırsa cam plakasında bükülme gerilimi oluşur.',
      gasketExplanation: 'Kenar alüminyum bandı zedelendiğinde havadaki nem jel katmanını bozar.',
      preventionRules: [
        'Sertifikalı yangın montaj kılavuzuna harfiyen uyun.',
        'Doğrama köşelerinde kaynak çapaklarını temizleyin.',
        'Camı taşırken kenar koruyucuları çıkarmayın.'
      ]
    },
    priceCalculationInfo: {
      title: 'Fiyat Hesaplama',
      explanation: 'Yangın dayanım süresi (EI30 - EI120), ebatlar ve ilave akustik/emniyet katmanlarına göre m² üzerinden hesaplanır.',
      standardThickness: '15 mm ile 55 mm arası çok katmanlı',
      steps: [
        'Genişlik ve yükseklik ölçülerini girin.',
        'Yangın sınıfını belirleyin.',
        'Fiyat teklifini anında oluşturun.'
      ]
    },
    visuals: {
      product: { title: 'EI30 Yangın Güvenlik Camı Ünitesi', alt: 'EI30 Yangın Güvenlik Camı mimari bölme', desc: 'Şeffaf ve darbe dayanımlı yangın bariyeri', tag: 'Ürün' },
      measure: { title: 'Geniş Açıklıklı Cam Alanı Ölçümü', alt: 'EI30 Yangın Güvenlik Camı açıklık ölçümü', desc: 'Profil toleransları ve çıta payları', tag: 'Ölçü Alma' },
      install: { title: 'Sertifikalı Çelik Yangın Doğraması Montajı', alt: 'EI30 Yangın Güvenlik Camı montajı', desc: 'Yanmaz takoz ve sızdırmazlık fitili uygulaması', tag: 'Montaj' },
      application: { title: 'Kamu Binasında Yangın Güvenlik Duvarı', alt: 'Kamu binasında EI30 Yangın Güvenlik Camı uygulaması', desc: 'Acil kaçış yollarında maksimum can güvenliği', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru yangın güvenlik montajı: kalsiyum silikat takozlu',
        correctDesc: 'Doğru: Yük doğru dağıtılmış, yangın mastiği eksiksiz.',
        incorrectAlt: 'Hatalı montaj: takozsuz veya plastik takozlu',
        incorrectDesc: 'Hatalı: Yangın takozu konulmamış, cam profille temas halinde.'
      }
    },
    faqs: [
      { question: 'EI30 Yangın Güvenlik Camı kırılınca tehlike yaratır mı?', answer: 'Hayır, lamine güvenlik yapısı sayesinde parçalar bir arada tutunur ve dökülme yapmaz.' },
      { question: 'EI30 Yangın Güvenlik Camları ses yalıtımı sağlar mı?', answer: 'Evet, çok katmanlı jel yapısı sayesinde 40 dB üzerinde üst düzey akustik ses yalıtımı sunar.' },
      { question: 'Bina ruhsatı için itfaiyeye hangi evraklar sunulur?', answer: 'Camın akredite laboratuvar test raporu, parti üretim sertifikası ve üretici uygunluk beyanı teslim edilir.' }
    ],
    relatedCategorySlugs: ['yangin-cami', 'yangina-dayanikli-cam', 'yangin-emniyet-cami', 'yangin-dayanimli-cam']
  },

  // 11. Yangın Emniyet Camı
  {
    slug: 'yangin-emniyet-cami',
    path: '/yangin-emniyet-cami',
    name: 'EI60 Yangın Emniyet Camı',
    navTitle: 'EI60 Yangın Emniyet Camı',
    title: 'EI60 Yangın Emniyet Camı – Darbe ve Yangın Dirençli Güvenlik Camları',
    metaDescription: 'EI60 Yangın Emniyet Camı, yangına karşı EI dayanımı ve insan çarpmalarına karşı 1B1 emniyet sınıfını birleştirir. Sertifikalı mimari cam çözümleri.',
    canonical: 'https://mimaricam.com/yangin-emniyet-cami',
    h1: 'EI60 Yangın Emniyet Camı – Yangın Bariyeri ve İnsan Çarpma Emniyetinin Bütünlüğü',
    badge: 'EN 12600 1B1 Emniyet | Yangına Karşı Tam İzolasyon',
    intro: 'EI60 Yangın Emniyet Camı, yangın esnasında alev ve ısı izolasyonu sağlarken, günlük kullanımda insan çarpmalarına karşı EN 12600 standardına göre en yüksek emniyet sınıfını (1B1) karşılayan lamine yangın camlarıdır.',
    searchIntentSummary: 'EI60 Yangın Emniyet Camının darbe ve yangın dayanım standartlarını, çocuk ve insan yoğun mekanlardaki güvenlik gerekliliklerini öğrenin.',
    whatIs: {
      title: 'EI60 Yangın Emniyet Camı Nedir?',
      description: 'EI60 Yangın Emniyet Camı, çok katmanlı yangın geciktirici jel ile emniyet laminasyonunun hibrit birleşimidir. Cam kırılsa dahi dağılmayarak insan yaralanmalarını önlerken yangının diğer mahallere sıçramasına engel olur.',
      highlights: [
        'EN 12600 standardına göre 1B1 çarpma emniyeti',
        'EI30 - EI120 yangın ısı yalıtımı ve alev bariyeri',
        'Zorunlu zemin seviyesi cam uygulamalarında emniyet şartı',
        'Kırılma anında dağılmayan güvenli PVB/jel yapısı'
      ]
    },
    whereUsed: {
      title: 'Nerelerde Kullanılır?',
      items: [
        { name: 'Okullar ve Anaokulları', desc: 'Çocukların koşup çarpabileceği alçak seviyeli yangın duvarları.' },
        { name: 'Spor Salonları ve Stadyumlar', desc: 'Yüksek darbe riski olan kaçış tünelleri ve yangın koridorları.' },
        { name: 'Hastaneler ve Klinikler', desc: 'Sedye çarpmalarına maruz kalabilecek yangın kapısı ve duvar camları.' },
        { name: 'AVM Mağaza Cepheleri', desc: 'İnsan yoğunluğunun yüksek olduğu yangın kompartıman sınırları.' }
      ]
    },
    howToMeasure: {
      title: 'EI60 Yangın Emniyet Camı Ölçüsü Nasıl Alınır?',
      steps: [
        { step: 1, title: 'Doğrama Karkasını Net Ölçün', desc: 'Yangına dayanıklı çelik profil iç yuva ölçülerini belirleyin.' },
        { step: 2, title: 'Cam Ağırlık ve Emniyet Payı', desc: 'EI60 Yangın Emniyet Camları kalın ve ağır olduğundan montaj boşlukları hassas verilmelidir.' },
        { step: 3, title: '5 mm Kenar Boşluğu Bırakın', desc: 'Darbe emici fitillerin yerleşimi için her kenarda 5 mm boşluk bırakılmalıdır.' }
      ],
      toleranceTip: 'Cam ölçüsü verildikten sonra fabrikada üretilir, yerinde kesim yapılamaz.'
    },
    howToInstall: {
      title: 'Montaj Yöntemi',
      steps: [
        { step: 1, title: 'Sertleştirilmiş Yangın Takozları', desc: 'Cam tabanına kalsiyum silikat takozlar koyun.' },
        { step: 2, title: 'Darbe Emici Yangın Fitilleri', desc: 'Camın iki yüzüne intümesan yangın fitili uygulayın.' },
        { step: 3, title: 'Çelik Çıtalar ile Kitleme', desc: 'Çıtaları çelik vidalar ile sıkarak camı doğramaya sabitleyin.' }
      ]
    },
    installationCautions: {
      title: 'Kritik Montaj Kuralları',
      points: [
        { title: 'Köşelere Çekiçle Vurmayın', desc: 'Camı takarken tokmak veya çekiç darbeleri kenar çatlağı oluşturur.', isWarning: true },
        { title: 'Doğrama Teraziye Alınmalıdır', desc: 'Eğri doğramaya zorla sokulan cam kasıntıdan çatlar.', isWarning: true },
        { title: 'Kenar Bandı Zedelenmemelidir', desc: 'Alüminyum kenar bandı hasar görürse cam hava alır ve bozulur.' }
      ]
    },
    whyGlassCracks: {
      title: 'EI60 Yangın Emniyet Camı Neden Hasar Görür?',
      summary: 'Ağır mekanik sivri darbeler, kasıntılı montaj veya kenar bandı bozulması sebebiyle hasar oluşabilir.',
      thermalExpansionExplanation: 'Doğrama genleştiğinde pay bırakılmamışsa cam kenarlarından ezilir.',
      overtighteningExplanation: 'Çıtaların aşırı vidalanması cam yüzeyinde gerilim dalgası oluşturur.',
      gasketExplanation: 'Uygun fitil kullanılmazsa demir titreşimleri camı çizer.',
      preventionRules: [
        'Montajda mutlaka onaylı yangın fitili kullanın.',
        'Her kenardan 5 mm genleşme payı bırakın.',
        'Camı monte ederken tork ayarlı vidalama yapın.'
      ]
    },
    priceCalculationInfo: {
      title: 'Fiyatlandırma Mantığı',
      explanation: 'Yangın dayanım sınıfı ve 1B1 darbe emniyet katmanlarına göre m² üzerinden hesaplanır.',
      standardThickness: '18 mm – 55 mm arası hibrit lamine',
      steps: [
        'Ebatları girin.',
        'EI yangın sınıfını seçin.',
        'Anında proje fiyat teklifi alın.'
      ]
    },
    visuals: {
      product: { title: '1B1 Darbe Emniyetli EI60 Yangın Emniyet Camı', alt: 'EI60 Yangın Emniyet Camı kesiti', desc: 'Darbe ve yangına aynı anda dirençli kompozit yapı', tag: 'Ürün' },
      measure: { title: 'Doğrama Net Ölçü Tespiti', alt: 'EI60 Yangın Emniyet Camı ölçü alma', desc: 'Kalın camlar için profil derinliği ölçümü', tag: 'Ölçü Alma' },
      install: { title: 'Emniyetli Montaj ve Takozlama', alt: 'EI60 Yangın Emniyet Camı takılması', desc: 'Darbe emici fitiller ile güvenli kitleme', tag: 'Montaj' },
      application: { title: 'Okul ve Hastanede Yangın Emniyet Duvarı', alt: 'Hastanede EI60 Yangın Emniyet Camı bölmesi', desc: 'İnsan sirkülasyonunun yüksek olduğu alanlarda güvenlik', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru montaj: yangın takozu ve intümesan mastik',
        correctDesc: 'Doğru: Cam teraziye alınmış, darbe emici fitiller tam.',
        incorrectAlt: 'Hatalı montaj: takozsuz ve kenarı demire temas eden cam',
        incorrectDesc: 'Hatalı: Cam doğrudan doğramaya sürtüyor.'
      }
    },
    faqs: [
      { question: 'EI60 Yangın Emniyet Camı kurşun geçirir mi?', answer: 'Yangın emniyet camları insan çarpmalarına ve yangına karşıdır. Kurşun geçirmezlik için ilave BR sınıfı balistik katmanlar eklenmelidir.' },
      { question: 'Cam kırıldığında yere dökülür mi?', answer: 'Hayır, laminasyon jeli kırılan parçaları tutar, cam bütünlüğünü korur.' },
      { question: 'Dış cephede kullanılabilir mi?', answer: 'Evet, çift cam ünitesi (Igu) şeklinde dış cephe yalıtımına uygun olarak üretilebilir.' }
    ],
    relatedCategorySlugs: ['yangin-cami', 'yangina-dayanikli-cam', 'yangin-guvenlik-cami', 'yangin-dayanimli-cam']
  },

  // 12. Yangın Dayanımlı Cam
  {
    slug: 'yangin-dayanimli-cam',
    path: '/yangin-dayanimli-cam',
    name: 'EI90 Yangın Dayanımlı Cam',
    navTitle: 'EI90 Yangın Dayanımlı Cam',
    title: 'EI90 Yangın Dayanımlı Cam – Yangın Bölme Duvarları ve Cephe Sistemleri',
    metaDescription: 'EI90 Yangın Dayanımlı Cam sistemleri. 30, 60, 90 ve 120 dakika yangın geciktirici şeffaf bölme camları, test raporları ve teknik destek.',
    canonical: 'https://mimaricam.com/yangin-dayanimli-cam',
    h1: 'EI90 Yangın Dayanımlı Cam – Yangın Zonlarını Ayıran Yüksek Mukavemetli Camlar',
    badge: '30 - 120 Dakika Yangın Dayanımı | Akredite Laboratuvar Test Raporlu',
    intro: 'EI90 Yangın Dayanımlı Cam sistemleri, yangının binanın diğer bölümlerine sıçramasını önlemek amacıyla tasarlanmış, alev ve ısı geçişini sertifikalı süre boyunca durduran yüksek performanslı mimari yangın camlarıdır.',
    searchIntentSummary: 'EI90 Yangın Dayanımlı Cam seçimi, yangın zonlama projeleri, test sertifikasyon süreçleri ve şeffaf yangın duvarı montaj kurallarını öğrenin.',
    whatIs: {
      title: 'EI90 Yangın Dayanımlı Cam Nedir?',
      description: 'EI90 Yangın Dayanımlı Cam, yangın esnasında yapı elemanının taşıyıcılık, bütünlük ve yalıtım (REI / EI) kriterlerini korumasını sağlayan şeffaf bir yangın kalkanıdır. Yangın anında alev duman sızdırmazlığı ve ısı izolasyonu sağlar.',
      highlights: [
        'EI30, EI60, EI90, EI120 yangın dayanım süreleri',
        'Alev ve duman geçişine karşı kesin fiziksel engel',
        'Isı geçişini engelleyen intümesan jel bariyeri',
        'Akredite test merkezlerinden onaylı raporlar'
      ]
    },
    whereUsed: {
      title: 'Mimari Kullanım Alanları',
      items: [
        { name: 'Yangın Kompartıman Duvarları', desc: 'Bina içi yangın zonlarını ayıran şeffaf cam duvarlar.' },
        { name: 'Cephe Yangın Geçirimsizlik Şeritleri', desc: 'Katlar arası dış cephe yangın atlama bariyerleri (spandrel).' },
        { name: 'Çatı Işıklıkları ve Yangın Tavanları', desc: 'Yangına dayanıklı yatay ve eğimli cam çatı çözümleri.' },
        { name: 'Asansör Şaftı Camları', desc: 'Panoramik asansör kuyularında yangın yayılımını durduran camlar.' }
      ]
    },
    howToMeasure: {
      title: 'EI90 Yangın Dayanımlı Cam Ölçüm Esasları',
      steps: [
        { step: 1, title: 'Test Edilmiş Sistem Profilini Baz Alın', desc: 'Onaylı yangın profilinin cam yuva ölçülerini belirleyin.' },
        { step: 2, title: 'Genleşme Toleransını Hesaplayın', desc: 'Yangın anında profil ve camın esnemesi için her kenarda en az 5 mm boşluk bırakın.' },
        { step: 3, title: 'Montaj Derinliğini Kontrol Edin', desc: 'Cam kalınlığına uygun çıta derinliğini teyit edin.' }
      ],
      toleranceTip: 'EI90 Yangın Dayanımlı Cam sipariş ölçüsü doğrama boşluğundan en az 10 mm küçük olmalıdır.'
    },
    howToInstall: {
      title: 'Doğru Montaj Aşamaları',
      steps: [
        { step: 1, title: 'Yangın Takozlarını Yerleştirin', desc: 'Kalsiyum silikat yangın takozlarını doğru konumlara dizin.' },
        { step: 2, title: 'İntümesan Fitil ile Yalıtın', desc: 'Cam kenarlarına ısıda genleşen yangın fitillerini yerleştirin.' },
        { step: 3, title: 'Yangın Çıtalarını Sabitleyin', desc: 'Test raporuna uygun vidalar ile çıtaları sabitleyip yangın mastiği çekin.' }
      ]
    },
    installationCautions: {
      title: 'Montaj Hataları ve Uyarılar',
      points: [
        { title: 'Şantiyede Kesim Yapılamaz', desc: 'Cam özel lamine jelli olduğundan yerinde kesilmez.', isWarning: true },
        { title: 'Standart Silikon Kullanmayın', desc: 'Yangın mastiği yerine silikon kullanmak yangın güvenliğini bozar.', isWarning: true },
        { title: 'Nemden Koruyun', desc: 'Kenar alüminyum bantları suya maruz kalmamalıdır.' }
      ]
    },
    whyGlassCracks: {
      title: 'EI90 Yangın Dayanımlı Cam Neden Çatlar?',
      summary: 'Kasıntılı montaj, yetersiz genleşme boşluğu veya kenar bandı hasarı camın çatlamasına veya bozulmasına yol açar.',
      thermalExpansionExplanation: 'Yangında metal doğrama genişler; tolerans yoksa cam köşelerden sıkışır.',
      overtighteningExplanation: 'Çıtaların aşırı vidalanması camda bükülme gerilimi yaratır.',
      gasketExplanation: 'Kenar bandı sökülürse ortam nemi jel katmanını delamine eder.',
      preventionRules: [
        'Kenar koruyucu bantları çıkarmayın.',
        'Montajda yangına dayanıklı takoz ve mastik kullanın.',
        'Her kenarda 5 mm genleşme boşluğu bırakın.'
      ]
    },
    priceCalculationInfo: {
      title: 'Fiyatlandırma Mantığı',
      explanation: 'Yangın dayanım süresi (EI30, EI60, EI90, EI120) ve metrekareye göre anında şeffaf fiyat oluşturulur.',
      standardThickness: '15 mm – 52 mm',
      steps: [
        'Ölçüleri girin.',
        'Yangın sınıfını belirleyin.',
        'Anında proje fiyat teklifi alın.'
      ]
    },
    visuals: {
      product: { title: 'Sertifikalı EI90 Yangın Dayanımlı Cam', alt: 'EI90 Yangın Dayanımlı Cam plakası', desc: 'Isı ve alev bariyeri intümesan katmanlı cam', tag: 'Ürün' },
      measure: { title: 'Doğrama Net Ölçü Tespiti', alt: 'EI90 Yangın Dayanımlı Cam doğrama ölçüsü alma', desc: 'Tolerans ve çıta derinliği tespiti', tag: 'Ölçü Alma' },
      install: { title: 'Sertifikalı Yangın Camı Montajı', alt: 'EI90 Yangın Dayanımlı Cam montajı', desc: 'Yangın takozu and intümesan fitil uygulaması', tag: 'Montaj' },
      application: { title: 'Mimari Yangın Zonlama Duvarı', alt: 'Bina içi yangın bölme duvarı uygulaması', desc: 'Yangının yayılmasını durduran şeffaf mimari bariyer', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru montaj: yangın takozu ve intümesan fitilli',
        correctDesc: 'Doğru: Sertifikalı takoz kullanılmış, genleşme payı bırakılmış.',
        incorrectAlt: 'Hatalı montaj: takozsuz ve standart silikonlu',
        incorrectDesc: 'Hatalı: Yangın takozu yok, cam metale sürtüyor.'
      }
    },
    faqs: [
      { question: 'EI90 Yangın Dayanımlı Camların ömrü ne kadardır?', answer: 'Uygun montaj ve kenar bandı korunduğu takdirde bina ömrü boyunca (20+ yıl) yangın dayanımını muhafaza eder.' },
      { question: 'EI90 Yangın Dayanımlı Cam dış cephede ısı yalıtımı (Low-E) sağlar mı?', answer: 'Evet, çift cam kombinasyonu yapılarak Low-E veya güneş kontrol kaplaması ile birleştirilebilir.' },
      { question: 'Sertifikalar belediye ve itfaiye onayında geçerli midir?', answer: 'Evet, akredite Avrupa laboratuvar test belgelerimiz Türkiye Yangın Yönetmeliği kapsamında itfaiye onayına uygundur.' }
    ],
    relatedCategorySlugs: ['yangin-cami', 'yangina-dayanikli-cam', 'yangin-kapisi-cami', 'yangin-guvenlik-cami']
  },

  // 13. Temperli Cam
  {
    slug: 'temperli-cam',
    path: '/temperli-cam',
    name: 'Temperli Cam',
    navTitle: 'Temperli Cam',
    title: 'Temperli Cam – EN 12150 Güvenlik ve Darbe Dayanımlı Emniyet Camları',
    metaDescription: 'EN 12150 standartlarında özel ölçü temperli camlar. Standart cama göre 5 kat dayanıklı, parçalanma emniyetli mimari ve endüstriyel çözümler.',
    canonical: 'https://mimaricam.com/temperli-cam',
    h1: 'Temperli Cam – Yüksek Mekanik Mukavemetli ve Güvenlikli Emniyet Camı',
    badge: 'EN 12150 Standardı | 5 Kat Yüksek Darbe ve Mekanik Dayanım',
    intro: 'Temperli cam, yaklaşık 650°C sıcaklıkta fırınlanıp hava üflemesiyle hızla soğutularak yüzeyine yüksek basma gerilimi kazandırılmış emniyet camıdır. Standart cama göre 5 kat daha dayanıklıdır ve kırıldığında küçük, keskin olmayan zararsız parçacıklara ayrılarak yaralanmaları önler.',
    searchIntentSummary: 'Temperli camın özelliklerini, nerelerde kullanıldığını, montaj ve ölçü alma kurallarını, temperli camın neden kendiliğinden çatlayabileceğini (NiS inklüzyonu) ve fiyat hesaplamasını inceleyin.',
    whatIs: {
      title: 'Temperli Cam Nedir ve Nasıl Üretilir?',
      description: 'Temperleme işlemi, camın moleküler yapısını yeniden düzenler. Dış yüzeylerde yüksek basma gerilimi, iç çekirdekte ise çekme gerilimi oluşturur. Bu gerilim dengesi camın esneme ve darbe direncini katbekat artırır.',
      highlights: [
        'Standart cama göre 5 kat yüksek darbe ve bükülme mukavemeti',
        '250°C ani termal şok dayanımı (standart cam 80°C)',
        'Kırıldığında yaralanma riski yaratmayan zararsız partikül kırılması',
        'CNC delik, kanal ve rodaj işlemlerinin temperleme öncesi yapılması zorunluluğu'
      ]
    },
    whereUsed: {
      title: 'Temperli Cam Nerelerde Kullanılır?',
      items: [
        { name: 'Cam Kapılar ve Bölme Duvarlar', desc: 'Ofis içi şeffaf cam kapılar, sürgülü sistemler ve cam ayırıcılar.' },
        { name: 'Korkuluk ve Küpeşte Sistemleri', desc: 'Balkon, teras ve merdiven cam korkulukları.' },
        { name: 'Duşakabin Camları', desc: 'Banyo duşakabinlerinde güvenlikli darbe camları.' },
        { name: 'Masa, Sehpa ve Raf Camları', desc: 'Yüksek ağırlık taşıyan mobilya ve vitrin camları.' }
      ]
    },
    howToMeasure: {
      title: 'Temperli Cam Ölçüsü Nasıl Alınır?',
      steps: [
        { step: 1, title: 'Milimetrik Net Ölçü Alın', desc: 'Temperli cam fırından çıktıktan sonra ASLA kesilemez, delinemez veya tıraşlanamaz. Ölçü baştan sıfır hata ile alınmalıdır.' },
        { step: 2, title: 'Menteşe ve Kulp Deliklerini Belirleyin', desc: 'Tüm kulp, kilit ve menteşe delik merkezleri imalat çizimine milimetrik işlenmelidir.' },
        { step: 3, title: 'Montaj Boşluğu (Tolerans) Bırakın', desc: 'Cam kapı veya korkuluklarda sürtünmeyi önlemek için zemin ve yanlardan gerekli boşluklar düşülmelidir.' }
      ],
      toleranceTip: 'Cam kapılarda alt boşluk 8-10 mm, yan boşluklar 3-4 mm bırakılarak net cam ölçüsü çıkarılır.'
    },
    howToInstall: {
      title: 'Temperli Cam Montaj Yöntemi',
      steps: [
        { step: 1, title: 'Camı Yere Asla Doğrudan Koymayın', desc: 'Montaj esnasında cam kenarları veya köşeleri asla fayans, beton veya metale değdirilmemelidir (ahşap/karton takoz kullanın).' },
        { step: 2, title: 'Menteşe Contalarını Eksiksiz Takın', desc: 'Menteşe ve kulp metalinin cama temas etmemesi için iç lastik contalarını eksiksiz takın.' },
        { step: 3, title: 'Vidaları Tork Ayarıyla Dengeli Sıkın', desc: 'Menteşe vidalarını çapraz ve dengeli sıkarak montajı tamamlayın.' }
      ]
    },
    installationCautions: {
      title: 'Temperli Cam Montajında Kritik Kurallar',
      points: [
        { title: 'Fırından Sonra Kesim Yapılamaz', desc: 'Temperli cam kesilmeye veya delinmeye çalışılırsa anında tuzla buz olur.', isWarning: true },
        { title: 'Köşeler En Hassas Noktadır', desc: 'Camın yüzeyi çok güçlüdür ancak köşeye sert bir darbe gelirse tüm cam patlar.', isWarning: true },
        { title: 'Metale Doğrudan Temas Ettirmeyin', desc: 'Metal menteşe ve kollar arasına mutlaka plastik/kauçuk conta konulmalıdır.' }
      ]
    },
    whyGlassCracks: {
      title: 'Temperli Cam Neden Çatlar veya Patlar?',
      summary: 'Temperli camlar yüzey darbesiyle kolay kırılmaz; köşe darbeleri, menteşelerin metale doğrudan basması veya nikel sülfür (NiS) inklüzyonu sebebiyle kırılır.',
      thermalExpansionExplanation: 'Temperli cam 250°C sıcaklık farkına dayanır ancak çerçeve içinde genleşme payı bırakılmazsa sıkışarak kırılabilir.',
      overtighteningExplanation: 'Menteşe vidaları lastik conta olmadan aşırı sıkıldığında delik kenarında stres başlatır ve cam aniden patlayabilir.',
      gasketExplanation: 'Cam köşesinin sert zemine çarpması yüzeydeki basma gerilimini bozar ve cam anında küçük parçalara dağılır.',
      preventionRules: [
        'Cam köşelerini daima plastik köşe koruyucularla koruyun.',
        'Menteşe montajında contaları eksiksiz kullanın.',
        'Kritik cephelerde Heat Soak Test (HST) uygulanmış cam tercih edin.'
      ]
    },
    priceCalculationInfo: {
      title: 'Temperli Cam Fiyat Hesaplama',
      explanation: 'Cam kalınlığı (4, 6, 8, 10, 12 mm), cam rengi (şeffaf, füme, bronz, ekstra reflekte), CNC rodaj ve delik sayısına göre şeffaf fiyat hesaplanır.',
      standardThickness: '4 mm – 19 mm arası şeffaf veya renkli temperli cam',
      steps: [
        'Genişlik ve yükseklik ölçülerini girin.',
        'Cam kalınlığını seçin (örn: 8 mm veya 10 mm).',
        'Anında net fiyatınızı hesaplayın.'
      ]
    },
    visuals: {
      product: { title: 'EN 12150 Sertifikalı Temperli Cam', alt: 'Temperli güvenlik camı plakası ve rodajlı kenar', desc: '5 kat mukavemetli şeffaf emniyet camı', tag: 'Ürün' },
      measure: { title: 'Cam Kapı ve Delik Aksı Ölçümü', alt: 'Temperli cam kapı ölçüsü alma', desc: 'Menteşe delikleri ve köşe boşluklarının hassas tespiti', tag: 'Ölçü Alma' },
      install: { title: 'Contalı Menteşe ve Korkuluk Montajı', alt: 'Temperli cam menteşe montajı', desc: 'Camı metale değdirmeyen kauçuk contalı sabitleme', tag: 'Montaj' },
      application: { title: 'Mimari Cam Kapı ve Korkuluk', alt: 'Modern ofiste temperli cam kapı ve korkuluk', desc: 'Şeffaf, ferah ve emniyetli yaşam alanları', tag: 'Kullanım Alanı' },
      correctVsIncorrect: {
        correctAlt: 'Doğru montaj: kauçuk contalı menteşe ve köşesi korumalı',
        correctDesc: 'Doğru: Menteşe contalı, metal temas engellenmiş.',
        incorrectAlt: 'Hatalı montaj: contasız doğrudan metale sıkılmış menteşe',
        incorrectDesc: 'Hatalı: Menteşe metali doğrudan cama basıyor, kırılma riski yüksek.'
      }
    },
    faqs: [
      { question: 'Temperli cam sobada veya şöminede kullanılır mı?', answer: 'HAYIR. Temperli cam doğrudan ateşe maruz kaldığında 250-300°C üzerinde patlar. Soba ve şöminelerde MUTLAKA 800°C dayanımlı ROBAX® seramik cam kullanılmalıdır.' },
      { question: 'Temperli cam teslim alındıktan sonra kesilebilir mi?', answer: 'Kesinlikle hayır. Temperli cam fırından çıktıktan sonra kesilemez ve delinemez; tüm işlemler temperleme öncesinde yapılmalıdır.' },
      { question: 'Temperli cam kırıldığında keser mi?', answer: 'Hayır, EN 12150 standardı gereği tavla zarı büyüklüğünde keskin olmayan küçük parçalara bölünür ve yaralanma riskini minimuma indirir.' }
    ],
    relatedCategorySlugs: ['isiya-dayanikli-cam', 'seramik-cam', 'yangin-emniyet-cami', 'yangin-guvenlik-cami']
  }
];

export const CATEGORY_SEO_MAP = new Map<string, CategorySeoItem>(
  CATEGORY_SEO_LIST.map((item) => [item.slug, item])
);
