import type { Metadata } from "next";
import GroupPage from "@/components/group/GroupPage";
import { sectionTitle } from "@/data/designs";
import "../group.css";
import "../group-designs.css";
import "../group-wave.css";
import "../group-pages.css";

export const metadata: Metadata = { title: `${sectionTitle("prices")} | Fossil Group` };

export default function Page() {
  return <GroupPage design="a" section="prices" />;
}
