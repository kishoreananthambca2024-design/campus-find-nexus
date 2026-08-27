import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import type { Item } from "@/lib/campusfind";
import { formatDate } from "@/lib/campusfind";
import { CategoryBadge, StatusBadge, TypeBadge } from "./StatusBadge";
import { ItemImage } from "./ItemImage";

export function ItemCard({ item }: { item: Item }) {
  return (
    <article className="surface-card flex flex-col p-5 transition hover:shadow-lift">
      <div className="flex items-center justify-between gap-2">
        <TypeBadge type={item.type} />
        <CategoryBadge category={item.category} />
      </div>

      <ItemImage path={item.image_url} alt={item.item_name} className="mt-4 aspect-video" />

      <h3 className="mt-3 text-lg font-bold">{item.item_name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden />
          {item.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3.5" aria-hidden />
          {formatDate(item.date)}
        </span>
        <StatusBadge status={item.status} />
      </div>

      <Link
        to="/items/$itemId"
        params={{ itemId: item.id }}
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-border py-2 text-sm font-medium transition hover:bg-foreground/5"
      >
        View Details
      </Link>
    </article>
  );
}
