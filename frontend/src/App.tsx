import { useEffect, useState } from "react";
import { getHealth, type Health } from "./lib/api";

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Shopwear</h1>

      <div className="mt-4 rounded border bg-white p-4">
        {!health && !error && <p>Chargement…</p>}
        {error && <p className="text-red-600">Erreur : {error}</p>}
        {health && (
          <pre className="text-sm">{JSON.stringify(health, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
