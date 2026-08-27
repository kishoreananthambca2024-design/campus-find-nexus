import { createFileRoute } from "@tanstack/react-router";
import { ItemForm } from "@/components/campus/ItemForm";
import { PageHeading } from "@/components/campus/Layout";

export const Route = createFileRoute("/report-lost")({
  head: () => ({
    meta: [
      { title: "Report a Lost Item — CampusFind" },
      {
        name: "description",
        content:
          "Report an item you lost on campus so CampusFind can match it against items other students have found.",
      },
      { property: "og:title", content: "Report a Lost Item — CampusFind" },
      {
        property: "og:description",
        content: "Lost something on campus? File a report and let CampusFind look for a match.",
      },
    ],
  }),
  component: ReportLost,
});

function ReportLost() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading
        title="Report a Lost Item"
        subtitle="Add as much detail as you can — it improves the chance of a match."
      />
      <ItemForm type="LOST" />
    </div>
  );
}
