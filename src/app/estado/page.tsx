import { Suspense } from "react";
import { fetchProducts } from "@/lib/api/products";
import { ApiError } from "@/lib/api/errors";
import type { Product } from "@/lib/api/types";

export const metadata = { title: "Estado de la API" };

/**
 * Pagina TEMPORAL de la Fase 1: comprueba que Next.js llega a la API Laravel.
 * Se puede borrar cuando termine la tarea.
 */
export default function EstadoPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Estado de la API</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Verificacion de la conexion con <code>API_BASE_URL</code>.
      </p>
      <Suspense
        fallback={<p className="mt-6 animate-pulse">Consultando la API…</p>}
      >
        <ApiCheck />
      </Suspense>
    </main>
  );
}

async function ApiCheck() {
  let products: Product[] = [];
  let errorMsg: string | null = null;

  try {
    products = await fetchProducts();
  } catch (e) {
    errorMsg = e instanceof ApiError ? `${e.status}: ${e.message}` : String(e);
  }

  if (errorMsg) {
    return (
      <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">
        <p className="font-medium">No se pudo conectar</p>
        <p className="mt-1 text-sm">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
      <p className="font-medium">
        Conectado. {products.length} productos recibidos.
      </p>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — ${p.price} (stock {p.stock})
          </li>
        ))}
      </ul>
    </div>
  );
}
