export function formatPrice(priceCents: number, currency: string ='EUR'): string {
  const amount = priceCents / 100;

  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    // fallback si currency invalide
    return `${amount.toFixed(2)} ${currency}`;
  }
}
