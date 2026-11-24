"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Fuel, Warehouse, Droplets, Flame } from "lucide-react";
import { pageHref, pillars } from "@/data/fossilContent";
const icons = [Fuel, Warehouse, Droplets, Flame];
export function TiltPillars() {
  const reduce = useReducedMotion();
  return (
    <section id="operations" className="section wrap">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CONNECTED BY ENERGY</p>
          <h2>
            Four pillars.
            <br />
            Infinite potential.
          </h2>
        </div>
        <p>
          A complete energy ecosystem.
          <br />
          Built around Pakistan’s progress.
        </p>
      </div>
      <div className="tilt-grid">
        {pillars.map((p, i) => {
          const Icon = icons[i];
          return (
            <motion.article
              key={p.id}
              className="tilt-card"
              onPointerMove={(e) => {
                if (reduce || e.pointerType !== "mouse") return;
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.transform = `perspective(900px) rotateX(${-(e.clientY - r.top - r.height / 2) / 40}deg) rotateY(${(e.clientX - r.left - r.width / 2) / 40}deg)`;
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = "none";
              }}
            >
              <Icon size={30} />
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="product-tags">
                {p.products.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
              <a href={pageHref("3d", p.slug)}>Explore {p.short.toLowerCase()}</a>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
