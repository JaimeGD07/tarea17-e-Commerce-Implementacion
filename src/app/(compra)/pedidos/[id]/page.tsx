import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductImage } from "@/components/product-image";
import { buttonSecondary } from "@/components/state-panel";
import { ApiError } from "@/lib/api/errors";
import { apiGetOrder } from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/lib/api/types";
import { requireSession } from "@/lib/auth/session";
import { formatPrice, toNumber } from "@/lib/money";

export const metadata = { title: "Detalle del pedido" };

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pendiente de pago", className: "border-amber/60 text-amber" },
  paid: { label: "Pagado", className: "border-ok/60 text-ok" },
  failed: { label: "Pago fallido", className: "border-out/60 text-out" },
  cancelled: { label: "Cancelado", className: "border-line-strong text-muted" },
};

export default function OrderPage({ params }: PageProps<"/pedidos/[id]">) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Suspense
        fallback={
          <div
            aria-busy="true"
            aria-label="Cargando pedido"
            className="h-64 animate-pulse rounded-md border border-line bg-panel-2"
          />
        }
      >
        <OrderDetail params={params} />
      </Suspense>
    </main>
  );
}

async function OrderDetail({
  params,
}: {
  params: PageProps<"/pedidos/[id]">["params"];
}) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const { token } = await requireSession(`/pedidos/${id}`);

  let order: Order | null = null;
  try {
    order = await apiGetOrder(token, id);
  } catch (e) {
    // 403 (orden de otra persona) y 404 se muestran igual: no revelamos que existe
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }

  const status = STATUS[order.status] ?? STATUS.pending;

  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Pedido #{order.id}
        </h1>
        <span
          className={`rounded-full border px-3 py-0.5 text-sm ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <ul className="mt-8 divide-y divide-line rounded-md border border-line bg-panel">
        {(order.items ?? []).map((item) => (
          <li key={item.id} className="flex items-center gap-4 p-4">
            <div className="w-20 shrink-0">
              <ProductImage
                src={item.product?.image_url ?? null}
                alt={item.product?.name ?? "Producto"}
                sizes="80px"
                className="rounded border border-line"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold leading-snug">
                {item.product?.name ?? `Producto #${item.product_id}`}
              </p>
              <p className="mt-0.5 text-sm text-muted">
                {item.quantity} × {formatPrice(item.unit_price)}
              </p>
            </div>
            <p className="font-display text-lg font-bold">
              {formatPrice(toNumber(item.unit_price) * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline justify-between rounded-md border border-line bg-panel px-4 py-4">
        <span>Total</span>
        <span className="font-display text-3xl font-bold text-amber">
          {formatPrice(order.total)}
        </span>
      </div>

      <div className="mt-6">
        <Link href="/" className={buttonSecondary}>
          Seguir comprando
        </Link>
      </div>
    </article>
  );
}
