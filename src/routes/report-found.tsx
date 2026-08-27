import { createFileRoute } from "@tanstack/react-router";
import { ItemForm } from "@/components/campus/ItemForm";
import { PageHeading } from "@/components/campus/Layout";

export const Route = createFileRoute("/report-found")({
  head: () => ({
    meta: [
      { title: "Report a Found Item — CampusFind" },
      {
        name: "description",
        content:
          "Found something on campus? Log it on CampusFind so the owner can be matched and reunited with it.",
      },
      { property: "og:title", content: "Report a Found Item — CampusFind" },
      {
        property: "og:description",
        content: "Log an item you found on campus and help it get back to its owner.",
      },
    ],
  }),
  component: ReportFound,
});

function ReportFound() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading
        title="Report a Found Item"
        subtitle="Thanks for helping — describe what you found and where."
      />
      <ItemForm type="FOUND" />
    </div>
  );
}
