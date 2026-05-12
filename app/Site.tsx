"use client";

import { useEffect, useRef, useState } from "react";
import { ResponseJournalSandbox } from "../components/ResponseJournalSandbox";
import { HumanAgentSandbox } from "../components/HumanAgentSandbox";

export type Tab = "home" | "work" | "music" | "observations" | "changelog";

const PATH_TO_TAB: Record<string, Tab> = {
  "": "home",
  "home": "home",
  "work": "work",
  "music": "music",
  "observations": "observations",
  "changelog": "changelog",
  "promptlog": "changelog",
};

export default function Site({ changelog, initialTab = "home" }: { changelog: string[]; initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const mountedRef = useRef(false);

  // Path-based tab routing (with legacy hash fallback)
  useEffect(() => {
    const hash = window.location.hash.slice(1).toLowerCase();
    if (hash && PATH_TO_TAB[hash]) {
      const target = PATH_TO_TAB[hash];
      setTab(target);
      history.replaceState(null, "", target === "home" ? "/" : `/${target}`);
    }
    const readPath = () => {
      const segment = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "");
      const next = PATH_TO_TAB[segment];
      if (next) setTab(next);
    };
    window.addEventListener("popstate", readPath);
    return () => window.removeEventListener("popstate", readPath);
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
    const desiredPath = tab === "home" ? "/" : `/${tab}`;
    if (currentPath !== desiredPath) {
      history.pushState(null, "", desiredPath);
    }
    window.scrollTo({ top: 0 });
  }, [tab]);

  // Image fade-in on load
  useEffect(() => {
    const markLoaded = (img: HTMLImageElement) => img.classList.add("v2-loaded");
    document.querySelectorAll<HTMLImageElement>(".site-v2 .v2-img").forEach((img) => {
      if (img.complete && img.naturalWidth > 0) markLoaded(img);
      else {
        img.addEventListener("load", () => markLoaded(img), { once: true });
        img.addEventListener("error", () => markLoaded(img), { once: true });
      }
    });
  }, [tab]);

  return (
    <div className="site site-v2">
      <nav className="v2-tabs">
        <button
          className={`v2-tab v2-tab-name ${tab === "home" ? "v2-tab-active" : ""}`}
          onClick={() => setTab("home")}
        >
          Alden Huschle
        </button>
        <button
          className={`v2-tab ${tab === "work" ? "v2-tab-active" : ""}`}
          onClick={() => setTab("work")}
        >
          Work
        </button>
        <button
          className={`v2-tab ${tab === "music" ? "v2-tab-active" : ""}`}
          onClick={() => setTab("music")}
        >
          Music
        </button>
        <span className="v2-tab-group">
          <button
            className={`v2-tab ${tab === "observations" ? "v2-tab-active" : ""}`}
            onClick={() => setTab("observations")}
          >
            Observations
          </button>
          <button
            className={`v2-tab ${tab === "changelog" ? "v2-tab-active" : ""}`}
            onClick={() => setTab("changelog")}
          >
            Changelog
          </button>
        </span>
      </nav>

      {/* ─── HOME ─── */}
      {tab === "home" && (
        <section className="v2-panel v2-panel-home">
          <div className="v2-prose">
            <p>
              Lately I&apos;ve been building{" "}
              <a
                href="/work"
                className="v2-link"
                onClick={(e) => {
                  e.preventDefault();
                  setTab("work");
                }}
              >Prompting People</a>, designing for{" "}
              <a href="https://numberone.ai/" target="_blank" rel="noopener" className="v2-link">NumberOne AI</a>, recording{" "}
              <a href="https://untitled.stream/library/project/vb44xdBFQh4WQ15UdPJmX" target="_blank" rel="noopener" className="v2-link">an album</a>, and{" "}
              <a
                href="/observations"
                className="v2-link"
                onClick={(e) => {
                  e.preventDefault();
                  setTab("observations");
                }}
              >observing things</a> along the way.
            </p>
            <p>
              I grew up in Snoqualmie, WA and currently live in Long Beach, CA.
            </p>
          </div>

          <div className="v2-footer-links">
            <a href="mailto:alden@aldenhuschle.com">Email</a>
            <span className="v2-footer-sep"> / </span>
            <a href="https://www.instagram.com/aldenhuschle/" target="_blank" rel="noopener">IG</a>
            <span className="v2-footer-sep"> / </span>
            <a href="https://x.com/aldenhuschle" target="_blank" rel="noopener">X</a>
          </div>

          <div className="v2-feature-image">
            <picture>
              <source type="image/avif" srcSet="/optimized/home-feature-800.avif 800w, /optimized/home-feature-1600.avif 1600w, /optimized/home-feature-2500.avif 2500w" sizes="(max-width: 768px) 100vw, 620px" />
              <source type="image/webp" srcSet="/optimized/home-feature-800.webp 800w, /optimized/home-feature-1600.webp 1600w, /optimized/home-feature-2500.webp 2500w" sizes="(max-width: 768px) 100vw, 620px" />
              <img className="v2-img" src="/home-feature.jpg" alt="" width={3024} height={1684} loading="eager" decoding="async" />
            </picture>
          </div>
        </section>
      )}

      {/* ─── WORK ─── */}
      {tab === "work" && (
        <section className="v2-panel v2-panel-work">
          <div className="v2-section">
            <h2 className="v2-section-title">Prompting People</h2>
            <p className="v2-section-kicker">Side project</p>
            <p className="v2-section-body">
              Most social products are built around ephemerality. Click and scroll until you (maybe) find something interesting, move on. Prompting People is built around the opposite instinct: sitting still as a feature, not a flaw.
            </p>
            <p className="v2-section-body">
              The core mechanic is simple. One prompt at a time. Written by humans for humans. You write your response before you can read anyone else&apos;s. The feed only opens after you&apos;ve contributed something unique to you.
            </p>
            <p className="v2-section-body v2-aside">
              In the final stages of development.
            </p>
            <div style={{ marginTop: "clamp(1.5rem, 3vw, 2rem)" }}>
              <ResponseJournalSandbox />
            </div>
          </div>

          <div className="v2-section">
            <h2 className="v2-section-title">WethosAI</h2>
            <p className="v2-section-kicker">NumberOne AI company</p>
            <p className="v2-section-body">
              WethosAI is one of the companies incubated inside NumberOne AI. I lead brand, website, and marketing design. An AI-forward identity built from scratch, shipped with emerging tools so the surface area of the work can move as fast as the product.
            </p>
            <p className="v2-section-body v2-release-links">
              <a href="https://wethos.ai/" target="_blank" rel="noopener" className="v2-link">Live at wethos.ai →</a>
            </p>
            <div style={{ marginTop: "clamp(0.5rem, 1.2vw, 1rem)" }}>
              <HumanAgentSandbox />
            </div>
          </div>
        </section>
      )}

      {/* ─── MUSIC ─── */}
      {tab === "music" && (
        <section className="v2-panel v2-panel-music">
          <div className="v2-section v2-music-release">
            <a href="https://untitled.stream/library/project/vb44xdBFQh4WQ15UdPJmX" target="_blank" rel="noopener" className="v2-cover v2-cover-placeholder" aria-label="album-01_wip-unmixed">
              <svg className="v2-cover-placeholder-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden="true">
                <circle cx="50" cy="50" r="45" fill="currentColor" fillOpacity="0.05" stroke="none" />
                <circle cx="50" cy="50" r="45" strokeOpacity="0.11" strokeWidth="0.35" />
                <circle cx="50" cy="50" r="43.5" strokeOpacity="0.035" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="42" strokeOpacity="0.03" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="40.4" strokeOpacity="0.05" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="38.8" strokeOpacity="0.03" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="37.2" strokeOpacity="0.055" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="35.4" strokeOpacity="0.035" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="33.6" strokeOpacity="0.055" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="31.8" strokeOpacity="0.03" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="30" strokeOpacity="0.05" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="28.2" strokeOpacity="0.03" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="26.4" strokeOpacity="0.055" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="24.6" strokeOpacity="0.035" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="22.8" strokeOpacity="0.055" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="21" strokeOpacity="0.03" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="19.3" strokeOpacity="0.05" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="17.7" strokeOpacity="0.035" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="16.3" strokeOpacity="0.095" strokeWidth="0.275" />
                <circle cx="50" cy="50" r="15.2" strokeOpacity="0.04" strokeWidth="0.2" />
                <circle cx="50" cy="50" r="7.2" strokeOpacity="0.07" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="1.1" fill="currentColor" fillOpacity="0.25" stroke="none" />
              </svg>
            </a>
            <div className="v2-music-info">
              <h2 className="v2-section-title">album-01_wip-unmixed</h2>
              <p className="v2-section-kicker">Alden Huschle</p>
              <p className="v2-section-body v2-release-links">
                <a href="https://untitled.stream/library/project/vb44xdBFQh4WQ15UdPJmX" target="_blank" rel="noopener" className="v2-link">Listen to the work in progress →</a>
              </p>
            </div>
          </div>

          <div className="v2-section v2-music-release">
            <a href="https://music.apple.com/us/album/lyla-minor-ep/1754043528" target="_blank" rel="noopener" className="v2-cover">
              <picture>
                <source type="image/avif" srcSet="/optimized/cover-lyla-minor-400.avif 400w, /optimized/cover-lyla-minor-800.avif 800w, /optimized/cover-lyla-minor-1600.avif 1600w" sizes="(max-width: 480px) 320px, 240px" />
                <source type="image/webp" srcSet="/optimized/cover-lyla-minor-400.webp 400w, /optimized/cover-lyla-minor-800.webp 800w, /optimized/cover-lyla-minor-1600.webp 1600w" sizes="(max-width: 480px) 320px, 240px" />
                <img className="v2-img" src="/cover-lyla-minor.jpg" alt="Lyla Minor EP cover" width={1200} height={1200} loading="lazy" decoding="async" />
              </picture>
            </a>
            <div className="v2-music-info">
              <h2 className="v2-section-title">Lyla Minor — EP</h2>
              <p className="v2-section-kicker">Lyla Minor</p>
              <p className="v2-section-body v2-release-links">
                <a href="https://music.apple.com/us/album/lyla-minor-ep/1754043528" target="_blank" rel="noopener" className="v2-link">Apple Music</a>
                <span className="v2-footer-sep"> / </span>
                <a href="https://open.spotify.com/album/24py69B0xZhT1V27lXv8us" target="_blank" rel="noopener" className="v2-link">Spotify</a>
              </p>
            </div>
          </div>

          <div className="v2-section v2-music-release">
            <a href="https://music.apple.com/us/album/intermezzos-vol-1-ep/1754047264" target="_blank" rel="noopener" className="v2-cover">
              <picture>
                <source type="image/avif" srcSet="/optimized/cover-intermezzos-400.avif 400w, /optimized/cover-intermezzos-800.avif 800w, /optimized/cover-intermezzos-1600.avif 1600w" sizes="(max-width: 480px) 320px, 240px" />
                <source type="image/webp" srcSet="/optimized/cover-intermezzos-400.webp 400w, /optimized/cover-intermezzos-800.webp 800w, /optimized/cover-intermezzos-1600.webp 1600w" sizes="(max-width: 480px) 320px, 240px" />
                <img className="v2-img" src="/cover-intermezzos.jpg" alt="Intermezzos Vol. 1 EP cover" width={1200} height={1200} loading="lazy" decoding="async" />
              </picture>
            </a>
            <div className="v2-music-info">
              <h2 className="v2-section-title">Intermezzos Vol. 1 — EP</h2>
              <p className="v2-section-kicker">Lyla Minor</p>
              <p className="v2-section-body v2-release-links">
                <a href="https://music.apple.com/us/album/intermezzos-vol-1-ep/1754047264" target="_blank" rel="noopener" className="v2-link">Apple Music</a>
                <span className="v2-footer-sep"> / </span>
                <a href="https://open.spotify.com/album/0BDZT0rTYIAtGlzGr10YDl" target="_blank" rel="noopener" className="v2-link">Spotify</a>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── OBSERVATIONS ─── */}
      {tab === "observations" && (
        <section className="v2-panel v2-panel-observations">
          {[
            { title: "Shared excitement", body: "Excitement is honest signal because it's challenging to fake convincingly. When someone else shares your excitement, not politely but genuinely, something shifts. There is a recognition that goes deeper than agreement. It's the relief of being understood without having to explain yourself first." },
            { title: "What it isn't", body: "Most people are searching for what it is, which confines the search to whatever they can already conceive. An alternative approach is to search for what it isn't. Every no is a positive narrowing of the space of possibilities. Follow the eliminations long enough and something meaningful starts to remain." },
            { title: "Prisms", body: "Artists will often speak of channeling, of receiving something from beyond themselves. What gets less attention is the transduction that follows. Energy arrives as feeling, as unconscious knowing, and then moves through the body, through every experience and instinct that has ever been. It is through this process that we arrive at the output we recognize as creation. We are not the windows light passes through, but rather the prisms that expose its color and brilliance." },
            { title: "You already know", body: "Indecision is rarely the absence of a preference. Somewhere beneath the noise of opinions and the fear of being wrong, there is already a direction. Most people can feel it, even when they refuse to name it. The hard part is not figuring out what to do. It is finding the nerve to admit that you already know." },
            { title: "The anti-expert", body: "There is a form of expertise that has nothing to do with formal training. It comes from something closer to devotion: the ability to know what good feels like before being able to explain why, and the willingness to sit with something and chisel away until a mirror is revealed. That is a different and equally valid form of mastery." },
            { title: "Magic is earned", body: "There is magic that exists in this world. It reveals itself through relentless dedication to craft, to honesty, to whatever form love takes in the work. The technical and the spiritual are not in conflict. The people doing the most interesting things tend to hold both without flinching and without needing to reconcile them. Each makes the other more real." },
            { title: "The leap", body: "Some distances aren't about the miles. They're about the decision behind them, made on instinct rather than calculation, where the act of taking action proves what planning never could: that feeling can be trusted as much as logic. Not because the destination or the outcome is necessarily better, but because the leap itself reveals a capacity for self-trust that most people never test." },
          ].map((w, i) => (
            <div className={`v2-section v2-writing-entry${i === 0 ? " v2-section-first" : ""}`} key={w.title}>
              <h2 className="v2-section-title">{w.title}</h2>
              <p className="v2-section-body">{w.body}</p>
            </div>
          ))}
        </section>
      )}

      {/* ─── CHANGELOG ─── */}
      {tab === "changelog" && (
        <section className="v2-panel v2-panel-changelog">
          <ol className="v2-changelog" style={{ counterReset: `v2log ${changelog.length + 1}` }}>
            {[...changelog].reverse().map((entry, i) => (
              <li key={i} className="v2-changelog-entry"><p>{entry}</p></li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
