export const CATEGORIES = [
  "ID Card",
  "Wallet",
  "Mobile/Device",
  "Books",
  "Keys",
  "Bag",
  "Earphones",
  "Water Bottle",
  "Accessories",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type ItemType = "LOST" | "FOUND";
export type ItemStatus = "ACTIVE" | "MATCHED" | "RETURNED";

export type Item = {
  id: string;
  item_name: string;
  category: string;
  description: string;
  location: string;
  date: string;
  type: ItemType;
  contact_name: string;
  contact_info: string;
  image_url: string | null;
  status: ItemStatus;
  created_at: string;
};

export type NewItem = Omit<Item, "id" | "created_at" | "status"> & {
  status?: ItemStatus;
};

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
