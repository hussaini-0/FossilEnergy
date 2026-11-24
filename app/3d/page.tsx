import ScrollExperience from "@/components/ScrollExperience";
import Image from "next/image";
import ContentDirectory from "@/components/ContentDirectory";
import { Footer, Switcher } from "@/components/Shell";
import { About, Metrics, Responsibility } from "@/components/Shared";
import { TiltPillars } from "@/components/MotionExperience";
import Locator from "@/components/Locator";
import { company, pageHref } from "@/data/fossilContent";
import TrafficWave from "@/components/TrafficWave";
import QuickLinksRail from "@/components/QuickLinksRail";
export default function Page() {
  return (
    <div className="theme immersive">
      <ScrollExperience />
      <header className="cinematic-header wrap">
        <a href={pageHref("3d")} aria-label="Fossil Energy home">
          <Image src="/images/fossil-logo.png" alt="Fossil — your energy partner" width={250} height={81} priority />
        </a>
        <nav aria-label="Main navigation">
          <a href={pageHref("3d")} aria-current="page">Home</a>
          <a href="#about">About</a>
          <a href="#operations">Operations</a>
          <a href="#stations">Stations</a>
          <a href="#explore">Information</a>
        </nav>
        <a className="cinematic-contact" href={pageHref("3d", "contact-us")}>Contact us <span aria-hidden="true">↗</span></a>
        <details className="cinematic-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href={pageHref("3d")}>Home</a><a href="#about">About</a><a href="#operations">Operations</a><a href="#stations">Stations</a><a href="#explore">Information</a><a href={pageHref("3d", "contact-us")}>Contact us</a>
          </nav>
        </details>
      </header>
      <QuickLinksRail variant="3d" />
      <main id="main">
        <section className="immersive-hero wrap">
          <div className="traffic-wave-visual">
            <TrafficWave
              leftLights={["#ee252e", "#d82029", "#ff694f"]}
              rightLights={["#f4f4f6", "#cdd6e3", "#fff4dc"]}
              stickColor="#e9e9ed"
              roadColor="#080a0f"
              lineColor="#b8bec8"
              fov={115}
              speed={8}
              glow={8}
              boostOn={false}
            />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">FOSSIL ENERGY / PAKISTAN</p>
            <h1>Fueling<br />Pakistan</h1>
            <p>{company.description}</p>
            <div className="hero-actions">
              <a className="button primary" href="#operations">Explore our business <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="hero-bottom">
            <span>SCROLL TO DISCOVER</span><span>RETAIL / STORAGE / LUBRICANTS / LPG</span>
          </div>
        </section>
        <Metrics />
        <About />
        <TiltPillars />
        <Locator />
        <Responsibility />
        <ContentDirectory variant="3d" />
      </main>
      <Footer variant="3d" />
      <Switcher variant="3d" />
    </div>
  );
}
