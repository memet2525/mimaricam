import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Quote } from '../types';
import { emailNotificationService } from './emailNotificationService';

export const QUOTES_COLLECTION = 'orders';
export const ORDERS_MIRROR_COLLECTION = 'siparisler';

/**
 * Deeply strips undefined properties from an object so Firestore addDoc/setDoc never throws
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((v) => v !== undefined)
      .map((item) => cleanFirestoreData(item)) as any;
  }
  if (typeof obj === 'object') {
    // Retain Date or FieldValue objects (like serverTimestamp())
    if (
      obj instanceof Date ||
      '_methodName' in (obj as any) ||
      (obj as any).constructor?.name === 'FieldValue'
    ) {
      return obj;
    }
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleanObj[key] = cleanFirestoreData(value);
      }
    }
    return cleanObj as any;
  }
  return obj;
}

function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MC-${year}-${random}`;
}

export function parseFirestoreDate(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (val.toDate && typeof val.toDate === 'function') {
    return val.toDate().toISOString();
  }
  if (typeof val.seconds === 'number') {
    return new Date(val.seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}

export const quoteService = {
  // Yeni teklif / sipariş talebini Firestore 'orders' ve 'siparisler' koleksiyonuna addDoc ile kaydetme
  async createQuote(quoteData: Partial<Quote>): Promise<Quote> {
    const quoteNumber = quoteData.quoteNumber || generateQuoteNumber();
    const currentUser = auth.currentUser;
    const nowIso = new Date().toISOString();

    const clientName = (quoteData.clientName || quoteData.customerName || 'Müşteri').trim();
    const clientPhone = (quoteData.clientPhone || quoteData.customerPhone || '').trim();
    const projectLocation = (quoteData.projectLocation || quoteData.customerAddress || '').trim();

    const rawPayload: Record<string, any> = {
      ...quoteData,
      quoteNumber,
      clientName,
      customerName: clientName,
      clientPhone,
      customerPhone: clientPhone,
      clientEmail: quoteData.clientEmail || 'info@mimaricam.com',
      clientType: quoteData.clientType || 'individual',
      city: quoteData.city || 'Türkiye',
      district: quoteData.district || '',
      projectLocation,
      customerAddress: projectLocation,
      status: quoteData.status || 'new', // Varsayılan Yeni statüsü
      createdAt: serverTimestamp(),
      createdAtIso: nowIso,
      isGuest: !currentUser,
      ...(currentUser?.uid ? { ownerId: currentUser.uid } : {}),
    };

    const payloadToSave = cleanFirestoreData(rawPayload);

    try {
      // 1. Birincil 'orders' koleksiyonuna addDoc ile kaydet
      const colRef = collection(db, QUOTES_COLLECTION);
      const docRef = await addDoc(colRef, payloadToSave);

      // 2. Türkçe koleksiyon adı eşitlemesi için 'siparisler' koleksiyonuna da aynı ID ile kaydet
      try {
        await setDoc(doc(db, ORDERS_MIRROR_COLLECTION, docRef.id), payloadToSave);
      } catch (mirrorErr) {
        console.warn('Mirror to siparisler collection notice:', mirrorErr);
      }

      const savedQuote: Quote = {
        ...(payloadToSave as any),
        id: docRef.id,
        createdAt: nowIso,
      };

      return savedQuote;
    } catch (err: any) {
      console.error('Firestore createQuote addDoc error, trying setDoc fallback:', err);
      // İkincil fallback: setDoc ile kaydetmeyi dene
      try {
        const fallbackId = `order_${Date.now()}`;
        const fallbackRef = doc(db, QUOTES_COLLECTION, fallbackId);
        await setDoc(fallbackRef, payloadToSave);
        try {
          await setDoc(doc(db, ORDERS_MIRROR_COLLECTION, fallbackId), payloadToSave);
        } catch {
          // ignore
        }
        const fallbackQuote: Quote = {
          ...(payloadToSave as any),
          id: fallbackId,
          createdAt: nowIso,
        };
        return fallbackQuote;
      } catch (fallbackErr) {
        console.error('Critical Firestore order write error:', fallbackErr);
        throw err;
      }
    }
  },

  // Firestore 'orders' ve 'siparisler' koleksiyonunu CANLI (realtime onSnapshot) dinleyici
  subscribeToQuotes(callback: (quotes: Quote[]) => void): () => void {
    const quotesMap = new Map<string, Quote>();

    const emitQuotes = () => {
      const list = Array.from(quotesMap.values());
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    };

    const parseDoc = (docSnap: any): Quote => {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        quoteNumber: data.quoteNumber || docSnap.id.substring(0, 8),
        clientName: data.clientName || data.customerName || 'İsimsiz Müşteri',
        clientPhone: data.clientPhone || data.customerPhone || '',
        clientEmail: data.clientEmail || 'info@mimaricam.com',
        clientType: data.clientType || 'individual',
        city: data.city || 'Türkiye',
        district: data.district || '',
        projectLocation: data.projectLocation || data.customerAddress || '',
        status: data.status || 'new',
        items: data.items || [],
        offeredPrice: data.offeredPrice || data.totalPrice || 0,
        createdAt: parseFirestoreDate(data.createdAt || data.createdAtIso),
        isGuest: data.isGuest ?? true,
      } as Quote;
    };

    // 'orders' koleksiyonunu canlı dinle
    const unsubOrders = onSnapshot(
      collection(db, QUOTES_COLLECTION),
      (snapshot) => {
        snapshot.docs.forEach((d) => quotesMap.set(d.id, parseDoc(d)));
        emitQuotes();
      },
      (error) => {
        console.error('Firestore orders subscription error:', error);
      }
    );

    // 'siparisler' koleksiyonunu da canlı dinle (de-duplication Map ile)
    const unsubSiparisler = onSnapshot(
      collection(db, ORDERS_MIRROR_COLLECTION),
      (snapshot) => {
        snapshot.docs.forEach((d) => {
          if (!quotesMap.has(d.id)) {
            quotesMap.set(d.id, parseDoc(d));
          }
        });
        emitQuotes();
      },
      (error) => {
        console.warn('Firestore siparisler subscription notice:', error);
      }
    );

    return () => {
      unsubOrders();
      unsubSiparisler();
    };
  },

  // Tüm teklifleri bir kerelik çekme (fallback)
  async getAllQuotes(): Promise<Quote[]> {
    try {
      const colRef = collection(db, QUOTES_COLLECTION);
      const snap = await getDocs(colRef);
      const list = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          quoteNumber: data.quoteNumber || docSnap.id.substring(0, 8),
          clientName: data.clientName || data.customerName || 'İsimsiz Müşteri',
          clientPhone: data.clientPhone || data.customerPhone || '',
          clientEmail: data.clientEmail || 'info@mimaricam.com',
          clientType: data.clientType || 'individual',
          city: data.city || 'Türkiye',
          district: data.district || '',
          projectLocation: data.projectLocation || data.customerAddress || '',
          status: data.status || 'pending',
          items: data.items || [],
          offeredPrice: data.offeredPrice || data.totalPrice || 0,
          createdAt: parseFirestoreDate(data.createdAt || data.createdAtIso),
          isGuest: data.isGuest ?? true,
        } as Quote;
      });

      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    } catch (err) {
      console.error('Error fetching all quotes:', err);
      return [];
    }
  },

  // Kullanıcının teklifleri
  async getUserQuotes(): Promise<Quote[]> {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const q = query(collection(db, QUOTES_COLLECTION), where('ownerId', '==', user.uid), limit(50));
      const snap = await getDocs(q);
      const list = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          createdAt: parseFirestoreDate(data.createdAt || data.createdAtIso),
        } as Quote;
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    } catch (err) {
      console.error('Error fetching user quotes:', err);
      return [];
    }
  },

  // Durum güncelleme (Her iki koleksiyonu da senkronize eder)
  async updateQuoteStatus(quoteId: string, status: Quote['status'], adminNotes?: string, offeredPrice?: number): Promise<void> {
    try {
      const updateData = cleanFirestoreData({
        status,
        ...(adminNotes !== undefined && { adminNotes }),
        ...(offeredPrice !== undefined && { offeredPrice }),
        updatedAt: new Date().toISOString(),
      });

      const docRefOrders = doc(db, QUOTES_COLLECTION, quoteId);
      const docRefSiparisler = doc(db, ORDERS_MIRROR_COLLECTION, quoteId);

      await Promise.allSettled([
        setDoc(docRefOrders, updateData, { merge: true }),
        setDoc(docRefSiparisler, updateData, { merge: true }),
      ]);
    } catch (err) {
      console.error('Error updating quote status:', err);
      throw err;
    }
  },
};
