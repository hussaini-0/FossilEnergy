"use client";
import { useState } from "react";
import { company } from "@/data/fossilContent";
export default function ContactInquiry() {
  const [prepared, setPrepared] = useState(false);
  return (
    <form
      className="inquiry"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\nAddress: ${data.get("address")}\n\n${data.get("message")}`)}`;
        setPrepared(true);
      }}
    >
      <h2>Start a conversation</h2>
      <p>
        This prepares a draft in your email application. It does not submit a
        message through this preview.
      </p>
      <label>
        Name
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Subject
        <input name="subject" required />
      </label>
      <label>
        Address
        <input name="address" autoComplete="street-address" />
      </label>
      <label>
        Message
        <textarea name="message" rows={5} required />
      </label>
      <button className="button primary" type="submit">
        Prepare email
      </button>
      {prepared && (
        <p role="status">
          Email draft requested. Review and send it in your mail app, or email
          {company.email} directly.
        </p>
      )}
    </form>
  );
}
