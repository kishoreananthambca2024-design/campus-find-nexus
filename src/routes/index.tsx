import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemsQueryOptions, updateItemStatus } from "@/lib/items-api";
import { findMatches, type Match } from "@/lib/matching";
import { ItemCard } from "@/components/campus/ItemCard";
import { MatchCard } from "@/components/campus/MatchCard";
import { EmptyState, LoadingGrid } from "@/components/campus/Layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusFind Dashboard — Campus Lost & Found" },
      {
        name: "description",
        content:
          "Track lost items, found items, possible matches and returned belongings across campus in one dashboard.",
      },
      { property: "og:title", content: "CampusFind Dashboard — Campus Lost & Found" },
      {
        property: "og:description",
        content: "Find it. Report it. Return it. Live campus lost and found statistics.",
      },
    ],
  }),
  component: Dashboard,
});

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function Dashboard() {
  const queryClient = useQueryClient();
  const { data: items, isLoading, isError, error } = useQuery(itemsQueryOptions);

  const matches = useMemo(() => findMatches(items ?? []), [items]);

  const stats = useMemo(() => {
    const all = items ?? [];
    return {
      lost: all.filter((item) => item.type === "LOST" && item.status !== "RETURNED").length,
      found: all.filter((item) => item.type === "FOUND" && item.status !== "RETURNED").length,
      matches: matches.length,
      returned: all.filter((item) => item.status === "RETURNED").length,
    };
  }, [items, matches]);

  const markReturned = useMutation({
    mutationFn: (match: Match) => updateItemStatus([match.lost.id, match.found.id], "RETURNED"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: itemsQueryOptions.queryKey });
      toast.success("Marked as returned", { description: "Dashboard statistics have updated." });
    },
    onError: (err: Error) => toast.error("Could not update the items", { description: err.message }),
  });

  const recent = (items ?? []).slice(0, 3);
  const topMatch = matches[0];

  return (
    <div>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-3xl bg-gradient-brand p-8 text-brand-foreground shadow-lift">
          <span className="inline-block rounded-full bg-brand-foreground/15 px-3 py-1 text-xs font-medium tracking-wide">
            Campus Lost &amp; Found System
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight">
            Find it. Report it. Return it.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-brand-foreground/80">
            One central platform connecting students who lost belongings with those who found them,
            across the whole campus.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/report-lost"
              className="rounded-xl bg-card px-5 py-3 text-sm font-semibold text-brand"
            >
              Report Lost Item
            </Link>
            <Link
              to="/report-found"
              className="rounded-xl bg-brand-foreground/15 px-5 py-3 text-sm font-semibold ring-1 ring-brand-foreground/30"
            >
              Report Found Item
            </Link>
            <Link
              to="/browse"
              className="rounded-xl px-5 py-3 text-sm font-semibold text-brand-foreground/90 transition hover:bg-brand-foreground/10"
            >
              Browse Items
            </Link>
          </div>
        </div>

        {topMatch ? (
          <MatchCard
            match={topMatch}
            onMarkReturned={(match) => markReturned.mutate(match)}
            isPending={markReturned.isPending}
          />
        ) : (
          <EmptyState
            title="No possible matches yet"
            hint="Matches appear automatically when a lost and a found report look alike."
          />
        )}
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total Lost Items" value={stats.lost} tone="text-lost" />
        <Stat label="Total Found Items" value={stats.found} tone="text-found" />
        <Stat label="Possible Matches" value={stats.matches} tone="text-gold" />
        <Stat label="Items Returned" value={stats.returned} tone="text-brand" />
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Recent Reports</h2>
            <p className="text-sm text-muted-foreground">
              Latest lost and found submissions across campus
            </p>
          </div>
          <Link to="/browse" className="text-sm font-semibold text-brand hover:underline">
            View all →
          </Link>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <LoadingGrid count={3} />
          ) : isError ? (
            <EmptyState title="Could not load reports" hint={(error as Error).message} />
          ) : recent.length === 0 ? (
            <EmptyState title="No reports yet" hint="Be the first to report a lost or found item." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
