"use client";

import { useEffect, useRef } from "react";
import "lenis/dist/lenis.css";

/** Progressive enhancement: no server content is hidden and static routes never import this. */
export default function ScrollExperience() {
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let teardown: (() => void) | undefined;
    const root = progress.current?.closest<HTMLElement>(".theme");
    if (!root) return;

    async function setup() {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);
      if (disposed || !root) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const finePointer = window.matchMedia(
            "(min-width: 900px) and (pointer: fine)",
          );
          // Native touch scrolling and nested controls retain their browser behavior.
          const lenis = new Lenis({
            autoRaf: false,
            smoothWheel: finePointer.matches,
            syncTouch: false,
            lerp: 0.1,
            anchors: true,
            prevent: (node) =>
              Boolean(
                node.closest(
                  ".station-list, .table-scroll, .nav-dropdown, .mobile-nav nav, textarea",
                ),
              ),
          });
          const tick = (seconds: number) => lenis.raf(seconds * 1000);
          const onScroll = () => ScrollTrigger.update();
          const onPointerChange = () => {
            lenis.options.smoothWheel = finePointer.matches;
          };
          finePointer.addEventListener("change", onPointerChange);
          lenis.on("scroll", onScroll);
          gsap.ticker.add(tick);
          root.dataset.scrollExperience = "active";

          gsap.to(progress.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: true },
          });

          // Animate headings, not interactive card containers already controlled by pointer tilt.
          root
            .querySelectorAll<HTMLElement>(
              ".section-heading, .about > div, .responsibility-grid article",
            )
            .forEach((el) => {
              if (el.getBoundingClientRect().top < innerHeight * 0.85) return;
              gsap.fromTo(
                el,
                { y: 30, opacity: 0.25 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  ease: "power3.out",
                  scrollTrigger: { trigger: el, start: "top 92%", once: true },
                  clearProps: "transform,opacity",
                },
              );
            });
          const cards = root.querySelectorAll(
            ".tilt-card > svg, .tilt-card > h3",
          );
          if (cards.length)
            gsap.fromTo(
              cards,
              { y: 18, opacity: 0.3 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.065,
                duration: 0.65,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ".tilt-grid",
                  start: "top 85%",
                  once: true,
                },
                clearProps: "transform,opacity",
              },
            );

          const line = root.querySelector<SVGPathElement>(".pipeline path");
          if (line) {
            const length = line.getTotalLength();
            gsap.fromTo(
              line,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: ".pipeline",
                  start: "top 90%",
                  end: "top 45%",
                  scrub: 0.6,
                },
              },
            );
          }

          if (root.classList.contains("liquid-theme")) {
            const heroCopy = root.querySelectorAll(
              ".lp-hero-copy > .lp-kicker, .lp-hero-copy > h1, .lp-hero-copy > p, .lp-hero-copy > .lp-magnet",
            );
            gsap.fromTo(
              heroCopy,
              { y: 24, opacity: 0.45 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.11,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
            );
            const heroImage = root.querySelector(".lp-hero-image");
            if (heroImage) {
              gsap.fromTo(
                heroImage,
                { y: 22, opacity: 0.55 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1.2,
                  ease: "power3.out",
                  clearProps: "transform,opacity",
                },
              );
            }
            root.querySelectorAll<HTMLElement>(".lp-section-intro, .lp-node, .lp-card, .lp-purpose-layout").forEach((element) => {
              if (element.getBoundingClientRect().top < innerHeight * 0.88) return;
              gsap.fromTo(
                element,
                { y: 30, opacity: 0.55 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  ease: "power3.out",
                  clearProps: "transform,opacity",
                  scrollTrigger: { trigger: element, start: "top 91%", once: true },
                },
              );
            });
          }

          // Keep parallax off small/touch layouts, and never pin or trap the document.
          const desktop = gsap.matchMedia();
          desktop.add(
            "(min-width: 900px) and (pointer: fine)",
            () => {
              const hero = root.querySelector(
                ".immersive-hero, .editorial-hero",
              );
              if (!hero) return;
              const art = hero.querySelector(".editorial-art > img");
              if (art)
                gsap.to(art, {
                  y: 70,
                  scale: 1.045,
                  ease: "none",
                  scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.8,
                  },
                });
              if (root.classList.contains("liquid-theme")) {
                const image = root.querySelector(".lp-hero-image img");
                if (image)
                  gsap.to(image, {
                    scale: 1.045,
                    ease: "none",
                    scrollTrigger: {
                      trigger: ".lp-hero",
                      start: "top top",
                      end: "bottom top",
                      scrub: 0.7,
                    },
                  });
              }
            },
            root,
          );

          const resizeObserver = new ResizeObserver(() =>
            ScrollTrigger.refresh(),
          );
          const main = root.querySelector("main");
          if (main) resizeObserver.observe(main);
          ScrollTrigger.refresh();
          return () => {
            resizeObserver.disconnect();
            desktop.revert();
            finePointer.removeEventListener("change", onPointerChange);
            gsap.ticker.remove(tick);
            lenis.off("scroll", onScroll);
            lenis.destroy();
            delete root.dataset.scrollExperience;
          };
        },
        root,
      );
      teardown = () => media.revert();
    }
    // A failed optional enhancement must never prevent reading or navigating the page.
    setup().catch(() => {
      teardown?.();
    });
    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}
