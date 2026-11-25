import type { Metadata } from "next";
import GroupSite from "@/components/group/GroupSite";
import "./group.css";
import "./group-designs.css";
import "./group-wave.css";
import "./group-ignition.css";

export const metadata: Metadata = {
  title: "Fossil Group | Fuel, lubricants & LPG for Pakistan",
  description:
    "Fossil Group: Fossil Energy, Clover Pakistan, CITA and Quick Gases. Live fuel prices, a fuel and oil finder, and station locations.",
};

export default function Page() {
  return <GroupSite />;
}
