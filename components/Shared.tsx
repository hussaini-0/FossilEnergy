import { company, governance, metrics } from "@/data/fossilContent";
import { ShieldCheck, HeartHandshake, Leaf } from "lucide-react";
export function Metrics() {
  return (
    <div className="metrics wrap">
      {metrics.map((m) => (
        <div key={m.label}>
          <strong>{m.value}</strong>
          <span>{m.label}</span>
          <small>{m.detail}</small>
        </div>
      ))}
    </div>
  );
}
export function About() {
  return (
    <section id="about" className="section wrap about">
      <p className="eyebrow">OUR PURPOSE</p>
      <div>
        <h2>
          One nation.
          <br />
          Endless possibilities.
        </h2>
        <p>{company.vision}</p>
        <p>{company.mission}</p>
      </div>
      <div className="purpose-note">
        <span>BUILT FOR THE ROAD AHEAD</span>
        <p>
          An integrated energy group.
          <br />A shared ambition for Pakistan.
        </p>
        <div className="group-brands">
          CLOVER <span>QUICK GASES</span> mercato
        </div>
      </div>
    </section>
  );
}
export function Responsibility() {
  const icons = [ShieldCheck, HeartHandshake, Leaf];
  return (
    <section id="responsibility" className="responsibility section">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PROGRESS WITH PURPOSE</p>
            <h2>
              Energy comes
              <br />
              with responsibility.
            </h2>
          </div>
          <p>
            Stronger foundations.
            <br />A more thoughtful way forward.
          </p>
        </div>
        <div className="responsibility-grid">
          {governance.map((g, i) => {
            const Icon = icons[i];
            return (
              <article key={g.title}>
                <Icon size={28} />
                <h3>{g.title}</h3>
                <p>{g.description}</p>
              </article>
            );
          })}
        </div>
        <small className="content-note">
          Vision, mission, and CSR information are adapted from fossilpk.com;
          final content is subject to approval.
        </small>
      </div>
    </section>
  );
}
