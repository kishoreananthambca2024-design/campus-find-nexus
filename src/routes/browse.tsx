import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { itemsQueryOptions } from "@/lib/items-api";
import { CATEGORIES } from "@/lib/campusfind";
import { ItemCard } from "@/components/campus/ItemCard";
import { EmptyState, LoadingGrid, PageHeading } from "@/components/campus/Layout";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse Reported Items — CampusFind" },
      {
        name: "description",
        content:
          "Search and filter every lost and found item reported on campus by name, type, category and location.",
      },
      { property: "og:title", content: "Browse Reported Items — CampusFind" },
      {
        property: "og:description",
        content: "Search campus lost and found reports by name, category and location.",
      },
    ],
  }),
  component: BrowsePage,
});

const selectClass =
  "rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25";

function BrowsePage() {
  const { data: items, isLoading, isError, error } = useQuery(itemsQueryOptions);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [location, setLocation] = useState("ALL");
  const [sort, setSort] = useState("newest");

  const locations = useMemo(
    () => Array.from(new Set((items ?? []).map((item) => item.location))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = (items ?? []).filter((item) => {
      if (query && !item.item_name.toLowerCase().includes(query)) return false;
      if (type !== "ALL" && item.type !== type) return false;
      if (category !== "ALL" && item.category !== category) return false;
      if (location !== "ALL" && item.location !== location) return false;
      return true;
    });

    return list.sort((a, b) =>
      sort === "newest"
        ? b.created_at.localeCompare(a.created_at)
        : a.created_at.localeCompare(b.created_at),
    );
  }, [items, search, type, category, location, sort]);

  return (
    <div>
      <PageHeading
        title="Browse Items"
        subtitle="Every lost and found report submitted across campus."
      />

      <div className="surface-card mb-6 flex flex-col gap-3 p-4 md:flex-row md:flex-wrap md:items-center">
        <div className="relative flex-1 md:min-w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by item name…"
            aria-label="Search by item name"
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
          />
        </div>

        <select
          aria-label="Filter by type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All types</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>

        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All categories</option>
          {CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All locations</option>
          {locations.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort items"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={selectClass}
        >
          <option value="newest">Sort: Newest first</option>
          <option value="oldest">Sort: Oldest first</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingGrid />
      ) : isError ? (
        <EmptyState title="Could not load items" hint={(error as Error).message} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No items match your filters" hint="Try clearing the search or filters." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
