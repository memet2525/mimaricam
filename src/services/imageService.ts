import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';
import { ImageItem, ImageAnalysisResult, OperationType } from '../types';
import { handleFirestoreError } from './firestoreErrors';

export const DEFAULT_REPLACEMENT_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322';

export const imageRegistry = {
  '00-mimaricam-logo.png': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/mimaricam-logo.png?alt=media&token=eac94e64-c2f6-4978-b9cc-8f9173d5ba29',
  'favicon.png': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/favicon.png?alt=media&token=6754450d-0005-4da6-a5ea-139f038f8d4e',
  ozelOlcuCamTasarimi: DEFAULT_REPLACEMENT_IMAGE,
  mimariCamTasarimi: DEFAULT_REPLACEMENT_IMAGE,
  ei120YanginCami: DEFAULT_REPLACEMENT_IMAGE,
  ei90YanginCami: DEFAULT_REPLACEMENT_IMAGE,
  ei30YanginCami: DEFAULT_REPLACEMENT_IMAGE,
  eEwYanginCami: DEFAULT_REPLACEMENT_IMAGE,
  yanginKapisiCami23: DEFAULT_REPLACEMENT_IMAGE,
  caminGucunuKesfetSlider: DEFAULT_REPLACEMENT_IMAGE,
  homeCamCati: DEFAULT_REPLACEMENT_IMAGE,
  caminGucunuKesfetHero: DEFAULT_REPLACEMENT_IMAGE,
  yanginDayanimliCam: DEFAULT_REPLACEMENT_IMAGE,
  somineCami: DEFAULT_REPLACEMENT_IMAGE,
  camCepheMuhendislik: DEFAULT_REPLACEMENT_IMAGE,
  camBolmeSistemleri: DEFAULT_REPLACEMENT_IMAGE,
  homeBuyukProjeler: DEFAULT_REPLACEMENT_IMAGE,
  camKalinligi: DEFAULT_REPLACEMENT_IMAGE,
  yuksekIsiDayanimliCam: DEFAULT_REPLACEMENT_IMAGE,
  sobaCami: DEFAULT_REPLACEMENT_IMAGE,
  guvenlikCami: DEFAULT_REPLACEMENT_IMAGE,
  camGuvenlikCozumleri: DEFAULT_REPLACEMENT_IMAGE,
  lamineGuvenlikCami: DEFAULT_REPLACEMENT_IMAGE,
  endustriyelOzelCam: DEFAULT_REPLACEMENT_IMAGE,
  hastaneYanginCami: DEFAULT_REPLACEMENT_IMAGE,
  yanginKapisiCami: DEFAULT_REPLACEMENT_IMAGE,
  mimariCamProjeleri: DEFAULT_REPLACEMENT_IMAGE,
  projelerIcinGuvenliCam: DEFAULT_REPLACEMENT_IMAGE,
  villaCamSistemleri: DEFAULT_REPLACEMENT_IMAGE,
  mimariCamUygulamalari: DEFAULT_REPLACEMENT_IMAGE,
  camKorkulukSistemleri: DEFAULT_REPLACEMENT_IMAGE,
  banyoCamCozumleri: DEFAULT_REPLACEMENT_IMAGE,
};

export function getStorageUrl(pathOrKey: string): string {
  if (!pathOrKey) return '';
  if (pathOrKey.startsWith('https://firebasestorage.googleapis.com/') || pathOrKey.startsWith('/assets/') || pathOrKey.startsWith('/src/')) {
    return pathOrKey;
  }
  if (pathOrKey.startsWith('http://') || pathOrKey.startsWith('https://')) {
    return DEFAULT_REPLACEMENT_IMAGE;
  }
  if (imageRegistry[pathOrKey as keyof typeof imageRegistry]) {
    return imageRegistry[pathOrKey as keyof typeof imageRegistry];
  }
  const encodedPath = encodeURIComponent(pathOrKey);
  return `https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/${encodedPath}?alt=media`;
}

export const resolveImageUrl = getStorageUrl;

/**
 * Slugify text for SEO-friendly filename:
 * - Replaces Turkish characters
 * - Converts to lowercase English ASCII
 * - Replaces spaces and invalid characters with hyphens
 * - Adds -mimaricam suffix and .webp extension
 */
