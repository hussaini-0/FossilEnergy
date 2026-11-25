import { MapPin, Phone, LayoutDashboard } from "lucide-react";
import MobileMenu from "./MobileMenu";
import {
  company,
  contentGroups,
  contentPages,
  nestPages,
  pageHref,
  variants,
  versionName,
  type Variant,
} from "@/data/fossilContent";
export type { Variant };
export function Header({ variant = "3d" }: { variant?: Variant }) {
  return (
    <header className="header wrap">
      <a href={pageHref(variant)} aria-label="Fossil Energy home" className="brand">
        <img
          className="official-logo"
          src="/images/fossil-logo.png"
          alt="Fossil — your energy partner"
          width="250"
          height="81"
        />
      </a>
      <nav aria-label="Main navigation" className="expanded-nav">
        {contentGroups.map((group) => (
          <details key={group}>
            <summary>{group}</summary>
            <div className="nav-dropdown">
              {nestPages(contentPages.filter((p) => p.group === group))
                .map(({ page: p, child }) => (
                  <a key={p.slug} href={pageHref(variant, p.slug)} className={child ? "nav-child" : undefined}>
                    {p.title}
                  </a>
                ))}
            </div>
          </details>
        ))}
      </nav>
      <a className="header-cta" href={pageHref(variant, undefined, "stations")}>
        <MapPin size={16} /> Find a station
      </a>
      <MobileMenu
        variant={variant}
        links={[
          ["Home", pageHref(variant)],
          ["Find a station", pageHref(variant, undefined, "stations")],
          ["Search all information", pageHref(variant, undefined, "explore")],
          ["Contact us", pageHref(variant, "contact-us")],
        ]}
        groups={contentGroups.map((group) => ({
          title: group,
          links: nestPages(contentPages.filter((p) => p.group === group)).map(({ page: p, child }) => ({
            label: p.title,
            href: pageHref(variant, p.slug),
            child,
          })),
        }))}
      />
    </header>
  );
}
export function Switcher({
  variant,
  slug,
}: {
  variant: Variant;
  slug?: string;
}) {
  return (
    <aside className="switcher" aria-label="Presentation switcher">
      <span>VIEW VERSION</span>
      <div>
        <a href="/" className="switcher-group" title="Fossil Group home">
          Group
        </a>
        {variants.map((v) => (
          <a
            key={v}
            href={pageHref(v, slug)}
            aria-current={variant === v ? "page" : undefined}
          >
            {versionName(v)}
          </a>
        ))}
        <a href="/admin" className="switcher-admin" title="Back office preview">
          <LayoutDashboard size={14} aria-hidden="true" />
          <span>Back office</span>
        </a>
      </div>
    </aside>
  );
}
export function Footer({ variant = "3d" }: { variant?: Variant }) {
  return (
    <footer id="contact">
      <div className="wrap footer-grid">
        <div>
          <div className="footer-brand">
            <img
              className="official-logo"
              src="/images/fossil-logo.png"
              alt="Fossil — your energy partner"
              width="250"
              height="81"
            />
          </div>
          <p>Moving forward. Together.</p>
          <small>{company.legalName}</small>
        </div>
        <div>
          <h3>Let’s power what’s next.</h3>
          <address>{company.address}</address>
          {company.phones.map((p) => (
            <a className="phone" href={p.href} key={p.href}>
              <Phone size={16} />
              {p.label}
            </a>
          ))}
        </div>
        <div>
          <h3>Explore</h3>
          <a href={pageHref(variant, undefined, "explore")}>Explore all information</a>
          <a href={pageHref(variant, undefined, "stations")}>Station finder</a>
          <a href={pageHref(variant, "health-safety-environment")}>
            Health, safety & environment
          </a>
          <a href={pageHref(variant, "contact-us")}>Contact us</a>
          <a href={pageHref(variant, "careers")}>Careers</a>
          <a href={pageHref(variant, "privacy-policy")}>Privacy policy</a>
          <a href={pageHref(variant, "terms-and-conditions")}>Terms & conditions</a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} Fossil Energy (Private) Limited
        </span>
        <span>Design presentation · Content subject to approval</span>
      </div>
    </footer>
  );
}
