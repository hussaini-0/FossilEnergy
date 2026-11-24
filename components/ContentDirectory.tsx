"use client";
import { useState } from "react";
import { contentGroups, contentPages, nestPages, pageHref } from "@/data/fossilContent";
import type { Variant } from "./Shell";
export default function ContentDirectory({ variant }: { variant: Variant }) {
  const [query, setQuery] = useState("");
  const matches = contentPages.filter((p) =>
    `${p.title} ${p.intro} ${p.group}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <section className="section wrap content-directory" id="explore">
      <div className="section-heading">
        <div>
          <p className="eyebrow">EXPLORE FOSSIL ENERGY</p>
          <h2>
            A complete view
            <br />
            of our business.
          </h2>
        </div>
        <label className="directory-search">
          Find information
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, people, terminals…"
          />
        </label>
      </div>
      <p className="result-count" role="status">
        {matches.length} information pages
      </p>
      <div className="directory-groups">
        {contentGroups.map((group) => {
          const pages = matches.filter((p) => p.group === group);
          return pages.length ? (
            <div key={group}>
              <h3>{group}</h3>
              {nestPages(pages).map(({ page: p, child }) => (
                <a
                  href={pageHref(variant, p.slug)}
                  key={p.slug}
                  className={child ? "directory-child" : undefined}
                >
                  {p.title}
                </a>
              ))}
            </div>
          ) : null;
        })}
      </div>
      {!matches.length && (
        <p>No pages match. Try “storage”, “LPG”, or “contact”.</p>
      )}
    </section>
  );
}
