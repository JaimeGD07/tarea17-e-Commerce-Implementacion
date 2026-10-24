import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">Tienda Kodigo</h1>
      <p className="mt-2 text-neutral-500">
        Proyecto base listo (Fases 0 y 1). El catálogo llega en la Fase 2.
      </p>
      <Link href="/estado" className="mt-6 inline-block underline">
        Ver estado de la API
      </Link>
    </main>
  );
}
