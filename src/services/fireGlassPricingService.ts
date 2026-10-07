import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface CategoryPricingSettings {
  id: string; // e.g., 'yangin-cami'
  name: string; // e.g., 'E30 Yangın Camı'
  m2Price: number; // m² fiyatı (TL)
  minWidth: number; // min genişlik (cm)
  maxWidth: number; // max genişlik (cm)
  minHeight: number; // min yükseklik (cm)
  maxHeight: number; // max yükseklik (cm)
  thickness: string; // kalınlık bilgisi (örn: "6 mm")
  isActive: boolean; // aktif/pasif durumu
  updatedAt?: string;
}

export const DEFAULT_FIRE_GLASS_SETTINGS: Record<string, CategoryPricingSettings> = {
  'yangin-cami': {
    id: 'yangin-cami',
    name: 'E30 Yangın Camı',
    m2Price: 10104,
    minWidth: 10,
    maxWidth: 366,
    minHeight: 10,
    maxHeight: 183,
    thickness: '6 mm',
    isActive: true
  },
  'yangina-dayanikli-cam': {
    id: 'yangina-dayanikli-cam',
    name: 'E60 Yangına Dayanıklı Cam',
    m2Price: 10104,
    minWidth: 10,
    maxWidth: 366,
    minHeight: 10,
    maxHeight: 183,
    thickness: '6 mm',
    isActive: true
  },
  'yangin-kapisi-cami': {
    id: 'yangin-kapisi-cami',
    name: 'E90 Yangın Kapısı Camı',
    m2Price: 10104,
    minWidth: 10,
    maxWidth: 366,
    minHeight: 10,
    maxHeight: 183,
    thickness: '6 mm',
    isActive: true
  },
  'yangin-guvenlik-cami': {
    id: 'yangin-guvenlik-cami',
    name: 'EI30 Yangın Güvenlik Camı',
    m2Price: 10104,
    minWidth: 10,
    maxWidth: 366,
    minHeight: 10,
    maxHeight: 183,
    thickness: '15-52 mm',
    isActive: true
  },
  'yangin-emniyet-cami': {
    id: 'yangin-emniyet-cami',
    name: 'EI60 Yangın Emniyet Camı',
    m2Price: 10104,
    minWidth: 10,
    maxWidth: 366,
    minHeight: 10,
    maxHeight: 183,
    thickness: '15-52 mm',
    isActive: true
  },
  'yangin-dayanimli-cam': {
    id: 'yangin-dayanimli-cam',
    name: 'EI90 Yangın Dayanımlı Cam',
    m2Price: 10104,
    minWidth: 10,
    maxWidth: 366,
    minHeight: 10,
    maxHeight: 183,
    thickness: '15-52 mm',
    isActive: true
  },
  'temperli-cam': {
    id: 'temperli-cam',
    name: 'Temperli Cam',
    m2Price: 1650,
    minWidth: 10,
    maxWidth: 360,
    minHeight: 10,
    maxHeight: 200,
    thickness: '4-19 mm',
    isActive: true
  }
};

const SETTINGS_COLLECTION = 'settings';

export const fireGlassPricingService = {
  // Load settings for a single category, falling back to local defaults or localStorage
  async getCategorySettings(categoryId: string): Promise<CategoryPricingSettings> {
    const defaultVal = DEFAULT_FIRE_GLASS_SETTINGS[categoryId];
    if (!defaultVal) {
      throw new Error(`Geçersiz kategori anahtarı: ${categoryId}`);
    }

    try {
      const docRef = doc(db, SETTINGS_COLLECTION, `fg_${categoryId}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { ...defaultVal, ...snap.data() } as CategoryPricingSettings;
      }
    } catch (err) {
      console.warn(`Firestore pricing settings load failed for fg_${categoryId}:`, err);
    }

    // Try fallback to LocalStorage
    try {
      if (typeof window !== 'undefined') {
        const localCached = localStorage.getItem(`mimaricam_fg_cached_${categoryId}`);
        if (localCached) {
          return JSON.parse(localCached) as CategoryPricingSettings;
        }
      }
    } catch (e) {
      console.error(e);
    }

    return defaultVal;
  },

  // Load settings for all 7 categories
  async getAllSettings(): Promise<Record<string, CategoryPricingSettings>> {
    const categories = Object.keys(DEFAULT_FIRE_GLASS_SETTINGS);
    const results: Record<string, CategoryPricingSettings> = {};
    
    await Promise.all(
      categories.map(async (catId) => {
        results[catId] = await this.getCategorySettings(catId);
      })
    );

    return results;
  },

  // Save settings for a single category (keeps them independent as requested)
  async saveCategorySettings(categoryId: string, settings: CategoryPricingSettings): Promise<void> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, `fg_${categoryId}`);
      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Cache to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`mimaricam_fg_cached_${categoryId}`, JSON.stringify(settings));
      }
    } catch (err: any) {
      console.error(`Firestore pricing settings save failed for fg_${categoryId}:`, err);
      throw err;
    }
  }
};
