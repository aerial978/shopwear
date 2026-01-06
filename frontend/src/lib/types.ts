export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type ProductListItem = {
  id: number;
  name: string;
  slug: string;
  priceCents: number;
  currency: string;
  isActive: boolean;
  mainImageUrl: string | null;
  createdAt: string; // ISO
  category: Category;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number; // convention: 0 si total=0
};

export type ProductsListResponse = {
  items: ProductListItem[];
  pagination: Pagination;
};

export type ProductDetail = ProductListItem & {
  description?: string | null;
  updatedAt?: string;
};