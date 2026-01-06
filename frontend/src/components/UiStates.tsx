type Props = {
  title: string;
  description?: string;
};

export function LoadingState({ title, description }: Props) {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <p className="font-medium">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
}

export function ErrorState({ title, description }: Props) {
  return (
    <div className="py-10 text-center">
      <p className="font-semibold text-red-600">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
    </div>
  );
}

export function EmptyState({ title, description }: Props) {
  return (
    <div className="py-10 text-center">
      <p className="font-medium">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
}
