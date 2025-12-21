export type Health = {
  status: string;
  service: string;
  version: string;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!baseUrl) {
  throw new Error("VITE_API_BASE_URL is not defined (check frontend/.env)");
}

export async function getHealth(): Promise<Health> {
  const res = await fetch(`${baseUrl}/api/v1/health`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Health check failed (HTTP ${res.status})`);
  }

  return (await res.json()) as Health;
}
