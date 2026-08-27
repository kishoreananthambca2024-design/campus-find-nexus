import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemsQueryOptions, updateItemStatus } from "@/lib/items-api";
import { findMatches, type Match } from "@/lib/matching";
import { MatchCard } from "@/components/campus/MatchCard";
import { EmptyState, LoadingGrid, PageHeading } from "@/components/campus/Layout";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Possible Matches — CampusFind" },
      {
        name: "description",
        content:
          "CampusFind compares lost and found reports by name, category and location to surface possible matches with a match score.",
      },
      { property: "og:title", content: "Possible Matches — CampusFind" },
      {
        property: "og:description",
        content: "See lost and found reports paired automatically with a match score and reasons.",
      },
    ],
  }),
  component: MatchesPage,
});

function MatchesPage() {
  const queryClient = useQueryClient();
  const { data: items, isLoading, isError, error } = useQuery(itemsQueryOptions);
  const matches = useMemo(() => findMatches(items ?? []), [items]);

  const markReturned = useMutation({
    mutationFn: (match: Match) => updateItemStatus([match.lost.id, match.found.id], "RETURNED"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: itemsQueryOptions.queryKey });
      toast.success("Marked as returned", { description: "Both reports are now closed." });
    },
    onError: (err: Error) => toast.error("Could not update the items", { description: err.message }),
  });

  return (
    <div>
      <PageHeading
        title="Possible Matches"
        subtitle="Lost and found reports paired by category, item name and location."
      />

      {isLoading ? (
        <LoadingGrid count={2} />
      ) : isError ? (
        <EmptyState title="Could not load matches" hint={(error as Error).message} />
      ) : matches.length === 0 ? (
        <EmptyState
          title="No possible matches right now"
          hint="As soon as a lost report resembles a found report, it will show up here."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              compact
              onMarkReturned={(value) => markReturned.mutate(value)}
              isPending={markReturned.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
