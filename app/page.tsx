import Site from "./Site";
import changelog from "../content/changelog.json";
import "./v2.css";

export default function Page() {
  return <Site changelog={changelog} />;
}
