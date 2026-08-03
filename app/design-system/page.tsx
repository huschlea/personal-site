import type { Metadata } from "next";
import { Chooser } from "./Chooser";
import "./design-system.css";
import "./story/story.css";

export const metadata: Metadata = {
  title: "Design OS · Alden Huschle",
  description: "brand-os: a brand, operated in code.",
};

export default function Page() {
  return <Chooser />;
}
