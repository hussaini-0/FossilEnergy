"use client";
import MobileMenu from "@/components/MobileMenu";
import { SECTIONS, designHref, sectionHref, type Design, type Section } from "@/data/designs";

/** Top bar for the group site. Each tab opens its own page in the current design. */
export default function GroupHeader({
  design,
  current,
  className = "gp-header",
}: {
  design: Design;
  current?: Section;
  className?: string;
}) {
  const home = designHref(design);
  const links: [string, string][] = SECTIONS.map((s) => [s.label, sectionHref(design, s.id)]);
  return (
    <header className={className}>
      <a href={home} className="gp-logo" aria-label="Fossil Group home">
        <img src="/images/fossil-logo.png" alt="Fossil" width={118} height={38} />
        <span>GROUP</span>
      </a>
      <nav aria-label="Main navigation">
        {SECTIONS.map((s) => (
          <a key={s.id} href={sectionHref(design, s.id)} aria-current={current === s.id ? "page" : undefined}>
            {s.label}
          </a>
        ))}
      </nav>
      <a className="gp-header-cta" href={sectionHref(design, "fuel-finder")}>
        Fuel finder
      </a>
      <MobileMenu
        links={[["Home", home], ...links]}
        cta={{ label: "Find the right fuel", href: sectionHref(design, "fuel-finder") }}
      />
    </header>
  );
}
