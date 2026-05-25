"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORD_DATA = [
  { word: "DRY", tag: "PRINCIPLE", desc: "Don't Repeat Yourself — write once, reuse everywhere" },
  { word: "SOLID", tag: "PRINCIPLE", desc: "Five design rules for robust object-oriented systems" },
  { word: "OOP", tag: "PARADIGM", desc: "Model complexity through objects, not procedures" },
  { word: "Linux", tag: "OS", desc: "The kernel that runs everything that matters" },
  { word: "Libre", tag: "PHILOSOPHY", desc: "Free as in freedom!" },
  { word: "Web", tag: "PLATFORM", desc: "The most accessible runtime ever built" },
  { word: "KISS", tag: "PRINCIPLE", desc: "Keep It Simple — complexity is a liability" },
  { word: "focused", tag: "QUALITY", desc: "One thing, done exceptionally well" },
  { word: "reliable", tag: "QUALITY", desc: "Works at 3am without waking anyone up" },
  { word: "maintainable", tag: "QUALITY", desc: "Written for the next engineer, not just the deadline" },
  { word: "modular", tag: "QUALITY", desc: "Composable pieces that survive requirement changes" },
  { word: "testable", tag: "QUALITY", desc: "If I can't test it, I don't trust it" },
  { word: "secure", tag: "PROPERTY", desc: "Security is a feature, not an afterthought" },
  { word: "minimal", tag: "PHILOSOPHY", desc: "No code is better than code you don't need" },
];

const TOTAL_SECTIONS = 5;

const STACK_GROUPS = [
  {
    label: "Languages",
    items: [

      { name: "Go", desc: "if err != nil" },
      { name: "Lisp", desc: "'The most powerful programming language is Lisp.' - R. Stallman" },
{ name: "C", desc: "'C makes it easy to shoot yourself in the foot.' - B. Stroustrup" },
      { name: "C++", desc: "'C++ makes it harder, but when you do it blows your whole leg off.' - B. Stroustrup" },
      { name: "PHP", desc: "Personal Home Page" },
      { name: "Bash", desc: "Duct tape of the unix world." },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Laravel", desc: "Batteries included!" },
      { name: "RESTful APIs", desc: "Zzz...😴" },
      {
        name: "SQLite",
        desc: "'Airbus confirms that SQLite is being used in the flight software for the A350 XWB family of aircraft.' - sqlite.org/famous.html",
      },
      { name: "Postgresql", desc: "The elephant in the room" },
      { name: "Redis", desc: "O(1)" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "Tailwind", desc: "Socially acceptable inline styles." },
      { name: "PicoCSS", desc: "For when you want CSS without developing a CSS personality." },
      { name: "AlpineJS", desc: "No, not the distro." },
    ],
  },
  {
    label: "Tools & Infra",
    items: [
      { name: "Git", desc: "lgtm." },
      { name: "Docker", desc: "'Works on my machine.' - now available on every machine." },
      { name: "Docker Compose", desc: "YAML-powered distributed confusion." },
      { name: "Linux", desc: "The kernel that runs everything that matters." },
      { name: "Doom Emacs", desc: "'An Emacs framework for the stubborn martian hacker' - Doom Emacs Github Repository" },
    ],
  },
];

const SECTION_IDS = ["hello", "tagline", "identity", "stack", "contact"];

const THEMES = [
  "light",
  "dark",
  "forest",
  "sepia",
  "ocean",
  "rose",
  "sand",
  "slate",
  "lavender",
  "amber",
  "mint",
];

const THEME_LABELS: Record<string, string> = {
  light: "●",
  dark: "○",
  sepia: "◐",
  forest: "◉",
  ocean: "◎",
  rose: "◇",
  sand: "◈",
  slate: "◆",
  lavender: "◑",
  amber: "◕",
  mint: "◍",
};

