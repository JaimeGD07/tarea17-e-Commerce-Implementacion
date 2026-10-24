import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ApiError } from "@/lib/api/errors";
import { fetchProduct, fetchProducts } from "@/lib/api/products";
import type { Product } from "@/lib/api/types";

/**
 * Lecturas cacheadas del catalogo (publicas, no dependen del usuario).
 *
 * - `use cache` + `cacheTag('products')`: tras crear una orden (cambia el stock)
 *   las Server Actions llaman a `updateTag('products')` y el catalogo se refresca.
 * - cacheLife con `expire` < 5 min: Next lo trata como "short-lived", asi que NO se
 *   prerenderiza en el build. Resultado: `next build` no necesita la API encendida y
 *   el catalogo llega por streaming detras de <Suspense>.
 */

const CATALOG_LIFE = { stale: 30, revalidate: 60, expire: 240 } as const;

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife(CATALOG_LIFE);

  return fetchProducts();
}

/** Devuelve `null` si el producto no existe (404). Otros errores se propagan a error.tsx. */
export async function getProduct(id: number): Promise<Product | null> {
  "use cache";
  cacheTag("products", `product:${id}`);
  cacheLife(CATALOG_LIFE);

  try {
    return await fetchProduct(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
