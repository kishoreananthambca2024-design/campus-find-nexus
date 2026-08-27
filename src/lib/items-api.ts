import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Item, ItemStatus, NewItem } from "./campusfind";

export const itemsQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: async (): Promise<Item[]> => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Item[];
  },
});

export async function createItem(item: NewItem): Promise<Item> {
  const { data, error } = await supabase.from("items").insert(item).select().single();
  if (error) throw new Error(error.message);
  return data as Item;
}

export async function updateItemStatus(ids: string[], status: ItemStatus): Promise<void> {
  const { error } = await supabase.from("items").update({ status }).in("id", ids);
  if (error) throw new Error(error.message);
}

export async function uploadItemImage(file: File): Promise<string> {
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("item-images").upload(path, file);
  if (error) throw new Error(error.message);
  return path;
}

export async function getItemImageUrl(path: string): Promise<string | null> {
  const { data } = await supabase.storage.from("item-images").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}
