import type { Metadata } from "next";
import GroupSite from "@/components/group/GroupSite";
import { DESIGNS, type Design } from "@/data/designs";
import "../../group.css";
import "../../group-designs.css";
import "../../group-wave.css";
import "../../group-ignition.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return DESIGNS.map((d) => ({ design: d.id }));
}

export const metadata: Metadata = {
  title: "Fossil Group | Fuel, lubricants & LPG for Pakistan",
  description: "Fossil Group design variant.",
};

export default async function Page({ params }: { params: Promise<{ design: string }> }) {
  const { design } = await params;
  return <GroupSite design={design as Design} />;
}
