import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { LegalPage, LegalPageSlug, OperationType } from '../types';
import { LEGAL_PAGES_CONFIG, getSeedLegalPage } from '../data/legalPagesData';
import { handleFirestoreError } from './firestoreErrors';

const COLLECTION_NAME = 'legal_pages';

export const legalPageService = {
  /**
   * Belirtilen slug için Firestore'dan yasal sayfa içeriğini getirir.
   * Firestore'da henüz kayıt yoksa varsayılan seed taslak metni döner.
   */
  async getLegalPage(slug: string): Promise<LegalPage> {
    const seed = getSeedLegalPage(slug);
    const fallbackTitle = seed?.title || 'Yasal Bilgilendirme';
    const fallbackSummary = seed?.summary || '';
    const fallbackContent = seed?.content || 'İçerik hazırlanmaktadır.';

    try {
      const docRef = doc(db, COLLECTION_NAME, slug);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          id: slug,
          slug: (data.slug || slug) as LegalPageSlug,
          title: data.title || fallbackTitle,
          summary: data.summary || fallbackSummary,
          content: data.content || fallbackContent,
          updatedAt: data.updatedAt || new Date().toISOString(),
          updatedBy: data.updatedBy,
          isCustom: true,
        };
      }
    } catch (error) {
      console.warn(`Firestore legal_page (${slug}) fetch warning, using seed fallback:`, error);
    }

    // Fallback seed page
    if (seed) return seed;

    return {
      id: slug,
      slug: slug as LegalPageSlug,
      title: fallbackTitle,
      summary: fallbackSummary,
      content: fallbackContent,
      updatedAt: new Date().toISOString(),
      isCustom: false,
    };
  },

  /**
   * Tüm 6 kurumsal/yasal sayfayı getirir (Firestore kayıtları + default seed harmanlanarak).
   */
  async getAllLegalPages(): Promise<LegalPage[]> {
    const firestoreMap = new Map<string, LegalPage>();

    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const slug = docSnap.id;
        firestoreMap.set(slug, {
          id: slug,
          slug: (data.slug || slug) as LegalPageSlug,
          title: data.title,
          summary: data.summary || '',
          content: data.content || '',
          updatedAt: data.updatedAt || new Date().toISOString(),
          updatedBy: data.updatedBy,
          isCustom: true,
        });
      });
    } catch (error) {
      console.warn('Firestore getAllLegalPages query warning, using seeds:', error);
    }

    // Her 6 sayfa için Firestore verisi varsa onu, yoksa seed verisini eşleştir
    return LEGAL_PAGES_CONFIG.map((cfg) => {
      const customDoc = firestoreMap.get(cfg.slug);
      if (customDoc) {
        return {
          ...customDoc,
          title: customDoc.title || cfg.title,
          summary: customDoc.summary || cfg.summary,
        };
      }
      return {
        id: cfg.slug,
        slug: cfg.slug,
        title: cfg.title,
        summary: cfg.summary,
        content: cfg.defaultContent,
        updatedAt: new Date().toISOString(),
        isCustom: false,
      };
    });
  },

  /**
   * Admin paneli üzerinden yasal sayfayı Firestore'a kaydeder.
   */
  async saveLegalPage(
    slug: string,
    payload: { title: string; summary?: string; content: string; updatedBy?: string }
  ): Promise<LegalPage> {
    const now = new Date().toISOString();
    const docData: LegalPage = {
      id: slug,
      slug: slug as LegalPageSlug,
      title: payload.title.trim(),
      summary: (payload.summary || '').trim(),
      content: payload.content.trim(),
      updatedAt: now,
      updatedBy: payload.updatedBy || 'Admin',
      isCustom: true,
    };

    try {
      const docRef = doc(db, COLLECTION_NAME, slug);
      await setDoc(docRef, docData, { merge: true });
      return docData;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${slug}`);
    }
  },

  /**
   * Sayfayı ilk fabrika/seed ayarlarına geri döndürür.
   */
  async resetToDefault(slug: string): Promise<LegalPage> {
    const seed = getSeedLegalPage(slug);
    if (!seed) {
      throw new Error('Varsayılan şablon bulunamadı.');
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, slug);
      // Firestore'daki kaydı silerek varsayılan seed'e dönmesini sağlayabiliriz
      await deleteDoc(docRef);
    } catch (error) {
      console.warn(`Firestore delete error on reset (${slug}):`, error);
    }

    return seed;
  },
};
