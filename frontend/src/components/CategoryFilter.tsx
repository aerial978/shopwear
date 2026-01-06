import type { Category } from "../lib/types";

type Props = {
  categories: Category[];
  value: string; // slug ou ""
  onChange: (slug: string) => void;
};

export function CategoryFilter({ categories, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Catégorie</label>
      <select
        className="rounded-lg border px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Toutes</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
