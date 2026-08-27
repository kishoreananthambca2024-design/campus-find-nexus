import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { getItemImageUrl } from "@/lib/items-api";
import { cn } from "@/lib/utils";

export function ItemImage({
  path,
  alt,
  className,
}: {
  path: string | null;
  alt: string;
  className?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!path) {
      setUrl(null);
      return;
    }
    getItemImageUrl(path)
      .then((signed) => {
        if (active) setUrl(signed);
      })
      .catch(() => {
        if (active) setUrl(null);
      });
    return () => {
      active = false;
    };
  }, [path]);

  if (!path) return null;

  return (
    <div className={cn("overflow-hidden rounded-xl bg-muted", className)}>
      {url ? (
        <img src={url} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon className="size-5 text-muted-foreground" aria-hidden />
        </div>
      )}
    </div>
  );
}
