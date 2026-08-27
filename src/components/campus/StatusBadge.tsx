import { cn } from "@/lib/utils";
import type { Item } from "@/lib/campusfind";

export function TypeBadge({ type, className }: { type: Item["type"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        type === "LOST" ? "bg-lost-soft text-lost" : "bg-found-soft text-found",
        className,
      )}
    >
      {type}
    </span>
  );
}

const STATUS_LABEL: Record<Item["status"], string> = {
  ACTIVE: "Active",
  MATCHED: "Possible Match",
  RETURNED: "Returned",
};

export function StatusBadge({ status, className }: { status: Item["status"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        status === "RETURNED"
          ? "bg-returned-soft text-returned"
          : status === "MATCHED"
            ? "bg-gold/20 text-gold-foreground"
            : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-foreground/5 px-2.5 py-1 text-[11px] font-medium text-foreground/60">
      {category}
    </span>
  );
}
