import type { Metadata } from "next";
import BackOffice from "@/components/admin/BackOffice";
import "./admin.css";

export const metadata: Metadata = {
  title: "Back office · Fossil Energy",
  description: "Design preview of the Fossil Energy content back office.",
};

export default function AdminPage() {
  return (
    <main id="main">
      <BackOffice />
    </main>
  );
}
