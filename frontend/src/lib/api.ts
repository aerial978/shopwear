import type { Category, ProductsListResponse, ProductDetail } from "./types";

type GetProductsParams = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string; // slug
  sort?: "createdAt" | "priceCents";
  order?: "asc" | "desc";
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

function buildUrl(path: string, params?: Record<string, string | number | undefined | null>) {
  const url = new URL(path, API_BASE_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function requestJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    // Tentative de lire une erreur JSON / texte (optionnel mais utile)
    const contentType = res.headers.get("content-type") || "";
    let detail = "";
    try {
      if (contentType.includes("application/json")) {
        const data = await res.json();
        detail = data?.message ? String(data.message) : JSON.stringify(data);
      } else {
        detail = await res.text();
      }
    } catch {
      // ignore
    }

    throw new Error(`HTTP ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`);
  }

  return (await res.json()) as T;
}

export async function getCategories(): Promise<Category[]> {
  const url = buildUrl("/api/v1/categories");
  return requestJson<Category[]>(url);
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductsListResponse> {
  const url = buildUrl("/api/v1/products", {
    page: params.page ?? 1,
    limit: params.limit ?? 12,
    q: params.q ?? undefined,
    category: params.category ?? undefined,
    sort: params.sort ?? undefined,
    order: params.order ?? undefined,
  });

  return requestJson<ProductsListResponse>(url);
}

export async function getProduct(id: number | string): Promise<ProductDetail> {
  const url = buildUrl(`/api/v1/products/${id}`);
  return requestJson<ProductDetail>(url);
}
