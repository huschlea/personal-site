import { notFound } from "next/navigation";
import Site, { type Tab } from "../Site";
import changelog from "../../content/changelog.json";
import "../v2.css";

const TAB_PATHS: Record<string, Tab> = {
  work: "work",
  music: "music",
  observations: "observations",
  changelog: "changelog",
  promptlog: "changelog",
};

export function generateStaticParams() {
  return Object.keys(TAB_PATHS).map((tab) => ({ tab }));
}

export default async function Page({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  const initialTab = TAB_PATHS[tab.toLowerCase()];
  if (!initialTab) notFound();
  return <Site changelog={changelog} initialTab={initialTab} />;
}
