import type { Metadata } from "next";
import GroupPage from "@/components/group/GroupPage";
import { DESIGNS, SECTIONS, sectionTitle, type Design, type Section } from "@/data/designs";
import "../../../group.css";
import "../../../group-designs.css";
import "../../../group-wave.css";
import "../../../group-pages.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return DESIGNS.flatMap((d) => SECTIONS.map((s) => ({ design: d.id, section: s.id })));
}

type Props = { params: Promise<{ design: string; section: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: `${sectionTitle(section as Section)} | Fossil Group` };
}

export default async function Page({ params }: Props) {
  const { design, section } = await params;
  return <GroupPage design={design as Design} section={section as Section} />;
}
