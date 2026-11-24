import { Footer, Header } from "@/components/Shell";
import { pageHref } from "@/data/fossilContent";

export default function NotFound() {
  return (
    <div className="theme editorial detail-page">
      <Header variant="2d" />
      <main id="main">
        <div className="wrap detail-hero">
          <p className="eyebrow">Page not found</p>
          <h1>This page isn’t on the map.</h1>
          <p className="detail-intro">
            The link may be out of date. Continue from one of the presentation
            home pages or search all information.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={pageHref("2d")}>
              Motion 2D home
            </a>
            <a className="button secondary" href={pageHref("3d")}>
              Cinematic home
            </a>
            <a className="button secondary" href={pageHref("2d", undefined, "explore")}>
              Search all information
            </a>
          </div>
        </div>
      </main>
      <Footer variant="2d" />
    </div>
  );
}
