import { Check, Bell, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Match } from "@/lib/matching";
import { formatDate } from "@/lib/campusfind";
import { TypeBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

function Side({ item }: { item: Match["lost"] }) {
  return (
    <div className="flex-1 rounded-xl border border-border bg-background p-4">
      <TypeBadge type={item.type} />
      <p className="mt-2 font-display text-sm font-bold">{item.item_name}</p>
      <p className="text-xs text-muted-foreground">
        {item.category} · {item.location}
      </p>
      <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
    </div>
  );
}

export function MatchCard({
  match,
  onMarkReturned,
  isPending,
  compact,
}: {
  match: Match;
  onMarkReturned: (match: Match) => void;
  isPending?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold">
          <Bell className="size-4 text-gold" aria-hidden />
          Possible Match Found
        </h2>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
            match.label === "Strong Match"
              ? "bg-found-soft text-found"
              : match.label === "Possible Match"
                ? "bg-gold/20 text-gold-foreground"
                : "bg-muted text-muted-foreground",
          )}
        >
          {match.label}
        </span>
      </div>

      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <Side item={match.lost} />
        <span className="mx-auto grid size-10 shrink-0 place-items-center rounded-full bg-gold text-sm font-bold text-gold-foreground">
          {match.score}
        </span>
        <Side item={match.found} />
      </div>

      <ul className="mt-4 space-y-1 text-xs text-foreground/70">
        {match.reasons.map((reason) => (
          <li key={reason} className="flex items-center gap-1.5">
            <Check className="size-3.5 text-found" aria-hidden />
            {reason}
          </li>
        ))}
      </ul>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-foreground/5">
        <div className="h-full rounded-full bg-gold" style={{ width: `${match.score}%` }} />
      </div>
      <p className="mt-1 text-right text-xs font-semibold text-muted-foreground">
        Match Score · {match.score}%
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => onMarkReturned(match)}
          disabled={isPending}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-60"
        >
          {isPending ? "Updating…" : "Mark as Returned"}
        </button>
        {!compact && (
          <Link
            to="/matches"
            className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-border py-3 text-sm font-semibold transition hover:bg-foreground/5 sm:w-auto sm:px-5"
          >
            All matches <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
