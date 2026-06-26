"use client";

import { type FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ResponseJournalSandbox } from "../components/ResponseJournalSandbox";
import { HumanAgentSandbox } from "../components/HumanAgentSandbox";
import { DixonScheduleSandbox } from "../components/DixonScheduleSandbox";
import { ClientPortalPanel } from "../components/ClientPortalPanel";

// Runs before paint on the client; falls back to useEffect during SSR to avoid
// React's "useLayoutEffect does nothing on the server" warning.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type Tab = "home" | "design" | "music" | "observations" | "changelog" | "portal";

const PATH_TO_TAB: Record<string, Tab> = {
  "": "home",
  "home": "home",
  "design": "design",
  "work": "design",
  "music": "music",
  "observations": "observations",
  "changelog": "changelog",
  "promptlog": "changelog",
  "portal": "portal",
  "client-portal": "portal",
};

const GIG_POSTERS = [
  { name: "lyla-minor-2", alt: "Lyla Minor gig poster", width: 1740, height: 2174, large: "1740" },
  { name: "elvis-batchild", alt: "Elvis Batchild gig poster", width: 1740, height: 2174, large: "1740" },
  { name: "little-planet", alt: "Little Planet gig poster", width: 1753, height: 2179, large: "1753" },
  { name: "lyla-minor", alt: "Lyla Minor gig poster", width: 1302, height: 1627, large: "1302" },
  { name: "esteb", alt: "McKenna Esteb gig poster", width: 1737, height: 2170, large: "1737" },
  { name: "dull-culprit", alt: "Dull Culprit gig poster", width: 955, height: 1194, large: "955" },
  { name: "bathroom-poets", alt: "The Bathroom Poets gig poster", width: 955, height: 1193, large: "955" },
  { name: "shoecraft", alt: "Fine Arts Shoecraft gig poster", width: 1740, height: 2174, large: "1740" },
] as const;

const CLIENT_PORTAL_PASSWORD = "portal";

function UpRightArrow() {
  return (
    <svg
      className="v2-link-arrow"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.25 8.75 8.75 3.25" />
      <path d="M4.25 3.25h4.5v4.5" />
    </svg>
  );
}

