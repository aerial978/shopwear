import type { ProductListItem } from "../lib/types";
import { formatPrice } from "../lib/format";

type Props = {
  product: ProductListItem;
};

export function ProductCard({ product }: Props) {
  const img = product.mainImageUrl || "/images/products/placeholder.jpg";

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="aspect-[4/3] w-full bg-gray-100">
        <img
          src={img}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">{product.category?.name}</p>
            <h3 className="mt-1 font-semibold">{product.name}</h3>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
              product.isActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
            title={product.isActive ? "Actif" : "Inactif"}
          >
            {product.isActive ? "Actif" : "Inactif"}
          </span>
        </div>

        <div className="mt-3 text-sm font-semibold">
          {formatPrice(product.priceCents, product.currency)}
        </div>
      </div>
    </div>
  );
}
