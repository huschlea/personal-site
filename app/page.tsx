import Site from "./Site";
import changelog from "../content/changelog.json";

export default function Page() {
  return <Site changelog={changelog} />;
}
