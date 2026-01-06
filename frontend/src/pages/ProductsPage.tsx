import { useEffect, useMemo, useState } from "react";
import { getCategories, getProducts } from "../lib/api";
import type { Category, ProductsListResponse } from "../lib/types";
import { LoadingState, ErrorState, EmptyState } from "../components/UiStates";
import { ProductCard } from "../components/ProductCard";
import { Pagination } from "../components/Pagination";
import { CategoryFilter } from "../components/CategoryFilter";

type Sort = "createdAt" | "priceCents";
type Order = "asc" | "desc";

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const limit = 12;

  const [sort, setSort] = useState<Sort>("createdAt");
  const [order, setOrder] = useState<Order>("desc");
  const [q, setQ] = useState<string>("");

  const [data, setData] = useState<ProductsListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(
    () => ({ page, limit, q: q.trim() || undefined, category: category || undefined, sort, order }),
    [page, limit, q, category, sort, order]
  );

  // Charger catégories une fois
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cats = await getCategories();
        if (!cancelled) setCategories(cats);
      } catch {
        // volontairement non-bloquant pour l'affichage produits
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Charger produits à chaque changement de params
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await getProducts(params);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params]);

  // Reset page quand filtre change (logique UX)
  function onChangeCategory(slug: string) {
    setCategory(slug);
    setPage(1);
  }

  function onChangeSort(s: Sort) {
    setSort(s);
    setPage(1);
  }

  function onChangeOrder(o: Order) {
    setOrder(o);
    setPage(1);
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  if (loading && !data) {
    return <LoadingState title="Chargement du catalogue..." />;
  }

  if (error && !data) {
    return <ErrorState title="Erreur API" description={error} />;
  }

  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0, pages: 0 };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Catalogue produits</h1>
          <p className="mt-1 text-sm text-gray-600">
            Lecture seule — API `/api/v1/products` & `/api/v1/categories`
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <CategoryFilter categories={categories} value={category} onChange={onChangeCategory} />

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Tri</label>
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={sort}
              onChange={(e) => onChangeSort(e.target.value as Sort)}
            >
              <option value="createdAt">Nouveautés</option>
              <option value="priceCents">Prix</option>
            </select>

            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={order}
              onChange={(e) => onChangeOrder(e.target.value as Order)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          <form onSubmit={onSubmitSearch} className="flex items-center gap-2">
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm sm:w-56"
              placeholder="Recherche (name/slug)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="rounded-lg border px-3 py-2 text-sm">OK</button>
          </form>
        </div>
      </div>

      {loading && <LoadingState title="Chargement..." description="Récupération des produits." />}

      {error && <ErrorState title="Erreur lors du chargement" description={error} />}

      {!loading && !error && items.length === 0 && (
        <EmptyState title="Aucun produit" description="Aucun résultat pour ces filtres." />
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onPrev={() => setPage((v) => Math.max(1, v - 1))}
            onNext={() => setPage((v) => Math.min(pagination.pages, v + 1))}
          />
        </>
      )}
    </div>
  );
}
