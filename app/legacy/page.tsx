import Site from "./Site";
import changelog from "../../content/changelog.json";

export default function LegacyPage() {
  return <Site changelog={changelog} />;
}
