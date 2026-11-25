# Fossil Energy — two presentation concepts

One Next.js App Router, TypeScript and Tailwind CSS project, exported as a static site. Company content lives in `data/` (`fossilContent.ts` for shared facts and links, `siteContent.ts` for the 35 information pages).

## Run locally

```sh
npm ci
npm run dev        # http://127.0.0.1:3000
```

Routes:

- `/`: **Fossil Group** home — full-screen panels with no page scroll (wheel, swipe, arrow keys, side dots): group intro with live prices, the four group companies (Fossil Energy, Clover Pakistan, CITA, Quick Gases), a fuel & oil finder for the visitor's car, region-wise prices synced from the (simulated) OGRA submission, a station map and contact.
- `/admin`: back office preview (frontend only) for stations, storage sites and fuel prices with a simulated "Submit to OGRA" flow. Data lives in the browser's localStorage and updates every page live.
- `/2d`: **Version 2** (Motion 2D) — photographic editorial landing with GSAP/Lenis scroll, Framer Motion pipeline, ecosystem cards, partner drawer, station finder and searchable information directory.
- `/3d`: **Version 1** (Cinematic) — dark landing with the WebGL "Traffic Wave" hero, tilt cards for the four business pillars, station finder and information directory.
- `/2d/<page>` and `/3d/<page>`: the 35 information pages in each theme.

Use the bottom-right "View version" switcher to compare the two concepts on the same page. Both landings share the same section anchors (`#stations`, `#explore`), the left quick-links rail, footer and switcher. All internal URLs are built by `pageHref()` in `data/fossilContent.ts`.

## Validation and delivery

```sh
npm run typecheck
npm run build
python scripts/verify-content.py   # needs: pip install beautifulsoup4
```

`verify-content.py` checks that every original fossilpk.com page (listed in `data/sourcePages.json`) has a route in both themes, and that every local link, image and `#anchor` in the export resolves.

The production build creates a portable static export in `out/`. Serve with a static server supporting clean `.html` URLs. Run `npm start` to serve the export locally on port 3000. All illustrations and PDFs are local and require no external asset service. Regenerate with `node scripts/generate-assets.mjs`.

## Content provenance / presentation limits

Brief: headline, products, affiliates, 800+ target, city coverage and requested contact details. The 800+ number is a vision, never an active outlet count. Station coordinates are city centres and are visibly labeled illustrative; directions do not claim to route to an operating forecourt.

Existing website consulted on 19 November 2026:

- https://fossilpk.com/ — company narrative, SAP implementation, plantation and village-road CSR examples.
- https://fossilpk.com/oil-storages/ — Mehmodkot and Gatti operational; Thaliyan equity partnership; Machike development. Shikarpur remains unverified and is labeled accordingly.
- https://fossilpk.com/contact-us/ — registered office.

Vision and mission wording is proposed, not quoted. CSR descriptions paraphrase published examples. Fuel labels do not constitute technical compliance claims. The PDFs are real downloadable placeholder files, visibly not official disclosures. SVG artwork is conceptual. The unmodified official logo is sourced from https://fossilpk.com/wp-content/uploads/2019/05/Fossil-logo-new.png. All three themes use its red (#FF141E), charcoal, and white, with darker red for readable text and buttons on light backgrounds.

For client launch, replace city-centre previews with approved station records, insert official PDFs and brand assets, approve copy, and measure 3D frame rate on the presentation device. DPR is capped at 1.5 and geometry is procedural, but 60fps is device-dependent.

## Expanded website content (20 November 2026)

The two themes each include 35 information pages (70 detail routes), in addition to their landing pages. All 32 successfully inventoried original detail pages have corresponding routes in each variant. The home content is represented by the landing pages, company overview, and news/CSR page. Navigation, the searchable information directory, and context-preserving variant links expose the expanded content.

Shared content entry point: `data/fossilContent.ts`; detailed sections: `data/siteContent.ts`; source catalog: `data/productCatalog.json` (20 Clover and 26 RTX product/pack entries); original assets and provenance: `data/sourceMedia.json` and `public/source-media/` (244 files, including nine distinct PDFs).

Validation: `npm run build` checks TypeScript and exports all pages. `python scripts/verify-content.py` checks original-page coverage and every local link/image target in the exported HTML. The audit scripts require Python and BeautifulSoup only for maintenance, not running the website.

Known source issues preserved for review:

- Leadership names and roles differ between the board and management pages.
- Corporate adviser/auditor/banker lists and Lahore/Rawalpindi addresses have multiple versions.
- Gatti's published total capacity differs from its product-capacity sum.
- Fuel prices are dated 30 July 2026; retail projections are historical 2020–2024 figures.
- A source link labeled OGRA CRP regulations points to a lubricant license PDF; the download is labeled accordingly.
- Thirty source media requests failed (mostly obsolete 2020 image URLs, plus timeouts). These are recorded in `output/source-audit/media-errors.json`; broken images are not rendered. The original source links remain accessible from each page.
- A malformed contact URL on the source returned 404 and is not reproduced.
- The station locator still uses the explicitly labeled city-centre preview from the original project brief; no verified station-address dataset was supplied.
- The contact form prepares a user-reviewed email draft; no backend submissions or fabricated success confirmations are used. The careers page does not invent job vacancies.

The original placeholder PDFs are no longer linked in the site; regulatory and safety resources now lead to the migrated original documents. `output/source-audit/` contains the raw inventory/cache for review and is intentionally ignored by Git. The curated content, the page list used by the verifier (`data/sourcePages.json`) and asset provenance are tracked under `data/`.

## Scroll enhancement (23 November 2026)

`components/ScrollExperience.tsx` progressively enhances only the 3D and 2D landing pages using dynamically loaded GSAP, ScrollTrigger, and Lenis. Framer Motion retains ownership of hero typography, tabs, and count-up text; GSAP owns section entrances, desktop artwork parallax, the SVG pipeline, and reading progress. No element is animated by both systems.

Lenis uses GSAP's ticker, preserves anchor links and nested scrolling, and leaves touch scrolling native. Effects are scoped and reverted on teardown or a live reduced-motion preference change; native content remains readable if optional imports fail. Detail routes do not import this component. React Bits was not added because there is no specific component requirement.

Verified in the production preview: wheel scrolling, station-anchor targeting, nested station-list scrolling, live reduced-motion cleanup/re-enable, static-route isolation, mobile overflow, build/type checking, and source-content coverage.

## Demo-prep fixes (24 November 2026)

- Removed the retired `/static` concept and the unused React Three Fiber scene (`SceneLoader`, `EnergyScene`) and unused motion components.
- Verifier updated for the two current themes; it no longer depends on the Git-ignored `output/` folder and now also checks in-page anchors.
- The 2D landing now includes the station finder, so "Find a station" links from every 2D page resolve. Both landing navs list the same sections.
- Pillar cards on the 3D landing link to their information pages (previously they jumped to the footer).
- Station finder keeps the map and list in agreement when a filter hides the selected city.
- Traffic Wave hero follows live changes to the reduced-motion setting and its props are typed.
- On phones the quick-links rail is a compact button instead of a full-height column covering the left edge.
- Footer phone numbers and the contact email come from `company` in `data/fossilContent.ts`.
