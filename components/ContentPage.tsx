import {
  contentPages,
  contentGroups,
  pageHref,
  type ContentPage as PageData,
} from "@/data/fossilContent";
import mediaData from "@/data/sourceMedia.json";
import catalogs from "@/data/productCatalog.json";
import { Header, Footer, Switcher, type Variant } from "./Shell";
import ContactInquiry from "./ContactInquiry";
import ChatWidget from "./ChatWidget";
import QuickLinksRail from "./QuickLinksRail";
type Asset = {
  url: string;
  local: string;
  alt?: string;
  label?: string;
  downloadError?: string;
};
const media = mediaData as Record<
  string,
  { images: Asset[]; documents: Asset[] }
>;
export default function ContentPage({
  page,
  variant,
}: {
  page: PageData;
  variant: Variant;
}) {
  const assets = media[page.mediaKey || page.slug];
  const images =
    page.slug === "privacy-policy"
      ? []
      : (assets?.images || []).filter((a) => !a.downloadError);
  const documents = (assets?.documents || []).filter((a) => !a.downloadError);
  const products = catalogs[page.slug as keyof typeof catalogs];
  const related = contentPages.filter(
    (p) => p.group === page.group && p.slug !== page.slug,
  );
  const source = page.source || `https://fossilpk.com/${page.slug}/`;
  return (
    <div
      className={`theme ${variant === "3d" ? "immersive" : "editorial"} detail-page`}
    >
      <Header variant={variant} />
      <QuickLinksRail variant={variant} />
      <main id="main">
        <div className="wrap detail-hero">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href={pageHref(variant)}>Home</a>
            <span>/</span>
            <a href={pageHref(variant, undefined, "explore")}>{page.group}</a>
          </nav>
          <p className="eyebrow">{page.group}</p>
          <h1>{page.title}</h1>
          <p className="detail-intro">{page.intro}</p>
        </div>
        <div className="wrap detail-layout">
          <aside className="page-index">
            <p className="eyebrow">ON THIS PAGE</p>
            {page.sections.map((s, i) => (
              <a key={i} href={`#section-${i}`}>
                {s.title}
              </a>
            ))}
            {products && <a href="#catalog">Product catalog</a>}
            {documents.length > 0 && <a href="#documents">Downloads</a>}
            {images.length > 0 && <a href="#gallery">Gallery & references</a>}
          </aside>
          <article className="detail-body">
            {page.note && (
              <div className="source-notice">
                <strong>Published information note</strong>
                <p>{page.note}</p>
              </div>
            )}
            {page.sections.map((s, i) => (
              <section id={`section-${i}`} className="content-section" key={i}>
                <h2>{s.title}</h2>
                {s.paragraphs?.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {s.items && (
                  <ul>
                    {s.items.map((x, j) => (
                      <li key={j}>{x}</li>
                    ))}
                  </ul>
                )}
                {s.rows && (
                  <div
                    className="table-scroll"
                    tabIndex={0}
                    role="region"
                    aria-label={s.title}
                  >
                    <table>
                      <caption>{s.title}</caption>
                      <thead>
                        <tr>
                          {s.columns?.map((c) => (
                            <th key={c} scope="col">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.rows.map((r, j) => (
                          <tr key={j}>
                            {r.map((v, k) =>
                              k === 0 ? (
                                <th scope="row" key={k}>
                                  {v}
                                </th>
                              ) : (
                                <td key={k}>
                                  {/^[\w.+-]+@[\w.-]+$/.test(v) ? (
                                    <a href={`mailto:${v}`}>{v}</a>
                                  ) : (
                                    v
                                  )}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
            {products && (
              <section className="content-section" id="catalog">
                <h2>Complete published product catalog</h2>
                <p>
                  {products.length} product / pack combinations. Grades and
                  packaging are preserved as published; confirm availability
                  with the commercial team.
                </p>
                <div
                  className="table-scroll"
                  tabIndex={0}
                  role="region"
                  aria-label="Product catalog"
                >
                  <table>
                    <caption>
                      Published product names, grades, and packaging
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Grade / product</th>
                        <th scope="col">Packaging</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((r, i) => (
                        <tr key={i}>
                          {r.map((v, k) =>
                            k === 0 ? (
                              <th key={k} scope="row">
                                {v}
                              </th>
                            ) : (
                              <td key={k}>{v}</td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
            {documents.length > 0 && (
              <section id="documents" className="content-section">
                <h2>Original documents</h2>
                <div className="resource-list">
                  {documents.map((a, i) => (
                    <a
                      key={i}
                      href={a.local}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {page.slug === "ogra-crs" &&
                      a.label?.includes("Regulations")
                        ? "Lubricant license — mislabeled “CRP Regulations” on source"
                        : a.label}
                      <span>Open original PDF</span>
                    </a>
                  ))}
                </div>
              </section>
            )}
            {page.slug === "clover-pakistan-limited" && (
              <a
                className="button primary"
                href="https://www.clover.com.pk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Clover Pakistan
              </a>
            )}
            {page.slug === "rtx-lubricants" && (
              <a
                className="button secondary"
                href="https://rtxlubricants.com/product.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit RTX product website
              </a>
            )}
            {images.length > 0 && (
              <section id="gallery" className="content-section">
                <h2>Gallery & source references</h2>
                <p>
                  Original diagrams, photographs, and product references. Select
                  an image to inspect it at full size.
                </p>
                <div className="source-gallery">
                  {images.slice(0, 6).map((a, i) => (
                    <a
                      key={i}
                      href={a.local}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={a.local}
                        alt={a.alt || `${page.title} reference ${i + 1}`}
                        loading="lazy"
                        width={640}
                        height={420}
                      />
                    </a>
                  ))}
                </div>
                {images.length > 6 && (
                  <details className="more-gallery">
                    <summary>
                      View {images.length - 6} more images and references
                    </summary>
                    <div className="source-gallery">
                      {images.slice(6).map((a, i) => (
                        <a
                          key={i}
                          href={a.local}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={a.local}
                            alt={a.alt || `${page.title} reference ${i + 7}`}
                            loading="lazy"
                            width={640}
                            height={420}
                          />
                        </a>
                      ))}
                    </div>
                  </details>
                )}
              </section>
            )}
            {page.slug === "contact-us" && <ContactInquiry />}
            {page.slug === "careers" && (
              <a href={pageHref(variant, "contact-us")} className="button primary">
                Enquire about opportunities
              </a>
            )}
            <p className="source-citation">
              Adapted from{" "}
              <a href={source} target="_blank" rel="noopener noreferrer">
                Fossil Energy’s published website
              </a>
              . Source inventory: 19 November 2026. Historical data and source
              inconsistencies are labeled where applicable.
            </p>
          </article>
        </div>
        <section className="wrap related-pages section">
          <p className="eyebrow">CONTINUE EXPLORING</p>
          <h2>More from {page.group.toLowerCase()}.</h2>
          <div>
            {related.map((p) => (
              <a key={p.slug} href={pageHref(variant, p.slug)}>
                {p.title}
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer variant={variant} />
      <Switcher variant={variant} slug={page.slug} />
      <ChatWidget />
    </div>
  );
}
