import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/browse", label: "Browse Items" },
  { to: "/report-lost", label: "Report Lost" },
  { to: "/report-found", label: "Report Found" },
  { to: "/matches", label: "Matches" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand font-display text-lg font-bold text-brand-foreground">
            C
          </span>
          <span>
            <span className="block font-display text-lg font-bold leading-none">CampusFind</span>
            <span className="block text-[11px] text-muted-foreground">Lost &amp; Found</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "bg-brand text-brand-foreground" }}
              inactiveProps={{ className: "text-foreground/60 hover:bg-foreground/5" }}
              className="rounded-full px-4 py-2 text-sm font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-xl border border-border md:hidden"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-border bg-card px-5 py-3 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-brand" }}
              className="block rounded-lg px-2 py-2.5 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-6 text-center text-sm text-muted-foreground">
        CampusFind – Helping our campus find what matters.
      </div>
    </footer>
  );
}

export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      {subtitle ? <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="surface-card p-10 text-center">
      <p className="font-display text-lg font-bold">{title}</p>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="surface-card h-56 animate-pulse p-5" />
      ))}
    </div>
  );
}
