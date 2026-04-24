"use client";

import { useEffect, useRef, useState } from "react";

type Tab = "home" | "work" | "music" | "observations" | "changelog";

const TAB_HASHES: Record<string, Tab> = {
  "": "home",
  "home": "home",
  "work": "work",
  "music": "music",
  "observations": "observations",
  "changelog": "changelog",
  "promptlog": "changelog",
};

export default function Site({ changelog }: { changelog: string[] }) {
  const [tab, setTab] = useState<Tab>("home");
  const mountedRef = useRef(false);

  // Hash-based tab routing
  useEffect(() => {
    const readHash = () => {
      const raw = window.location.hash.slice(1).toLowerCase();
      const next = TAB_HASHES[raw];
      if (next) setTab(next);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const currentHash = window.location.hash.slice(1).toLowerCase();
    const desiredHash = tab === "home" ? "" : tab;
    if (currentHash !== desiredHash) {
      if (tab === "home") {
        history.pushState(null, "", window.location.pathname + window.location.search);
      } else {
        history.pushState(null, "", `#${tab}`);
      }
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
              <a href="#work" className="v2-link">Prompting People</a>, designing for{" "}
              <a href="https://numberone.ai/" target="_blank" rel="noopener" className="v2-link">NumberOne AI</a>, and recording{" "}
              <a href="https://untitled.stream/library/project/vb44xdBFQh4WQ15UdPJmX" target="_blank" rel="noopener" className="v2-link">an album</a>.
            </p>
            <p>
              I grew up in Snoqualmie, WA and currently live in Long Beach, CA.
            </p>
          </div>

          <div className="v2-footer-links">
            <a href="mailto:huschledesign@gmail.com">Email</a>
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
          </div>
        </section>
      )}

      {/* ─── MUSIC ─── */}
      {tab === "music" && (
        <section className="v2-panel v2-panel-music">
          <div className="v2-section">
            <h2 className="v2-section-title">album-01_wip-unmixed</h2>
            <p className="v2-section-body v2-release-links">
              <a href="https://untitled.stream/library/project/vb44xdBFQh4WQ15UdPJmX" target="_blank" rel="noopener" className="v2-link">Listen to the work in progress →</a>
            </p>
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
