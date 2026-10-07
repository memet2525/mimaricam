import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Category, FireRating, OperationType } from '../types';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { handleFirestoreError } from './firestoreErrors';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';

export const productService = {
  // Get all active categories (Firestore merged with catalog seed)
  async getCategories(): Promise<Category[]> {
    if (typeof window !== 'undefined') {
      try {
        const cached = JSON.parse(localStorage.getItem('mimaricam_category_images') || '{}');
        CATEGORIES.forEach((cat) => {
          if (cached[cat.id]) {
            cat.imageUrl = cached[cat.id];
          }
        });
      } catch (e) {
        console.warn('LocalStorage category cache read error:', e);
      }
    }

    try {
      const colRef = collection(db, CATEGORIES_COLLECTION);
      const snap = await getDocs(query(colRef, orderBy('order', 'asc')));
      if (!snap.empty) {
        const firestoreMap = new Map(snap.docs.map((d) => [d.id, d.data()]));

        if (typeof window !== 'undefined') {
          try {
            const cached = JSON.parse(localStorage.getItem('mimaricam_category_images') || '{}');
            snap.docs.forEach((d) => {
              const data = d.data();
              if (data.imageUrl) {
                cached[d.id] = data.imageUrl;
              }
            });
            localStorage.setItem('mimaricam_category_images', JSON.stringify(cached));
          } catch (e) {
            console.warn('LocalStorage category cache sync error:', e);
          }
        }

        return CATEGORIES.map((cat) => {
          const override = firestoreMap.get(cat.id);
          const merged = override ? { ...cat, ...override } : cat;
          Object.assign(cat, merged);
          return merged;
        });
      }
      return CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  },

  // Get all published products (Firestore merged with catalog seed)
  async getProducts(): Promise<Product[]> {
    if (typeof window !== 'undefined') {
      try {
        const cached = JSON.parse(localStorage.getItem('mimaricam_product_images') || '{}');
        PRODUCTS.forEach((prod) => {
          if (cached[prod.id]) {
            prod.imageUrl = cached[prod.id];
          }
        });
      } catch (e) {
        console.warn('LocalStorage product cache read error:', e);
      }
    }

    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const snap = await getDocs(query(colRef, limit(100)));
      if (!snap.empty) {
        const firestoreMap = new Map(snap.docs.map((d) => [d.id, d.data()]));

        if (typeof window !== 'undefined') {
          try {
            const cached = JSON.parse(localStorage.getItem('mimaricam_product_images') || '{}');
            snap.docs.forEach((d) => {
              const data = d.data();
              if (data.imageUrl) {
                cached[d.id] = data.imageUrl;
              }
            });
            localStorage.setItem('mimaricam_product_images', JSON.stringify(cached));
          } catch (e) {
            console.warn('LocalStorage product cache sync error:', e);
          }
        }

        return PRODUCTS.map((prod) => {
          const override = firestoreMap.get(prod.id);
          const merged = override ? { ...prod, ...override } : prod;
          Object.assign(prod, merged);
          return merged;
        });
      }
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    const prods = await this.getProducts();
    const found = prods.find((p) => p.slug === slug);
    return found || null;
  },

  // Filter products by category slug and optional fire rating
  async getProductsByCategory(categorySlug: string, fireRating?: FireRating): Promise<Product[]> {
    const all = await this.getProducts();
    return all.filter((p) => {
      const matchCat = p.categorySlug === categorySlug;
      const matchFire = !fireRating || fireRating === 'NONE' || p.fireRating === fireRating;
      return matchCat && matchFire;
    });
  },

  // Get fire-rated products (E, EW, EI30, EI60, EI90, EI120)
  async getFireRatedProducts(specificRating?: FireRating): Promise<Product[]> {
    const all = await this.getProducts();
    return all.filter((p) => {
      if (specificRating && specificRating !== 'NONE') {
        return p.fireRating === specificRating;
      }
      return ['E', 'EW', 'EI', 'EI30', 'EI60', 'EI90', 'EI120'].includes(p.fireRating);
    });
  },

  // Admin: Save or update product
  async saveProduct(product: Partial<Product> & { id: string }): Promise<void> {
    // 1. Update in-memory reference
    const target = PRODUCTS.find((p) => p.id === product.id);
    if (target) {
      Object.assign(target, product);
    }

    // 2. Cache in localStorage for immediate client persistence
    if (typeof window !== 'undefined' && product.imageUrl) {
      try {
        const cached = JSON.parse(localStorage.getItem('mimaricam_product_images') || '{}');
        cached[product.id] = product.imageUrl;
        localStorage.setItem('mimaricam_product_images', JSON.stringify(cached));
      } catch (e) {
        console.warn('LocalStorage product cache error:', e);
      }
    }

    // 3. Persist directly to Firestore - throw if fails so caller can alert user
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, { ...product, updatedAt: new Date().toISOString() }, { merge: true });
  },

  // Admin: Save or update category
  async saveCategory(category: Partial<Category> & { id: string }): Promise<void> {
    // 1. Update in-memory reference
    const target = CATEGORIES.find((c) => c.id === category.id);
    if (target) {
      Object.assign(target, category);
    }

    // 2. Cache in localStorage for immediate client persistence
    if (typeof window !== 'undefined' && category.imageUrl) {
      try {
        const cached = JSON.parse(localStorage.getItem('mimaricam_category_images') || '{}');
        cached[category.id] = category.imageUrl;
        localStorage.setItem('mimaricam_category_images', JSON.stringify(cached));
      } catch (e) {
        console.warn('LocalStorage category cache error:', e);
      }
    }

    // 3. Persist directly to Firestore - throw if fails so caller can alert user
    const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
    await setDoc(docRef, { ...category, updatedAt: new Date().toISOString() }, { merge: true });
  },
};