/* SVG icons — inline, no dependency */
const IconGithub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconMail = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const IconCopy = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f2efe9;
    --fg: #0c0c0c;
    --muted: #888;
    --faint: #d4d0c8;
    --font-display: 'Instrument Serif', Georgia, serif;
    --font-body: 'Instrument Sans', sans-serif;
    --pad: clamp(28px, 5vw, 64px);
  }

  [data-theme="dark"] {
    --bg: #0f0e0c;
    --fg: #f2efe9;
    --muted: #555;
    --faint: #1e1d1b;
  }

  [data-theme="sepia"] {
    --bg: #f5f0e8;
    --fg: #2c1810;
    --muted: #8b6f5e;
    --faint: #d4c4b0;
  }

  [data-theme="forest"] {
    --bg: #0d1f0f;
    --fg: #c8e6c9;
    --muted: #4a7c59;
    --faint: #1a3a1e;
  }

  [data-theme="ocean"] {
    --bg: #040d1a;
    --fg: #b8d4f0;
    --muted: #3a6b9a;
    --faint: #0a1e33;
  }

  [data-theme="rose"] {
    --bg: #1a0a0d;
    --fg: #f4c2cc;
    --muted: #8b4a57;
    --faint: #2e1218;
  }

  [data-theme="sand"] {
    --bg: #e8dcc8;
    --fg: #1a1208;
    --muted: #7a6a4a;
    --faint: #c8b898;
  }

  [data-theme="slate"] {
    --bg: #0e1218;
    --fg: #c8d4e0;
    --muted: #4a6070;
    --faint: #1a2030;
  }

  [data-theme="lavender"] {
    --bg: #f0eef8;
    --fg: #1a1030;
    --muted: #7a6090;
    --faint: #d0c8e8;
  }

  [data-theme="amber"] {
    --bg: #1a0f00;
    --fg: #f0c860;
    --muted: #806020;
    --faint: #2a1e00;
  }

  [data-theme="mint"] {
    --bg: #eaf6f2;
    --fg: #0a2018;
    --muted: #4a8068;
    --faint: #c0ddd4;
  }

  [data-theme="matrix"] {
    --bg: #000000;
    --fg: #39ff14;
    --muted: #1aff8a;
    --faint: #0b2f1a;
  }

  html { scroll-behavior: smooth; scroll-snap-type: y mandatory; }

  body {
    background: var(--bg);
    color: var(--fg);
    font-family: var(--font-body);
    overflow-x: hidden;
    transition: background 0.3s, color 0.3s;
  }

  ::-webkit-scrollbar { width: 1px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--fg); }

  section {
    height: 100vh;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    scroll-snap-align: start;
    overflow: hidden;
  }

  .scroll-progress {
    position: fixed;
    left: 0;
    top: 0;
    width: 2px;
    height: 100vh;
    z-index: 300;
    background: var(--faint);
  }

  .scroll-progress-fill {
    width: 100%;
    background: var(--fg);
    transition: height 0.15s ease;
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 22px var(--pad);
    gap: 24px;
  }

  .nav-links {
    display: flex;
    gap: 24px;
    list-style: none;
    align-items: center;
  }

  .nav-links a {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--fg);
    transition: color 0.15s;
  }
  .nav-links a:hover { color: var(--muted); }

  .theme-toggle {
    background: none;
    border: 1px solid var(--faint);
    cursor: pointer;
    color: var(--muted);
    width: 32px;
    height: 32px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: color 0.2s, border-color 0.2s;
    flex-shrink: 0;
  }
  .theme-toggle:hover { color: var(--fg); border-color: var(--fg); }

  .page-indicator {
    position: fixed;
    bottom: 32px;
    right: var(--pad);
    z-index: 200;
    font-family: var(--font-body);
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.12em;
    color: var(--muted);
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .page-indicator .current { color: var(--fg); font-weight: 500; }

  .datetime {
    position: fixed;
    bottom: 32px;
    left: var(--pad);
    z-index: 200;
    font-family: var(--font-body);
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--muted);
    opacity: 0.5;
    line-height: 1.6;
  }

  #hello { padding: 0 var(--pad); }

  .hello-word {
    font-family: var(--font-display);
    font-size: clamp(80px, 22vw, 350px);
    letter-spacing: -0.03em;
    color: var(--fg);
    user-select: none;
    line-height: 0.9;
  }

  .hello-period {
    display: inline-block;
    width: 0.15em;
    height: 0.15em;
    background: var(--fg);
    vertical-align: baseline;
    position: relative;
    margin-left: 0.05em;
    flex-shrink: 0;
  }

  @keyframes nudge {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(4px); }
  }

  #tagline {
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .tagline-inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 var(--pad);
    gap: 0;
  }

  .tagline-row-top {
    display: flex;
    align-items: flex-end;
    gap: 24px;
    flex-wrap: wrap;
  }

  .tagline-word {
    font-family: var(--font-display);
    font-size: clamp(48px, 12vw, 160px);
    font-weight: 400;
    letter-spacing: -0.03em;
    line-height: 0.9;
    color: var(--fg);
    font-style: italic;
    display: inline-block;
  }

  .tagline-software {
    font-family: var(--font-display);
    font-size: clamp(48px, 12vw, 160px);
    font-weight: 400;
    letter-spacing: -0.03em;
    line-height: 0.9;
    color: var(--muted);
    display: inline-block;
  }

  .tagline-annotation {
    margin-bottom: 0.18em;
    border-left: 1px solid var(--faint);
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 180px;
    max-width: 280px;
  }

  .tagline-controls {
    display: flex;
    align-items: center;
    gap: 0;
    margin-top: 28px;
  }

  .ctrl-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: color 0.15s;
    padding: 0;
  }
  .ctrl-btn:hover { color: var(--fg); }

  .ctrl-divider {
    width: 1px;
    height: 14px;
    background: var(--faint);
    margin: 0 2px;
  }

  .ctrl-counter {
    font-family: var(--font-body);
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--muted);
    margin-left: 12px;
  }

  #identity { padding: 0 var(--pad); }

  .identity-name {
    font-family: var(--font-display);
    font-size: clamp(48px, 11vw, 148px);
    font-weight: 400;
    letter-spacing: -0.03em;
    line-height: 0.88;
  }
  .identity-name span { display: block; }

  .identity-footnote {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-left: 1px solid var(--faint);
    padding-left: 20px;
    max-width: 340px;
  }

  .footnote-line {
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 0.04em;
    color: var(--muted);
    line-height: 1.5;
  }

  .footnote-line sup {
    font-size: 8px;
    letter-spacing: 0.1em;
    margin-right: 4px;
    color: var(--fg);
    opacity: 0.4;
  }

  #stack {
    padding: 80px var(--pad) 0;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
  }

  .stack-header {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 32px;
  }

  .stack-groups {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border-top: 1px solid var(--faint);
  }

  .stack-group {
    padding: 28px 0;
    border-bottom: 1px solid var(--faint);
  }
  .stack-group:nth-child(odd)  { padding-right: 40px; border-right: 1px solid var(--faint); }
  .stack-group:nth-child(even) { padding-left: 40px; }

  .stack-group-label {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 14px;
  }

  .stack-items { display: flex; flex-wrap: wrap; gap: 8px; }

  .stack-tag-wrap {
    position: relative;
  }

  .stack-tag {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--fg);
    border: 1px solid var(--faint);
    padding: 4px 12px;
    border-radius: 2px;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    cursor: default;
    display: block;
  }

  .stack-tag:hover {
    background: var(--fg);
    color: var(--bg);
    border-color: var(--fg);
  }

  .stack-tag-wrap:hover .stack-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    pointer-events: none;
  }

  .stack-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: var(--fg);
    color: var(--bg);
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 0.02em;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 2px;
    white-space: normal;
    width: max-content;
    max-width: 220px;
    opacity: 0;
    transition: opacity 0.15s, transform 0.15s;
    pointer-events: none;
    z-index: 100;
  }

  .stack-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: var(--fg);
  }

  #contact { padding: 0 var(--pad); }

  .contact-big {
    font-family: var(--font-display);
    font-size: clamp(40px, 10vw, 128px);
    font-weight: 400;
    letter-spacing: -0.03em;
    line-height: 0.88;
    font-style: italic;
  }

  .contact-email-row {
    margin-top: 36px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .contact-email {
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 0.04em;
    color: var(--muted);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: color 0.2s, border-color 0.2s;
  }

  .contact-email:hover {
    color: var(--fg);
    border-color: var(--fg);
  }

  .copy-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-body);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 0;
    transition: color 0.2s;
  }

  .copy-btn:hover { color: var(--fg); }
  .copy-btn.copied { color: var(--fg); }

  .contact-footnote {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-left: 1px solid var(--faint);
    padding-left: 20px;
    max-width: 320px;
  }

  @media (max-width: 640px) {
    .tagline-row-top { flex-direction: column; align-items: flex-start; gap: 16px; }
    .tagline-annotation { border-left: none; padding-left: 0; border-top: 1px solid var(--faint); padding-top: 12px; }
    .nav-links a span.nav-label { display: none; }
    .datetime { display: none; }
    .stack-groups { grid-template-columns: 1fr; }
    .stack-group:nth-child(odd) { border-right: none; padding-right: 0; }
    .stack-group:nth-child(even) { padding-left: 0; }
    .identity-footnote { margin-top: 20px; }
    .stack-tooltip { display: none; }
  }