export function formatSeoFileName(rawName: string, ext = 'webp'): string {
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

  let clean = rawName
    .split('')
    .map((char) => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // remove existing extension
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric to hyphens
    .replace(/^-+|-+$/g, ''); // trim hyphens

  if (!clean) clean = 'mimaricam-gorsel';

  if (!clean.includes('mimaricam')) {
    clean = `${clean}-mimaricam`;
  }

  const cleanExt = ext.replace(/^\./, '').toLowerCase() || 'webp';
  return `${clean}.${cleanExt}`;
}

export const imageService = {
  /**
   * Upload an image file directly to Firebase Storage under `mimaricam-gorseller/`
   */
  async uploadToFirebaseStorage(
    file: File,
    seoFileName: string,
    onProgress?: (percent: number) => void
  ): Promise<{ downloadUrl: string; storagePath: string }> {
    if (!auth.currentUser) {
      throw new Error('Görsel yüklemek için yönetici oturumu açık olmalıdır. Lütfen /boss üzerinden giriş yapınız.');
    }

    try {
      // Force refresh user ID token to ensure latest valid claims
      await auth.currentUser.getIdToken(true);
    } catch (tokenErr) {
      console.warn('Could not force refresh token before upload:', tokenErr);
    }

    const fileExt = file.name.includes('.') ? file.name.split('.').pop() || 'webp' : 'webp';
    const formattedName = formatSeoFileName(seoFileName || file.name, fileExt);
    const storagePath = `mimaricam-gorseller/${Date.now()}_${formattedName}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'image/webp',
      customMetadata: {
        uploadedBy: auth.currentUser.email || 'atlaspelet.com@gmail.com',
        uploadedAt: new Date().toISOString(),
      },
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error('Firebase Storage Upload Error:', error);
          if (error.code === 'storage/unauthorized') {
            reject(new Error('Firebase Storage yetki hatası (storage/unauthorized): Lütfen oturumunuzu kontrol ediniz veya Storage kurallarının güncellendiğinden emin olunuz.'));
          } else {
            reject(error);
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ downloadUrl, storagePath });
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      );
    });
  },

  /**
   * Central Firestore image creation
   */
  async createImage(data: Omit<ImageItem, 'id' | 'createdAt'>): Promise<ImageItem> {
    const path = 'images';
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, path), {
        ...data,
        createdAt: now,
        updatedAt: now,
      });

      return {
        id: docRef.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  /**
   * Fetch all images from Firestore
   */
  async getAllImages(): Promise<ImageItem[]> {
    const path = 'images';
    try {
      // Order by order asc, or fallback to unordered if index isn't ready
      let snapshot;
      try {
        const q = query(collection(db, path), orderBy('order', 'asc'));
        snapshot = await getDocs(q);
      } catch {
        snapshot = await getDocs(collection(db, path));
      }

      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ImageItem, 'id'>),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  /**
   * Get single image by imageId
   */
  async getImageById(imageId: string): Promise<ImageItem | null> {
    const path = `images/${imageId}`;
    try {
      const docSnap = await getDoc(doc(db, 'images', imageId));
      if (!docSnap.exists()) return null;
      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<ImageItem, 'id'>),
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  /**
   * Update an image record
   */
  async updateImage(id: string, updates: Partial<ImageItem>): Promise<void> {
    const path = `images/${id}`;
    try {
      const { id: _, ...cleanUpdates } = updates as any;
      await updateDoc(doc(db, 'images', id), {
        ...cleanUpdates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Delete an image record from Firestore, and if stored in Firebase Storage, remove only that file
   */
  async deleteImage(id: string, storagePath?: string): Promise<void> {
    const path = `images/${id}`;
    try {
      await deleteDoc(doc(db, 'images', id));

      // Safely delete file from storage ONLY if it belongs to mimaricam-gorseller
      if (storagePath && storagePath.startsWith('mimaricam-gorseller/')) {
        try {
          const fileRef = ref(storage, storagePath);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.warn('Storage file deletion skipped or failed:', storageErr);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  /**
   * Call AI to analyze an image (via server endpoint /api/analyze-image)
   */
  async analyzeWithAI(payload: {
    imageBase64?: string;
    mimeType?: string;
    imageUrl?: string;
    fileName?: string;
  }): Promise<ImageAnalysisResult> {
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data as ImageAnalysisResult;
    } catch (err) {
      console.warn('AI analysis API returned error, activating smart fallback:', err);
      // Smart architectural fallback so user workflow is never blocked
      return generateHeuristicFallback(payload.fileName || payload.imageUrl || 'mimari-cam');
    }
  },
};

/**
 * Intelligent heuristic fallback if AI service is temporarily offline
 */
function generateHeuristicFallback(input: string): ImageAnalysisResult {
  const lower = input.toLowerCase();

  if (lower.includes('ei90') || lower.includes('90')) {
    return {
      name: 'EI90 Yangın Dayanımlı Cam',
      seoFileName: 'ei90-yangin-dayanimli-cam-mimaricam.webp',
      altText: 'EI90 yangın dayanımlı cam sistemi',
      title: 'EI90 Yangın Camı',
      description: 'EI90 sınıfı 90 dakika yangın bütünlüğü ve ısı yalıtımı sağlayan mimari cam çözümü.',
      category: 'Yangına Dayanıklı Camlar',
      product: 'MimariCam HeavyDuty EI90 Yangın Camı',
    };
  }

  if (lower.includes('ei60') || lower.includes('60')) {
    return {
      name: 'EI60 Yangın Dayanımlı Cam',
      seoFileName: 'ei60-yangin-dayanimli-cam-mimaricam.webp',
      altText: 'EI60 yangın dayanımlı cam sistemi ve kapı bölmesi',
      title: 'EI60 Yangın Camı',
      description: 'EI60 sınıfı 60 dakika yangın ve radyasyon yalıtımı sağlayan intumescent ara katmanlı yangın camı.',
      category: 'Yangına Dayanıklı Camlar',
      product: 'MimariCam FlameGuard EI60 Yangın Camı',
    };
  }

  if (lower.includes('ei30') || lower.includes('30')) {
    return {
      name: 'EI30 Yangın Dayanımlı Cam',
      seoFileName: 'ei30-yangin-dayanimli-cam-mimaricam.webp',
      altText: 'EI30 yangın dayanımlı mimari kapı camı',
      title: 'EI30 Yangın Camı',
      description: 'EI30 yangın kompartıman ve koridor kapıları için 30 dakika sertifikalı mimari cam.',
      category: 'Yangına Dayanıklı Camlar',
      product: 'MimariCam FlameGuard EI30 Yangın Camı',
    };
  }

  if (lower.includes('robax') || lower.includes('somine') || lower.includes('fireplace')) {
    return {
      name: 'Schott ROBAX® Şömine Cam-Seramiği',
      seoFileName: 'schott-robax-somine-cami-mimaricam.webp',
      altText: 'ROBAX 800 dereceye dayanıklı şömine cam seramiği',
      title: 'ROBAX® Şömine Camı',
      description: '800°C termal şoka dayanıklı, sıfır genleşmeli orijinal Schott ROBAX® şömine cam seramiği.',
      category: 'ROBAX® Cam-Seramik',
      product: 'Schott ROBAX® 4mm Şömine Cam Seramiği',
    };
  }

  if (lower.includes('soba') || lower.includes('pelet') || lower.includes('stove')) {
    return {
      name: 'Pelet ve Odun Sobası Termal Camı',
      seoFileName: 'pelet-soba-cami-mimaricam.webp',
      altText: 'Pelet sobası yüksek ısıya dayanıklı alev izleme camı',
      title: 'Pelet Soba Camı',
      description: 'Yüksek sıcaklığa dayanıklı, is ve kurum tutmayan özel pelet soba camı.',
      category: 'Soba Camları',
      product: 'Pelet & Odun Sobası Termal Camı',
    };
  }

  if (lower.includes('lamine') || lower.includes('akustik') || lower.includes('laminated')) {
    return {
      name: 'AcousticSilence Akustik Lamine Cam',
      seoFileName: 'akustik-lamine-guvenlik-cami-mimaricam.webp',
      altText: 'Akustik PVB ara katmanlı ses ve emniyet camı',
      title: 'Akustik Lamine Cam',
      description: 'Yüksek ses yalıtımı ve kırılmaz güvenlik sunan özel PVB ara katmanlı lamine mimari cam.',
      category: 'Lamine Camlar',
      product: 'AcousticSilence Lamine Akustik Güvenlik Camı',
    };
  }

  if (lower.includes('temper') || lower.includes('tempered') || lower.includes('safety')) {
    return {
      name: 'UltraClear Temperli Emniyet Camı',
      seoFileName: 'temperli-mimari-emniyet-cami-mimaricam.webp',
      altText: 'Yüksek mukavemetli temperli mimari emniyet camı',
      title: 'Temperli Mimari Cam',
      description: 'EN 12150 standardına uygun, 5 kat darbe dayanımlı şeffaf temperli mimari güvenlik camı.',
      category: 'Temperli Camlar',
      product: 'UltraClear 10mm Temperli Mimari Emniyet Camı',
    };
  }

  return {
    name: 'Mimari Yangın ve Güvenlik Camı',
    seoFileName: 'mimari-yangin-ve-guvenlik-cami-mimaricam.webp',
    altText: 'Yüksek performanslı mimari cam sistemi çözümü',
    title: 'MimariCam Özel Çözüm',
    description: 'EN standartlarına uygun, yüksek dayanımlı ve enerji verimli mimari cam çözümü.',
    category: 'Yangına Dayanıklı Camlar',
    product: 'MimariCam FlameGuard EI60 Yangın Camı',
  };
}
