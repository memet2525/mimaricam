// MimariCam Core Domain Types & Firestore Entities

export type FireRating = 'E' | 'EW' | 'EI' | 'EI30' | 'EI60' | 'EI90' | 'EI120' | 'NONE';

export type GlassCategorySlug =
  | 'yangin-camlari'
  | 'isiya-dayanikli-camlar'
  | 'somine-camlari'
  | 'soba-camlari'
  | 'robax-cam-seramik'
  | 'temperli-camlar'
  | 'lamine-camlar'
  | 'mimari-camlar'
  | 'cephe-camlari'
  | 'ozel-olcu-cam'
  | 'endustriyel-cam';

export type GlassShape =
  | 'rectangle'
  | 'square'
  | 'oval'
  | 'curved'
  | 'perforated'
  | 'lasercut'
  | 'custom';

export type EdgeFinish = 'rodaj' | 'c_rodaj' | 'bizote' | 'ham' | 'cnc';

export type ClientType =
  | 'architect'
  | 'engineer'
  | 'contractor'
  | 'glazier'
  | 'stove_manufacturer'
  | 'individual';

export type QuoteStatus = 'pending' | 'new' | 'in_review' | 'quoted' | 'approved' | 'rejected' | 'delivered';

export type UserRole = 'admin' | 'architect' | 'engineer' | 'client';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role?: UserRole;
  companyName?: string;
  phone?: string;
  city?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  slug: GlassCategorySlug | string;
  name: string;
  shortDesc: string;
  description: string;
  iconName: string;
  imageUrl: string;
  order: number;
  fireClassRange?: string;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  thicknessMm: number;
  fireRating?: FireRating;
  maxDimensions: {
    width: number;
    height: number;
  };
  weightPerM2Kg: number;
  soundReductionDb?: number;
  lightTransmission?: number;
  solarHeatGain?: number;
}

export interface Product {
  id: string;
  code: string;
  slug: string;
  name: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  fireRating: FireRating;
  thicknessMm: string;
  maxDimensions: {
    width: number;
    height: number;
  };
  summary: string;
  description: string;
  features: string[];
  applications: string[];
  certificates: string[];
  imageUrl: string;
  transparentPngUrl?: string;
  cadFileUrl?: string;
  specSheetUrl?: string;
  thermalShockResistanceC?: number;
  isFeatured?: boolean;
  status: 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomDesignConfig {
  shape: GlassShape;
  categoryId: string;
  glassTypeName: string;
  fireRating?: FireRating;
  thicknessMm: number;
  widthMm: number;
  heightMm: number;
  rightEdgeMm?: number;
  leftEdgeMm?: number;
  centerArchMm?: number;
  holeCount?: number;
  holeDiameterMm?: number;
  edgeFinish: EdgeFinish;
  customColorTint?: 'clear' | 'extra_clear' | 'bronze' | 'smoke' | 'frosted';
  notes?: string;
  calculatedAreaM2?: number;
  calculatedWeightKg?: number;
}

export interface QuoteItem {
  id: string;
  type: 'standard_product' | 'custom_design';
  productId?: string;
  productTitle?: string;
  designConfig?: CustomDesignConfig;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  targetDate?: string;
  notes?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientCompany?: string;
  clientType: ClientType;
  clientEmail: string;
  clientPhone: string;
  city: string;
  district?: string;
  items: QuoteItem[];
  projectLocation?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  model?: string;
  dimensions?: any;
  orderDetails?: any;
  requiredDeliveryDate?: string;
  attachmentUrls?: string[];
  status: QuoteStatus;
  adminNotes?: string;
  offeredPrice?: number;
  totalPrice?: number;
  currency?: 'TRY' | 'USD' | 'EUR';
  ownerId?: string;
  isGuest: boolean;
  createdAt: string;
  createdAtIso?: string;
  updatedAt?: string;
}

export interface TechnicalDocument {
  id: string;
  title: string;
  category: string;
  standardCode?: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'dwg' | 'bim' | 'zip';
  fileSizeMb?: number;
  fireRating?: FireRating;
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  institution: string;
  standard: string;
  validUntil: string;
  fileUrl: string;
  scope: string;
}

export interface ReferenceProject {
  id: string;
  title: string;
  location: string;
  city: string;
  year: number;
  architect?: string;
  glassTypesUsed: string[];
  imageUrl: string;
  description: string;
  storageFileName?: string;
}

export interface Project {
  id: string;
  title: string;
  client?: string;
  location?: string;
  description?: string;
  status: 'concept' | 'schematic' | 'construction' | 'completed' | 'archived';
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PhotoCapture {
  id: string;
  projectId: string;
  title?: string;
  category?: 'facade' | 'interior' | 'structural' | 'detail' | 'aerial' | 'progress';
  imageUrl: string;
  takenAt?: string;
  phase?: string;
  notes?: string;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LocationGeoPage {
  slug: string;
  city: string;
  district?: string;
  title: string;
  metaDescription: string;
  h1: string;
  introText: string;
  keyServices: string[];
  featuredProductSlugs: string[];
  phone: string;
  address: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  ogImage?: string;
  imageObject?: {
    '@type': 'ImageObject';
    contentUrl: string;
    name: string;
    description: string;
    [key: string]: unknown;
  };
  schemaJson?: Record<string, unknown> | Array<Record<string, unknown>>;
  keywords?: string[];
  noindex?: boolean;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface ImageItem {
  id: string;
  name: string;
  seoFileName: string;
  altText: string;
  title: string;
  description: string;
  category: string;
  product: string;
  isActive: boolean;
  order: number;
  source: 'Firebase Storage' | 'Harici URL';
  url: string;
  storagePath?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ImageAnalysisResult {
  name: string;
  seoFileName: string;
  altText: string;
  title: string;
  description: string;
  category: string;
  product: string;
}

export type LegalPageSlug =
  | 'hakkimizda'
  | 'mesafeli-satis-sozlesmesi'
  | 'gizlilik-ve-guvenlik'
  | 'iptal-ve-iade-kosullari'
  | 'kisisel-veriler-politikasi'
  | 'cerez-politikasi';

export interface LegalPage {
  id: string; // Document ID (slug)
  slug: LegalPageSlug | string;
  title: string;
  summary: string;
  content: string;
  updatedAt: string;
  updatedBy?: string;
  isCustom?: boolean;
}