`;

function useActivePage() {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const observers = SECTION_IDS.map((id, i) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setPage(i + 1);
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return page;
}

function useScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (scrolled / total) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return pct;
}

function useDateTime() {
  const [dt, setDt] = useState({ date: "", time: "" });

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const date = now.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const time = now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setDt({ date, time });
    };

    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  return dt;
}

function ScrollProgressBar() {
  const pct = useScrollProgress();
  return (
    <div className="scroll-progress">
      <div className="scroll-progress-fill" style={{ height: `${pct}%` }} />
    </div>
  );
}

function DateTime() {
  const { date, time } = useDateTime();
  return (
    <div className="datetime">
      <div>{date}</div>
      <div>{time}</div>
    </div>
  );
}

function PageIndicator({ page }: { page: number }) {
  return (
    <div className="page-indicator">
      <span>{TOTAL_SECTIONS}</span>
      <span style={{ width: 1, height: 20, background: "var(--faint)", display: "inline-block" }} />
      <span className="current">{String(page).padStart(2, "0")}</span>
      <span
        style={{
          width: 1,
          height: 20,
          background: "var(--faint)",
          display: "inline-block",
          marginTop: 8,
        }}
      />
      <span style={{ fontSize: 18, letterSpacing: "0.1em", color: "var(--muted)", opacity: 0.5 }}>k↑ j↓</span>
    </div>
  );
}

function NavBar({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return (
    <nav>
      <ul className="nav-links">
        <li>
          <a href="https://github.com/KrzysztofMarciniak" target="_blank" rel="noreferrer">
            <IconGithub />
            <span className="nav-label">GitHub</span>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/krzysztofmarciniakit/" target="_blank" rel="noreferrer">
            <IconLinkedIn />
            <span className="nav-label">LinkedIn</span>
          </a>
        </li>
        <li>
          <a href="mailto:to_be_added@">
            <IconMail />
            <span className="nav-label">Mail</span>
          </a>
        </li>
      </ul>
      <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme" title={theme}>
        {THEME_LABELS[theme]}
      </button>
    </nav>
  );
}

function HelloSection() {
  return (
    <section id="hello">
      <div className="hello-word">
        hello<span className="hello-period" />
      </div>
    </section>
  );
}

function TaglineSection() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % WORD_DATA.length);
    }, 1800);
  }, []);

  const stopCycle = useCallback(() => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    if (playing) startCycle();
    else stopCycle();
    return () => stopCycle();
  }, [playing, startCycle, stopCycle]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) stopCycle();
        else if (playing) startCycle();
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [playing, startCycle, stopCycle]);

  const prev = () => {
    stopCycle();
    setPlaying(false);
    setIndex((i) => (i - 1 + WORD_DATA.length) % WORD_DATA.length);
  };

  const next = () => {
    stopCycle();
    setPlaying(false);
    setIndex((i) => (i + 1) % WORD_DATA.length);
  };

  const togglePlay = () => setPlaying((p) => !p);

  const current = WORD_DATA[index];

  return (
    <section id="tagline" ref={ref as any}>
      <div className="tagline-inner">
        <div className="tagline-row-top">
          <div style={{ flexShrink: 0 }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={current.word}
                className="tagline-word"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {current.word}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="tagline-annotation">
            <AnimatePresence mode="wait">
              <motion.span
                key={current.tag}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                [ {current.tag} ]
              </motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.span
                key={current.desc}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(13px, 1.1vw, 17px)",
                  fontStyle: "italic",
                  color: "var(--fg)",
                  lineHeight: 1.4,
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                {current.desc}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <span className="tagline-software">software</span>

        <div className="tagline-controls">
          <button className="ctrl-btn" onClick={prev} aria-label="Previous">
            ←
          </button>
          <div className="ctrl-divider" />
          <button className="ctrl-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            {playing ? "⏸" : "⏵"}
          </button>
          <div className="ctrl-divider" />
          <button className="ctrl-btn" onClick={next} aria-label="Next">
            →
          </button>
          <span className="ctrl-counter">
            {String(index + 1).padStart(2, "0")} / {String(WORD_DATA.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

function IdentitySection() {
  return (
    <section id="identity">
      <div className="identity-name">
        <span>Krzysztof</span>
        <span>Marciniak</span>
      </div>
      <div className="identity-footnote">
        <p className="footnote-line">Software engineer based in Poland.</p>
        <p className="footnote-line">Focused on systems, the web, and things that last.</p>
      </div>
    </section>
  );
}

function StackTag({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="stack-tag-wrap">
      <span className="stack-tag">{name}</span>
      <div className="stack-tooltip">{desc}</div>
    </div>
  );
}

function StackSection() {
  return (
    <section id="stack">
      <p className="stack-header">Tech stack</p>
      <div className="stack-groups">
        {STACK_GROUPS.map((g) => (
          <div className="stack-group" key={g.label}>
            <p className="stack-group-label">{g.label}</p>
            <div className="stack-items">
              {g.items.map((item) => (
                <StackTag key={item.name} name={item.name} desc={item.desc} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button className={`copy-btn${copied ? " copied" : ""}`} onClick={copy} aria-label="Copy email">
      {copied ? <IconCheck /> : <IconCopy />}
      <span>{copied ? "copied" : "copy"}</span>
    </button>
  );
}

function ContactSection() {
  const EMAIL = "to_be_added@";
  return (
    <section id="contact">
      <div>
        <div className="contact-big">
          let&apos;s build
          <br />
          something.
        </div>
        <div className="contact-email-row">
          <a className="contact-email" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <CopyEmailButton email={EMAIL} />
        </div>
        <div className="contact-footnote">
          <p className="footnote-line">Response within one business day.</p>
          <p className="footnote-line">Available for contract and full-time opportunities.</p>
        </div>
      </div>
    </section>
  );
}

function useKeyNav() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = SECTION_IDS.findIndex((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= -window.innerHeight / 2 && rect.top < window.innerHeight / 2;
      });

      if (active === -1) return;

      let next = -1;
      if (e.key === "ArrowDown" || e.key === "j") next = Math.min(active + 1, SECTION_IDS.length - 1);
      if (e.key === "ArrowUp" || e.key === "k") next = Math.max(active - 1, 0);

      if (next !== -1 && next !== active) {
        e.preventDefault();
        document.getElementById(SECTION_IDS[next])?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}

export default function Portfolio() {
  const page = useActivePage();
  const [themeIndex, setThemeIndex] = useState(0);

  useKeyNav();

  useEffect(() => {
    console.clear();
    console.log(
      "%c👋 Hello from the source code!",
      "color: #39ff14; font-size: 20px; font-weight: bold; background: #000; padding: 8px;"
    );
    console.log(
      "%cTry calling runSecretMode() right here in the console.",
      "color: #1aff8a; font-style: italic;"
    );

    (window as any).runSecretMode = () => {
      document.documentElement.setAttribute("data-theme", "matrix");
      console.log("%cMatrix mode initiated.", "color: #39ff14; font-weight: bold;");
      return "🕶️ Done.";
    };

    return () => {
      if ((window as any).runSecretMode) {
        delete (window as any).runSecretMode;
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", THEMES[themeIndex]);
  }, [themeIndex]);

  return (
    <>
      <style>{style}</style>
      <ScrollProgressBar />
      <NavBar theme={THEMES[themeIndex]} onToggle={() => setThemeIndex((i) => (i + 1) % THEMES.length)} />
      <PageIndicator page={page} />
      <DateTime />
      <HelloSection />
      <TaglineSection />
      <IdentitySection />
      <StackSection />
      <ContactSection />
    </>
  );
}
