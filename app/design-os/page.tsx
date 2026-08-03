import type { Metadata } from "next";
import { Chooser } from "./Chooser";
import "./design-system.css";
import "./story/story.css";

export const metadata: Metadata = {
  title: "Design OS · Alden Huschle",
  description: "A living system that codifies what the brand knows, how it speaks, the machinery it employs, and the laws that keep it uniform and distinct.",
};

export default function Page() {
  return <Chooser />;
}
