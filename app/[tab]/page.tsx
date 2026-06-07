import { notFound, redirect } from "next/navigation";
import Site, { type Tab } from "../Site";
import changelog from "../../content/changelog.json";
import "../v2.css";

const TAB_PATHS: Record<string, Tab> = {
  design: "design",
  music: "music",
  observations: "observations",
  changelog: "changelog",
  promptlog: "changelog",
  portal: "portal",
  "client-portal": "portal",
};

export function generateStaticParams() {
  return [...Object.keys(TAB_PATHS), "work"].map((tab) => ({ tab }));
}

export default async function Page({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  const normalizedTab = tab.toLowerCase();
  if (normalizedTab === "work") redirect("/design");
  const initialTab = TAB_PATHS[normalizedTab];
  if (!initialTab) notFound();
  return <Site changelog={changelog} initialTab={initialTab} />;
}
