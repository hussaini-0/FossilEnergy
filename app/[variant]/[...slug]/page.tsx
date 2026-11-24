import { notFound } from "next/navigation";
import { contentPages } from "@/data/fossilContent";
import ContentPage from "@/components/ContentPage";
import type { Variant } from "@/components/Shell";
export const dynamicParams = false;
export function generateStaticParams() {
  return ["3d", "2d"].flatMap((variant) =>
    contentPages.map((p) => ({ variant, slug: p.slug.split("/") })),
  );
}
type Props = { params: Promise<{ variant: string; slug: string[] }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = contentPages.find((p) => p.slug === slug.join("/"));
  return {
    title: `${p?.title || "Information"} | Fossil Energy`,
    description: p?.intro,
  };
}
export default async function Page({ params }: Props) {
  const { variant, slug } = await params;
  const p = contentPages.find((p) => p.slug === slug.join("/"));
  if (!p || !["3d", "2d"].includes(variant)) notFound();
  return <ContentPage page={p} variant={variant as Variant} />;
}
