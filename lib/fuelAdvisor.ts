/**
 * Fuel & oil advisor (design demo).
 *
 * A small catalogue of vehicles common in Pakistan plus a rule engine that
 * also handles vehicles not in the list. Recommendations are general guidance
 * and always defer to the owner's manual.
 */

export type Engine = "petrol" | "turbo-petrol" | "diesel" | "hybrid" | "bike";
export type Vehicle = { make: string; model: string; engine: Engine; cc: number; note?: string };

export const VEHICLES: Vehicle[] = [
  { make: "Suzuki", model: "Alto 660cc", engine: "petrol", cc: 660 },
  { make: "Suzuki", model: "Cultus 1.0", engine: "petrol", cc: 1000 },
  { make: "Suzuki", model: "Wagon R 1.0", engine: "petrol", cc: 1000 },
  { make: "Suzuki", model: "Swift 1.2", engine: "petrol", cc: 1200 },
  { make: "Suzuki", model: "Mehran 800cc", engine: "petrol", cc: 800, note: "Older carburettor-era engine" },
  { make: "Suzuki", model: "Bolan / Ravi 800cc", engine: "petrol", cc: 800, note: "Older engine, often high mileage" },
  { make: "Toyota", model: "Corolla 1.6 / 1.8", engine: "petrol", cc: 1800 },
  { make: "Toyota", model: "Yaris 1.3 / 1.5", engine: "petrol", cc: 1500 },
  { make: "Toyota", model: "Prius Hybrid 1.8", engine: "hybrid", cc: 1800 },
  { make: "Toyota", model: "Fortuner 2.8 Diesel", engine: "diesel", cc: 2800 },
  { make: "Toyota", model: "Hilux Revo 2.8 Diesel", engine: "diesel", cc: 2800 },
  { make: "Honda", model: "City 1.2 / 1.5", engine: "petrol", cc: 1500 },
  { make: "Honda", model: "Civic 1.5 Turbo", engine: "turbo-petrol", cc: 1500 },
  { make: "Honda", model: "BR-V 1.5", engine: "petrol", cc: 1500 },
  { make: "Honda", model: "HR-V e:HEV", engine: "hybrid", cc: 1500 },
  { make: "Kia", model: "Picanto 1.0", engine: "petrol", cc: 1000 },
  { make: "Kia", model: "Sportage 2.0", engine: "petrol", cc: 2000 },
  { make: "Kia", model: "Stonic 1.4", engine: "petrol", cc: 1400 },
  { make: "Hyundai", model: "Tucson 2.0", engine: "petrol", cc: 2000 },
  { make: "Hyundai", model: "Elantra 2.0", engine: "petrol", cc: 2000 },
  { make: "Hyundai", model: "Sonata 2.5", engine: "petrol", cc: 2500 },
  { make: "MG", model: "HS 1.5 Turbo", engine: "turbo-petrol", cc: 1500 },
  { make: "Haval", model: "H6 1.5 Turbo", engine: "turbo-petrol", cc: 1500 },
  { make: "Changan", model: "Alsvin 1.5", engine: "petrol", cc: 1500 },
  { make: "Changan", model: "Karvaan 1.0", engine: "petrol", cc: 1000 },
  { make: "Honda", model: "CD 70 (motorcycle)", engine: "bike", cc: 70 },
  { make: "Honda", model: "CG 125 (motorcycle)", engine: "bike", cc: 125 },
  { make: "Yamaha", model: "YBR 125 (motorcycle)", engine: "bike", cc: 125 },
];

export const MAKES = [...new Set(VEHICLES.map((v) => v.make))].sort();

export type Recommendation = {
  fuel: { name: string; grade: string; why: string };
  oil: { name: string; grade: string; brand: string; why: string };
  interval: string;
  tips: string[];
};

/** Age bands used for oil viscosity: newer engines have tighter tolerances. */
export const AGE_BANDS = ["0–4 years", "5–10 years", "Over 10 years"] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export function recommend(engine: Engine, age: AgeBand, note?: string): Recommendation {
  const old = age === "Over 10 years" || !!note;
  if (engine === "diesel")
    return {
      fuel: { name: "Primo Diesel", grade: "HSD", why: "Diesel engine: use high-speed diesel only." },
      oil: {
        name: "Rotex CI-4",
        grade: "15W-40",
        brand: "RTX",
        why: old
          ? "A robust diesel grade that suits older and harder-working engines."
          : "Modern common-rail diesels need a CI-4 or better diesel oil.",
      },
      interval: "Every 5,000–7,500 km",
      tips: ["Replace the fuel filter at every second service.", "Let the engine idle briefly after heavy towing."],
    };
  if (engine === "bike")
    return {
      fuel: { name: "Optimo 92", grade: "RON 92", why: "Small air-cooled engines are designed for regular petrol." },
      oil: {
        name: old ? "RTX Nova SG/CD" : "RTX Gamma SL/CF",
        grade: old ? "20W-50" : "10W-40",
        brand: "RTX",
        why: "A 4-stroke motorcycle oil that protects the shared engine and clutch.",
      },
      interval: "Every 1,000–1,500 km",
      tips: ["Check the oil level every week.", "Keep the chain clean and lubricated."],
    };
  const turbo = engine === "turbo-petrol";
  const fuel = turbo
    ? { name: "Octo 97", grade: "RON 97", why: "Turbocharged engines run best on high-octane fuel, which resists knocking under boost." }
    : { name: "Optimo 92", grade: "RON 92", why: "Your engine is designed for regular-octane petrol, so a higher grade adds cost without benefit." };
  const oil = old
    ? { name: "RTX Bianchi SN", grade: "10W-40", brand: "RTX", why: "A slightly thicker oil helps older engines hold pressure and reduce oil use." }
    : engine === "hybrid" || age === "0–4 years"
      ? { name: "RTX Bianchi SN", grade: "0W-20", brand: "RTX", why: "Low-viscosity oil flows instantly on start-up, important for modern and hybrid engines." }
      : { name: "RTX Bianchi SN", grade: "5W-30", brand: "RTX", why: "A versatile grade for petrol engines in Pakistan's climate." };
  return {
    fuel,
    oil,
    interval: turbo ? "Every 5,000 km" : old ? "Every 3,000–5,000 km" : "Every 5,000–7,000 km",
    tips: [
      turbo ? "Let the engine idle for 30 seconds before switching off after a hard drive." : "Keep tyres at the recommended pressure to save fuel.",
      engine === "hybrid" ? "Hybrids start and stop often, so keep to the oil-change schedule." : "Replace the air filter every 10,000 km in dusty conditions.",
    ],
  };
}
