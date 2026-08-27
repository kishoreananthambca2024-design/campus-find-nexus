import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { CATEGORIES, type ItemType } from "@/lib/campusfind";
import { createItem, itemsQueryOptions, uploadItemImage } from "@/lib/items-api";
import { cn } from "@/lib/utils";

const schema = z.object({
  item_name: z.string().trim().min(2, "Item name is required").max(100),
  category: z.string().trim().min(1, "Please choose a category"),
  description: z.string().trim().min(5, "Please add a short description").max(1000),
  location: z.string().trim().min(2, "Location is required").max(120),
  date: z.string().trim().min(1, "Date is required"),
  contact_name: z.string().trim().min(2, "Contact name is required").max(100),
  contact_info: z.string().trim().min(5, "Email or phone number is required").max(160),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-medium text-destructive">{error}</span> : null}
    </label>
  );
}

export function ItemForm({ type }: { type: ItemType }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async (form: FormData) => {
      const values = {
        item_name: String(form.get("item_name") ?? ""),
        category: String(form.get("category") ?? ""),
        description: String(form.get("description") ?? ""),
        location: String(form.get("location") ?? ""),
        date: String(form.get("date") ?? ""),
        contact_name: String(form.get("contact_name") ?? ""),
        contact_info: String(form.get("contact_info") ?? ""),
      };

      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        const next: Errors = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as keyof Errors;
          if (!next[key]) next[key] = issue.message;
        }
        setErrors(next);
        throw new Error("VALIDATION");
      }
      setErrors({});

      const image_url = file ? await uploadItemImage(file) : null;
      return createItem({ ...parsed.data, type, image_url });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: itemsQueryOptions.queryKey });
      toast.success(
        type === "LOST" ? "Lost item reported successfully" : "Found item reported successfully",
        { description: "CampusFind is checking for possible matches." },
      );
      navigate({ to: "/browse" });
    },
    onError: (error: Error) => {
      if (error.message === "VALIDATION") {
        toast.error("Please fix the highlighted fields");
        return;
      }
      toast.error("Could not save the report", { description: error.message });
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(new FormData(event.currentTarget));
      }}
      className="surface-card space-y-5 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Item Name" error={errors.item_name}>
          <input name="item_name" placeholder="Black wallet" className={fieldClass} />
        </Field>
        <Field label="Category" error={errors.category}>
          <select name="category" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          rows={4}
          placeholder="Colour, brand, distinguishing marks…"
          className={cn(fieldClass, "resize-y")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={type === "LOST" ? "Location Lost" : "Location Found"} error={errors.location}>
          <input name="location" placeholder="CS Block" className={fieldClass} />
        </Field>
        <Field label={type === "LOST" ? "Date Lost" : "Date Found"} error={errors.date}>
          <input type="date" name="date" className={fieldClass} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Contact Name" error={errors.contact_name}>
          <input name="contact_name" placeholder="Your name" className={fieldClass} />
        </Field>
        <Field label="Contact Information" error={errors.contact_info}>
          <input name="contact_info" placeholder="Email or phone number" className={fieldClass} />
        </Field>
      </div>

      <Field label="Photo (optional)">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className={cn(fieldClass, "file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-xs file:font-medium")}
        />
      </Field>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-60"
      >
        {mutation.isPending
          ? "Submitting…"
          : type === "LOST"
            ? "Submit Lost Report"
            : "Submit Found Report"}
      </button>
    </form>
  );
}
