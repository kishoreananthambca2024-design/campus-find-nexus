import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, MapPin, User, Phone, ArrowLeft } from "lucide-react";
import { itemsQueryOptions, updateItemStatus } from "@/lib/items-api";
import { matchesForItem, type Match } from "@/lib/matching";
import { formatDate } from "@/lib/campusfind";
import { CategoryBadge, StatusBadge, TypeBadge } from "@/components/campus/StatusBadge";
import { ItemImage } from "@/components/campus/ItemImage";
import { MatchCard } from "@/components/campus/MatchCard";
import { EmptyState } from "@/components/campus/Layout";

export const Route = createFileRoute("/items/$itemId")({
  head: () => ({
    meta: [
      { title: "Item Details — CampusFind" },
      {
        name: "description",
        content:
          "Full details of a reported campus item, including contact information and any possible matches.",
      },
      { property: "og:title", content: "Item Details — CampusFind" },
      {
        property: "og:description",
        content: "View a reported campus item, its status and possible matches.",
      },
    ],
  }),
  component: ItemDetails,
});

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function ItemDetails() {
  const { itemId } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: items, isLoading, isError, error } = useQuery(itemsQueryOptions);

  const item = (items ?? []).find((entry) => entry.id === itemId);
  const matches = useMemo(
    () => (item ? matchesForItem(item, items ?? []) : []),
    [item, items],
  );

  const markReturned = useMutation({
    mutationFn: (ids: string[]) => updateItemStatus(ids, "RETURNED"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: itemsQueryOptions.queryKey });
      toast.success("Marked as returned");
    },
    onError: (err: Error) => toast.error("Could not update the item", { description: err.message }),
  });

  if (isLoading) {
    return <div className="surface-card h-72 animate-pulse" />;
  }

  if (isError) {
    return <EmptyState title="Could not load this item" hint={(error as Error).message} />;
  }

  if (!item) {
    return <EmptyState title="Item not found" hint="This report may have been removed." />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/browse"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to browse
      </Link>

      <div className="surface-card mt-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={item.type} />
          <CategoryBadge category={item.category} />
          <StatusBadge status={item.status} />
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold">{item.item_name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>

        <ItemImage
          path={item.image_url}
          alt={item.item_name}
          className="mt-5 aspect-video max-w-md"
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail
            icon={<MapPin className="size-3.5" aria-hidden />}
            label={item.type === "LOST" ? "Location Lost" : "Location Found"}
            value={item.location}
          />
          <Detail
            icon={<CalendarDays className="size-3.5" aria-hidden />}
            label={item.type === "LOST" ? "Date Lost" : "Date Found"}
            value={formatDate(item.date)}
          />
          <Detail
            icon={<User className="size-3.5" aria-hidden />}
            label="Contact Name"
            value={item.contact_name}
          />
          <Detail
            icon={<Phone className="size-3.5" aria-hidden />}
            label="Contact Information"
            value={item.contact_info}
          />
        </div>

        {item.status !== "RETURNED" ? (
          <button
            type="button"
            onClick={() => markReturned.mutate([item.id])}
            disabled={markReturned.isPending}
            className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-60 sm:w-auto sm:px-6"
          >
            {markReturned.isPending ? "Updating…" : "Mark as Returned"}
          </button>
        ) : null}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold">Possible Matches</h2>
        <div className="mt-4 grid gap-6">
          {matches.length === 0 ? (
            <EmptyState
              title="No possible matches for this item yet"
              hint="CampusFind keeps checking every time a new report is filed."
            />
          ) : (
            matches.map((match: Match) => (
              <MatchCard
                key={match.id}
                match={match}
                compact
                onMarkReturned={(value) => markReturned.mutate([value.lost.id, value.found.id])}
                isPending={markReturned.isPending}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
