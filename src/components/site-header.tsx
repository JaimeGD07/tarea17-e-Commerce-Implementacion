import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-bg/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="size-2.5 rounded-[2px] bg-amber shadow-[0_0_10px_var(--color-amber)]"
          />
          Kodigo Tech
        </Link>
        <nav aria-label="Principal">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted transition-colors hover:text-text"
              >
                Catálogo
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
