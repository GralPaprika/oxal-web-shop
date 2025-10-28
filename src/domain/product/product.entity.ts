export interface Product {
  id: string; // Firestore document ID
  code: string; // Unique product code (e.g., COL001)
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: ProductCategory;
  images: ProductImage[];
  status: 'active' | 'inactive' | 'discontinued';
  isStarred: boolean; // For featuring on landing page
  badge?: 'new' | 'sale' | null; // Product badge for promotions
  tags?: string[];
  metadata?: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    materials?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  key: 'jewelry' | 'clothing' | 'decoration' | 'accessories';
  description?: string;
}

export interface CreateProductData {
  code: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  isStarred?: boolean;
  badge?: 'new' | 'sale' | null;
  images?: Omit<ProductImage, 'id'>[];
  tags?: string[];
  metadata?: Product['metadata'];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  isStarred?: boolean;
  badge?: 'new' | 'sale' | null;
  images?: Omit<ProductImage, 'id'>[];
  status?: Product['status'];
  tags?: string[];
  metadata?: Product['metadata'];
}

export interface ProductFilters {
  category?: string;
  status?: Product['status'];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface ProductListOptions {
  filters?: ProductFilters;
  sort?: ProductSort;
  limit?: number;
  offset?: number;
}