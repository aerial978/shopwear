type Props = {
  page: number;
  pages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function Pagination({ page, pages, onPrev, onNext }: Props) {
  if (pages === 0) return null;

  const canPrev = page > 1;
  const canNext = page < pages;

  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
        onClick={onPrev}
        disabled={!canPrev}
      >
        Prev
      </button>

      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> /{" "}
        <span className="font-medium">{pages}</span>
      </div>

      <button
        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
        onClick={onNext}
        disabled={!canNext}
      >
        Next
      </button>
    </div>
  );
}
