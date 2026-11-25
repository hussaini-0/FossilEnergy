"use client";
import { useState } from "react";
import { Car, Droplet, Fuel, Gauge, RotateCcw } from "lucide-react";
import { AGE_BANDS, MAKES, VEHICLES, recommend, type AgeBand, type Engine } from "@/lib/fuelAdvisor";
import { REGIONS, formatPrice, useDemoData, type Region } from "@/lib/demoStore";

const ENGINE_LABEL: Record<Engine, string> = {
  petrol: "Petrol",
  "turbo-petrol": "Turbo petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  bike: "Motorcycle",
};

export default function FuelAdvisor() {
  const { prices } = useDemoData();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [custom, setCustom] = useState(false);
  const [engine, setEngine] = useState<Engine>("petrol");
  const [age, setAge] = useState<AgeBand>("0–4 years");
  const [region, setRegion] = useState<Region>("Punjab");

  const models = VEHICLES.filter((v) => v.make === make);
  const vehicle = models.find((v) => v.model === model);
  const ready = custom || !!vehicle;
  const rec = ready ? recommend(custom ? engine : vehicle!.engine, age, custom ? undefined : vehicle!.note) : null;
  // Only PMG (RON 92) and HSD are in the published price list; premium grades are priced at the pump.
  const price = !rec ? null : rec.fuel.grade === "HSD" ? prices[region].hsd : rec.fuel.grade === "RON 92" ? prices[region].pmg : null;

  const reset = () => {
    setMake("");
    setModel("");
    setCustom(false);
  };

  return (
    <div className="gp-advisor">
      <form className="gp-adv-form" onSubmit={(e) => e.preventDefault()}>
        <div className="gp-adv-head">
          <Car size={18} /> Tell us about your vehicle
        </div>
        {!custom ? (
          <>
            <label className="gp-field">
              Make
              <select value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}>
                <option value="">Select make</option>
                {MAKES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="gp-field">
              Model
              <select value={model} disabled={!make} onChange={(e) => setModel(e.target.value)}>
                <option value="">{make ? "Select model" : "Choose a make first"}</option>
                {models.map((v) => (
                  <option key={v.model}>{v.model}</option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <label className="gp-field">
            Engine type
            <select value={engine} onChange={(e) => setEngine(e.target.value as Engine)}>
              {(Object.keys(ENGINE_LABEL) as Engine[]).map((k) => (
                <option key={k} value={k}>
                  {ENGINE_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="gp-field">
          Vehicle age
          <div className="gp-seg" role="group" aria-label="Vehicle age">
            {AGE_BANDS.map((a) => (
              <button type="button" key={a} aria-pressed={age === a} onClick={() => setAge(a)}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="gp-adv-links">
          <button type="button" onClick={() => setCustom((c) => !c)}>
            {custom ? "Pick from the list instead" : "Vehicle not listed?"}
          </button>
          {(make || custom) && (
            <button type="button" onClick={reset}>
              <RotateCcw size={13} /> Start again
            </button>
          )}
        </div>
      </form>

      <div className={`gp-adv-result ${rec ? "has-result" : ""}`} aria-live="polite">
        {!rec ? (
          <div className="gp-adv-empty">
            <Gauge size={34} />
            <strong>Your recommendation appears here</strong>
            <span>Choose a make and model, or describe your vehicle.</span>
          </div>
        ) : (
          <>
            <p className="gp-adv-for">
              For your {custom ? ENGINE_LABEL[engine].toLowerCase() + " vehicle" : `${make} ${model}`} · {age}
            </p>
            <div className="gp-rec">
              <span className="gp-rec-icon fuel">
                <Fuel size={18} />
              </span>
              <div>
                <small>Recommended fuel</small>
                <strong>
                  {rec.fuel.name} <em>{rec.fuel.grade}</em>
                </strong>
                <p>{rec.fuel.why}</p>
              </div>
              {price === null ? (
                <div className="gp-rec-price">
                  <b className="gp-rec-pump">Price at the pump</b>
                  <small>premium grade</small>
                </div>
              ) : (
              <div className="gp-rec-price">
                <select aria-label="Region for price" value={region} onChange={(e) => setRegion(e.target.value as Region)}>
                  {REGIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <b>Rs {formatPrice(price)}</b>
                <small>per litre</small>
              </div>
              )}
            </div>
            <div className="gp-rec">
              <span className="gp-rec-icon oil">
                <Droplet size={18} />
              </span>
              <div>
                <small>Recommended engine oil</small>
                <strong>
                  {rec.oil.name} <em>{rec.oil.grade}</em>
                </strong>
                <p>{rec.oil.why}</p>
              </div>
            </div>
            <ul className="gp-rec-tips">
              <li>
                <b>Oil change</b> {rec.interval}
              </li>
              {rec.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="gp-rec-note">General guidance: always follow your owner's manual.</p>
          </>
        )}
      </div>
    </div>
  );
}
