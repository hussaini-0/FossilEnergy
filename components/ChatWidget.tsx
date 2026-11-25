"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import {
  REGIONS,
  TERMINAL_STATUS,
  formatDate,
  formatPrice,
  useDemoData,
  type DemoData,
} from "@/lib/demoStore";
import { company } from "@/data/fossilContent";

type Msg = { from: "bot" | "user"; text: string };

const QUICK = ["Fuel prices", "Find a station", "Storage terminals", "Become a partner", "Contact"];

/** Scripted replies for the design demo. Not connected to any AI service. */
function reply(input: string, d: DemoData): string {
  const t = input.toLowerCase();
  const region = REGIONS.find((r) => t.includes(r.toLowerCase()));
  if (/price|rate|petrol|diesel|pmg|hsd|cost/.test(t)) {
    const list = region ? [region] : REGIONS;
    return (
      list.map((r) => `${r}: PMG ${formatPrice(d.prices[r].pmg)} · HSD ${formatPrice(d.prices[r].hsd)}`).join("\n") +
      `\nPKR per litre, updated ${formatDate(d.pricesUpdated)}.`
    );
  }
  if (/station|near|location|where|pump/.test(t)) {
    const open = d.stations.filter((s) => (!region || s.province === region) && s.status === "open");
    const soon = d.stations.filter((s) => (!region || s.province === region) && s.status === "coming-soon");
    if (!open.length && !soon.length) return `I couldn't find stations${region ? ` in ${region}` : ""} yet.`;
    return (
      (open.length ? `Open now: ${open.map((s) => s.city).join(", ")}.` : "") +
      (soon.length ? ` Coming soon: ${soon.map((s) => s.city).join(", ")}.` : "") +
      " Use the station finder on this page for directions."
    );
  }
  if (/storage|terminal|depot/.test(t))
    return d.terminals.map((x) => `${x.name} (${x.city}): ${TERMINAL_STATUS[x.status]}`).join("\n");
  if (/partner|dealer|franchise|invest/.test(t))
    return "We work with partners on dealerships and franchises across three station layouts. Tap “Become a partner” in the header, or contact the partnership team.";
  if (/lpg|gas|cylinder/.test(t))
    return "Quick Gases supplies LPG for homes and businesses. See the LPG pages under Information for details.";
  if (/lubricant|oil|engine|clover/.test(t))
    return "Clover lubricants cover automotive and industrial needs. Browse the Lubricants pages for the full range.";
  if (/contact|phone|call|email|address/.test(t))
    return `Call ${company.phone} or email ${company.email}.\n${company.address}`;
  if (/^(hi|hello|salam|assalam|hey)/.test(t)) return "Hello! How can I help you today?";
  return "I can help with fuel prices, stations, storage terminals, partnerships, LPG and lubricants. Try one of the suggestions below.";
}

export default function ChatWidget() {
  const data = useDemoData();
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Assalam o Alaikum! I'm the Fossil assistant. Ask me about fuel prices, stations or partnerships." },
  ]);
  const log = useRef<HTMLDivElement>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  const send = (value: string) => {
    const v = value.trim();
    if (!v || typing) return;
    setMsgs((m) => [...m, { from: "user", text: v }]);
    setText("");
    setTyping(true);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: reply(v, dataRef.current) }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

  return (
    <div className={`chatw ${open ? "is-open" : ""}`}>
      {open && (
        <section className="chatw-panel" role="dialog" aria-label="Fossil assistant">
          <header>
            <span className="chatw-avatar">
              <Sparkles size={16} />
            </span>
            <div>
              <strong>Fossil Assistant</strong>
              <small>
                <i /> Preview · scripted replies
              </small>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </header>
          <div className="chatw-log" ref={log} aria-live="polite">
            {msgs.map((m, i) => (
              <p key={i} className={`chatw-msg ${m.from}`}>
                {m.text}
              </p>
            ))}
            {typing && (
              <p className="chatw-msg bot chatw-typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </p>
            )}
          </div>
          <div className="chatw-quick">
            {QUICK.map((q) => (
              <button type="button" key={q} onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            className="chatw-input"
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              aria-label="Message"
            />
            <button type="submit" aria-label="Send" disabled={!text.trim()}>
              <Send size={17} />
            </button>
          </form>
        </section>
      )}
      <button
        type="button"
        className="chatw-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with us"}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