export default function Site({ changelog, initialTab = "home" }: { changelog: string[]; initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [houseHintHidden, setHouseHintHidden] = useState(false);
  const [portalUnlocked, setPortalUnlocked] = useState(false);
  const [portalGateOpen, setPortalGateOpen] = useState(initialTab === "portal");
  const [portalPassword, setPortalPassword] = useState("");
  const [portalPasswordError, setPortalPasswordError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const houseStripRef = useRef<HTMLDivElement>(null);

  const openPortalGate = () => {
    setPortalPassword("");
    setPortalPasswordError(null);
    setPortalGateOpen(true);
  };

  const closePortalGate = () => {
    setPortalGateOpen(false);
    setPortalPassword("");
    setPortalPasswordError(null);
    if (!portalUnlocked && tab === "portal") setTab("home");
  };

  const submitPortalPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (portalPassword.trim() !== CLIENT_PORTAL_PASSWORD) {
      setPortalPasswordError("That password does not look right.");
      return;
    }

    setPortalUnlocked(true);
    setPortalGateOpen(false);
    setPortalPassword("");
    setPortalPasswordError(null);
    setTab("portal");
  };

  const requestPortalAccess = () => {
    if (portalUnlocked) {
      setTab("portal");
      return;
    }
    openPortalGate();
  };

  // Path-based tab routing (with legacy hash fallback)
  useEffect(() => {
    const hash = window.location.hash.slice(1).toLowerCase();
    if (hash && PATH_TO_TAB[hash]) {
      const target = PATH_TO_TAB[hash];
      if (target === "portal" && !portalUnlocked) {
        setTab(target);
        setPortalGateOpen(true);
        history.replaceState(null, "", "/portal");
      } else {
        setTab(target);
        history.replaceState(null, "", target === "home" ? "/" : `/${target}`);
      }
    }
    const readPath = () => {
      const segment = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "");
      const next = PATH_TO_TAB[segment];
      if (!next) return;
      if (next === "portal" && !portalUnlocked) {
        setTab(next);
        setPortalGateOpen(true);
        return;
      }
      setTab(next);
    };
    window.addEventListener("popstate", readPath);
    return () => window.removeEventListener("popstate", readPath);
  }, [portalUnlocked]);

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

  // Image fade-in. Runs before paint (layout effect) so images that are already
  // cached/complete are revealed instantly — no fade — instead of re-running the
  // fade-in every time a panel remounts on a tab switch. Only images still
  // arriving over the network fade in, which is the intended first-load touch.
  useIsoLayoutEffect(() => {
    document.querySelectorAll<HTMLImageElement>(".site-v2 .v2-img").forEach((img) => {
      if (img.classList.contains("v2-loaded")) return;
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add("v2-instant", "v2-loaded");
      } else {
        const reveal = () => img.classList.add("v2-loaded");
        img.addEventListener("load", reveal, { once: true });
        img.addEventListener("error", reveal, { once: true });
      }
    });
  }, [tab]);

  useEffect(() => {
    if (tab !== "design") return;
    const strip = houseStripRef.current;
    if (!strip) return;
    setHouseHintHidden(false);

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let velX = 0;
    let lastX = 0;
    let lastT = 0;
    let rafId = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      dragging = true;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
      lastX = e.clientX;
      lastT = Date.now();
      velX = 0;
      strip.classList.add("v2-dragging");
      strip.setPointerCapture(e.pointerId);
      cancelAnimationFrame(rafId);
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = Date.now();
      const dt = Math.max(1, now - lastT);
      velX = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = now;
      strip.scrollLeft = startScroll - (e.clientX - startX);
    };

    const onEndDrag = () => {
      if (!dragging) return;
      dragging = false;
      strip.classList.remove("v2-dragging");

      let v = -velX * 16;
      const coast = () => {
        if (Math.abs(v) < 0.3) return;
        strip.scrollLeft += v;
        v *= 0.92;
        rafId = requestAnimationFrame(coast);
      };
      coast();
    };

    const hideHint = () => setHouseHintHidden(true);

    strip.addEventListener("pointerdown", onPointerDown);
    strip.addEventListener("pointermove", onPointerMove);
    strip.addEventListener("pointerup", onEndDrag);
    strip.addEventListener("pointercancel", onEndDrag);
    strip.addEventListener("pointerdown", hideHint, { once: true });
    strip.addEventListener("scroll", hideHint, { once: true });

    return () => {
      cancelAnimationFrame(rafId);
      strip.removeEventListener("pointerdown", onPointerDown);
      strip.removeEventListener("pointermove", onPointerMove);
      strip.removeEventListener("pointerup", onEndDrag);
      strip.removeEventListener("pointercancel", onEndDrag);
      strip.removeEventListener("pointerdown", hideHint);
      strip.removeEventListener("scroll", hideHint);
    };
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
          className={`v2-tab ${tab === "design" ? "v2-tab-active" : ""}`}
          onClick={() => setTab("design")}
        >
          Design
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
        </span>
      </nav>

      {/* ─── HOME ─── */}
      {tab === "home" && (
        <section className="v2-panel v2-panel-home">
          <div className="v2-feature-image">
            <picture className="v2-feature-image-pic v2-feature-image-default">
              <source type="image/avif" srcSet="/optimized/home-feature-800.avif 800w, /optimized/home-feature-1600.avif 1600w, /optimized/home-feature-2500.avif 2500w" sizes="(max-width: 768px) 100vw, 620px" />
              <source type="image/webp" srcSet="/optimized/home-feature-800.webp 800w, /optimized/home-feature-1600.webp 1600w, /optimized/home-feature-2500.webp 2500w" sizes="(max-width: 768px) 100vw, 620px" />
              <img className="v2-img" src="/home-feature.jpg" alt="" width={3024} height={1684} loading="eager" fetchPriority="high" decoding="async" />
            </picture>
          </div>

          <div className="v2-footer-links">
            <a
              href="/alden-huschle-resume-june-2026.pdf"
              target="_blank"
              rel="noopener"
            >
              Resume
            </a>
            <span className="v2-footer-sep"> / </span>
            <a href="mailto:alden@aldenhuschle.com">Contact</a>
          </div>
        </section>
      )}

      {/* ─── DESIGN ─── */}
      {tab === "design" && (
        <section className="v2-panel v2-panel-design">
          <div className="v2-section">
            <h2 className="v2-section-title">WethosAI</h2>
            <p className="v2-section-kicker">In-house</p>
            <p className="v2-section-body">
              WethosAI is one of the companies incubated inside NumberOne AI. I lead brand, website, and marketing design. An AI-forward identity built from scratch, shipped with emerging tools so the surface area of the work can move as fast as the product.
            </p>
            <p className="v2-section-body v2-release-links">
              <a href="https://wethos.ai/" target="_blank" rel="noopener" className="v2-link">Live at wethos.ai <UpRightArrow /></a>
            </p>
            <div style={{ marginTop: "clamp(0.5rem, 1.2vw, 1rem)" }}>
              <HumanAgentSandbox />
            </div>
          </div>

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
            <h2 className="v2-section-title">Dixon Creative Center</h2>
            <p className="v2-section-kicker">Client work</p>
            <p className="v2-section-body">
              Dixon Creative Center is a creative center in Long Beach. The site is built around a facade-as-interface conceit: a hand-drawn pen-and-paper world where every surface speaks the same visual language.
            </p>
            <p className="v2-section-body v2-release-links">
              <a href="https://dixoncreativecenter.com/" target="_blank" rel="noopener" className="v2-link">Live at dixoncreativecenter.com <UpRightArrow /></a>
            </p>
            <div style={{ marginTop: "clamp(1.5rem, 3vw, 2rem)" }}>
              <DixonScheduleSandbox />
            </div>
          </div>

          <div className="v2-section">
            <h2 className="v2-section-title">Gig posters</h2>
            <p className="v2-section-kicker">Client work</p>
            <p className="v2-section-body">
              A set of show posters made for Seattle&apos;s music scene circa 2022, designed to bring a distinct visual identity to each bill.
            </p>
            <div className="v2-poster-grid">
              {GIG_POSTERS.map((poster) => (
                <picture key={poster.name}>
                  <source type="image/avif" srcSet={`/optimized/poster-${poster.name}-800.avif 800w, /optimized/poster-${poster.name}-${poster.large}.avif ${poster.large}w`} sizes="(max-width: 759px) 100vw, 250px" />
                  <source type="image/webp" srcSet={`/optimized/poster-${poster.name}-800.webp 800w, /optimized/poster-${poster.name}-${poster.large}.webp ${poster.large}w`} sizes="(max-width: 759px) 100vw, 250px" />
                  <img className="v2-img" src={`/poster-${poster.name}.png`} alt={poster.alt} width={poster.width} height={poster.height} loading="lazy" decoding="async" />
                </picture>
              ))}
            </div>
          </div>

          <div className="v2-section">
            <h2 className="v2-section-title">A House Is Not a Home</h2>
            <p className="v2-section-kicker">Side project</p>
            <p className="v2-section-body">
              A collection of images from Snoqualmie, WA, and Seattle, WA, pieced together into a horizontal composition of contrast.
            </p>
            <div className="v2-house-body" ref={houseStripRef} aria-label="A house is not a home image strip">
              <div className="v2-house-strip">
                <picture>
                  <source type="image/avif" srcSet="/optimized/house-strip-4500.avif 4500w, /optimized/house-strip-9000.avif 9000w, /optimized/house-strip-12000.avif 12000w" sizes="(max-width: 640px) 3304px, 6608px" />
                  <source type="image/webp" srcSet="/optimized/house-strip-4500.webp 4500w, /optimized/house-strip-9000.webp 9000w" sizes="(max-width: 640px) 3304px, 6608px" />
                  <img className="v2-img v2-house-img" src="/house-strip.jpg" alt="A house is not a home" width={12000} height={763} loading="eager" fetchPriority="high" decoding="async" />
                </picture>
              </div>
            </div>
            <div className={`v2-house-hint${houseHintHidden ? " v2-house-hint-hidden" : ""}`} aria-hidden="true">
              <svg viewBox="0 0 56 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="15" y1="12" x2="4" y2="12" />
                <polyline points="9,7 4,12 9,17" />
                <circle cx="28" cy="12" r="3" fill="currentColor" stroke="none" />
                <line x1="41" y1="12" x2="52" y2="12" />
                <polyline points="47,7 52,12 47,17" />
              </svg>
            </div>
          </div>
        </section>
      )}

      {/* ─── CLIENT PORTAL ─── */}
      {tab === "portal" && portalUnlocked && <ClientPortalPanel />}

      {portalGateOpen && (
        <div className="v2-password-backdrop" role="presentation" onClick={closePortalGate}>
          <form
            aria-labelledby="v2-password-title"
            aria-modal="true"
            className="v2-password-modal"
            onClick={(event) => event.stopPropagation()}
            onSubmit={submitPortalPassword}
            role="dialog"
          >
            <h2 id="v2-password-title">Sign In</h2>
            <div className="v2-password-label">
              <label htmlFor="v2-portal-email">Email</label>
              <input id="v2-portal-email" autoFocus autoComplete="email" inputMode="email" type="email" />
            </div>
            <div className="v2-password-label">
              <div className="v2-password-label-row">
                <label htmlFor="v2-portal-password">Password</label>
                <a href="mailto:alden@aldenhuschle.com">Forgot your password?</a>
              </div>
              <input
                autoComplete="current-password"
                id="v2-portal-password"
                type="password"
                value={portalPassword}
                onChange={(event) => {
                  setPortalPassword(event.target.value);
                  setPortalPasswordError(null);
                }}
              />
            </div>
            {portalPasswordError && <p className="v2-password-error">{portalPasswordError}</p>}
            <label className="v2-password-remember">
              <input defaultChecked type="checkbox" />
              <span>Remember me on this device</span>
            </label>
            <div className="v2-password-actions">
              <button className="v2-password-primary" type="submit">
                Sign in
              </button>
            </div>
            <div className="v2-password-divider">
              <span>OR</span>
            </div>
            <div className="v2-password-providers" aria-label="Client sign-in options">
              <button className="v2-password-provider" type="button">
                <svg className="v2-password-provider-icon" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.583-5.036-3.711H.957v2.332A9 9 0 0 0 9 18Z" />
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A9 9 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" />
                  <path fill="#EA4335" d="M9 3.58c1.322 0 2.508.455 3.44 1.347l2.022-2.022C13.463 1.475 11.43 0 9 0A9 9 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
              <button className="v2-password-provider" type="button">
                <svg className="v2-password-provider-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="9" cy="9" r="3" />
                  <path d="M11.5 11.5 21 21" />
                  <path d="m16 16 2.2-2.2" />
                  <path d="m19 19 2-2" />
                </svg>
                <span>Sign in with passkey</span>
              </button>
            </div>
            <p className="v2-password-contact">
              Not a client yet? <a href="mailto:alden@aldenhuschle.com">Contact me.</a>
            </p>
          </form>
        </div>
      )}

      {/* ─── MUSIC ─── */}
      {tab === "music" && (
        <section className="v2-panel v2-panel-music">
          <div className="v2-section v2-music-release">
            <a href="https://untitled.stream/library/project/vb44xdBFQh4WQ15UdPJmX" target="_blank" rel="noopener" className="v2-cover" aria-label="album-01_wip-unmixed">
              <img className="v2-img" src="/cover-unmixed.png" alt="album-01_wip-unmixed cover" width={1254} height={1254} loading="lazy" decoding="async" />
            </a>
            <div className="v2-music-info">
              <h2 className="v2-section-title">album-01_wip-unmixed</h2>
              <p className="v2-section-kicker">Alden Huschle</p>
              <p className="v2-section-body v2-release-links">
                <a href="https://untitled.stream/library/project/vb44xdBFQh4WQ15UdPJmX" target="_blank" rel="noopener" className="v2-link">Listen to the work in progress <UpRightArrow /></a>
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
            { title: "Trust as relief", body: "Trust often precedes comprehension. Care shown in one place is felt as a promise of care everywhere. The purest output design can offer is not beauty or clarity but the quiet relief of immersion that comes with trusting the perspective of a stranger." },
            { title: "The residue of choice", body: "Speed is no longer scarce. A machine can lay down a hundred possible versions before a person finishes doubting the first. What remains scarce is the care behind decisions, the long accumulation of small refusals no process can shortcut and no algorithm can replicate. The things that move us deeply are dense with someone having chosen, again and again, to fight for their interpretation of beauty." },
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
