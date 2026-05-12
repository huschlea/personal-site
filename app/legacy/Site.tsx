"use client";

import { useEffect, useRef } from "react";

const MURMUR_WORDS = [
  "becoming", "belong", "before", "build", "commit", "compose", "craft", "deliberate",
  "design", "distance", "doubt", "earned", "expose", "faith", "found", "honest",
  "identity", "instinct", "intent", "leap", "listen", "love", "magic", "make", "mark",
  "motion", "move", "notice", "origin", "patient", "personal", "practice", "private",
  "purpose", "question", "reach", "record", "reckoning", "release", "reveal",
  "romantic", "root", "signal", "slow", "solo", "song", "sound", "structure",
  "threshold", "transition", "trust", "voice", "write", "west", "salt", "arrive",
  "minor", "twelve", "long", "coast", "weight", "spare", "precise", "land", "settle",
  "almost", "quiet", "ache", "clarity", "authentic", "album", "agent", "shape",
  "trace", "surface", "remain", "logic", "feeling", "compress", "iron", "stone",
  "mineral", "cold", "name", "ship", "brand", "system", "press", "plant", "collapse",
  "expand", "true", "urgent", "grace", "held", "made", "given", "told",
  "unnamed", "untold", "anchor", "drift", "together", "alone", "exposed",
  "intermezzos", "lyla", "california", "seattle", "pacific",
  "anti", "expert", "self", "taught", "care", "attention",
  "enforce", "after", "prayer", "tender", "open", "named", "spoken", "north", "pull",
];

export default function Site({ changelog }: { changelog: string[] }) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const feedPage = document.getElementById("feedPage")!;
    const articleIds = [
      "bio", "prompting-people", "album-01_wip-unmixed", "resume", "promptlog",
      "the-anti-expert", "the-leap", "you-already-know", "magic-is-earned", "themes",
      "dreams", "gig-posters", "a-house-is-not-a-home", "molecule", "prisms",
      "what-it-isnt", "shared-excitement",
    ];
    const articles: Record<string, HTMLElement> = {};
    for (const id of articleIds) {
      const el = document.getElementById(id);
      if (el) articles[id] = el;
    }

    // Set up image fade-in on load for all article images
    const markLoaded = (img: HTMLImageElement) => img.classList.add("loaded");
    document.querySelectorAll<HTMLImageElement>(".article img").forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        markLoaded(img);
      } else {
        img.addEventListener("load", () => markLoaded(img), { once: true });
        img.addEventListener("error", () => markLoaded(img), { once: true });
      }
    });

    // Promote the first image of each article to eager loading so it's ready
    // by the time the article is revealed.
    for (const id of articleIds) {
      const first = articles[id]?.querySelector<HTMLImageElement>("img");
      if (first) first.loading = "eager";
    }

    let murmurInitialized = false;

    function initMurmur() {
      if (murmurInitialized) return;
      murmurInitialized = true;

      const field = document.getElementById("murmurField");
      if (!field) return;

      const W = field.offsetWidth;
      const H = field.offsetHeight;
      const COUNT = Math.min(420, Math.max(180, Math.floor((W * H) / 2200)));

      const pool = [...MURMUR_WORDS].sort(() => Math.random() - 0.5);
      const weights = [300, 400, 400, 700, 800, 800, 900];

      const frag = document.createDocumentFragment();

      for (let i = 0; i < COUNT; i++) {
        const span = document.createElement("span");
        span.className = "murmur-word";
        span.textContent = pool[i % pool.length];

        const sizeRand = Math.random();
        let size: number;
        if (sizeRand < 0.48) size = 0.55 + Math.random() * 1.1;
        else if (sizeRand < 0.78) size = 1.65 + Math.random() * 1.8;
        else size = 3.5 + Math.random() * 2.8;

        const op = 0.12 + Math.random() * 0.72;
        const dur = 10 + Math.random() * 16;
        const dly = -(Math.random() * dur);
        const amp = () => (Math.random() - 0.5) * 260;
        const fw = weights[Math.floor(Math.random() * weights.length)];

        span.style.cssText = [
          "font-size:" + size + "rem",
          "font-weight:" + fw,
          "left:" + Math.random() * 94 + "%",
          "top:" + Math.random() * 93 + "%",
          "--op:" + op,
          "--dur:" + dur + "s",
          "--dly:" + dly + "s",
          "--dx1:" + amp() + "px",
          "--dy1:" + amp() + "px",
          "--dx2:" + amp() + "px",
          "--dy2:" + amp() + "px",
          "--dx3:" + amp() + "px",
          "--dy3:" + amp() + "px",
        ].join(";");

        frag.appendChild(span);
      }

      field.appendChild(frag);

      const busySpans = new WeakSet<HTMLElement>();
      function changeWord(span: HTMLElement) {
        if (busySpans.has(span)) return;
        busySpans.add(span);
        span.classList.add("swap");
        setTimeout(() => {
          span.textContent = MURMUR_WORDS[Math.floor(Math.random() * MURMUR_WORDS.length)];
          span.classList.remove("swap");
          setTimeout(() => { busySpans.delete(span); }, 200);
        }, 100);
      }

      field.addEventListener("mouseover", (e) => {
        const t = e.target as HTMLElement;
        if (t.classList && t.classList.contains("murmur-word")) changeWord(t);
      });
      field.addEventListener("touchend", (e) => {
        const t = e.target as HTMLElement;
        if (t.classList && t.classList.contains("murmur-word")) {
          e.preventDefault();
          changeWord(t);
        }
      }, { passive: false });
    }

    let current: string | null = null;
    let savedScrollY = 0;
    let showFeedToken = 0;

    function preloadArticleImages(id: string) {
      const article = articles[id];
      if (!article) return;
      article.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
        const src = img.getAttribute("src");
        if (!src) return;
        const pre = new Image();
        pre.decoding = "async";
        pre.src = src;
      });
    }

    const TRANSITION_MS = 280;

    function lockPanelAt(el: HTMLElement, y: number) {
      el.style.position = "fixed";
      el.style.top = `-${y}px`;
      el.style.left = "0";
      el.style.right = "0";
    }

    function unlockPanel(el: HTMLElement) {
      el.style.position = "";
      el.style.top = "";
      el.style.left = "";
      el.style.right = "";
    }

    function _showArticle(id: string) {
      current = id;
      const article = articles[id];
      if (!article) return;
      preloadArticleImages(id);

      // Lock the feed at its current visual position so we can scroll the
      // document to 0 without any visible jump during the cross-fade.
      lockPanelAt(feedPage, window.scrollY);
      window.scrollTo(0, 0);

      // Stage article at opacity 0, then run both transitions together.
      article.classList.add("entering");
      if (id === "themes") initMurmur();
      void article.offsetHeight;
      feedPage.classList.add("out");
      article.classList.add("in");

      setTimeout(() => {
        if (current !== id) return;
        feedPage.classList.add("hidden");
        unlockPanel(feedPage);
        if (id === "promptlog") {
          const content = document.getElementById("promptlogContent");
          const el = document.getElementById("promptlogWordCount");
          if (content && el) {
            const words = content.textContent!.trim().split(/\s+/).filter((w) => w.length > 0).length;
            el.textContent = words.toLocaleString();
          }
        }
      }, TRANSITION_MS);
    }

    function openArticle(id: string) {
      if (current) return;
      savedScrollY = window.scrollY;
      _showArticle(id);
      history.pushState({ article: id, scrollY: savedScrollY }, "", "#" + id);
    }

    function showFeed(scrollY: number) {
      const leaving = current ? articles[current] : null;
      document.querySelectorAll(".feed-item.stream-open").forEach((el) => el.classList.remove("stream-open"));
      current = null;
      const token = ++showFeedToken;

      // Make the feed visible-but-invisible at its restored scroll position,
      // then cross-fade article out and feed in simultaneously.
      feedPage.classList.remove("hidden");
      feedPage.style.removeProperty("display");
      feedPage.style.removeProperty("opacity");
      lockPanelAt(feedPage, scrollY || 0);
      void feedPage.offsetHeight;
      feedPage.classList.remove("out");
      if (leaving) leaving.classList.remove("in");

      setTimeout(() => {
        if (token !== showFeedToken) return;
        // Unlock feed first so it contributes its full height to the document,
        // then restore scroll, then drop the article from layout. All three
        // happen in the same tick — the browser paints once, at the end.
        unlockPanel(feedPage);
        window.scrollTo(0, scrollY || 0);
        document.querySelectorAll(".article").forEach((a) => {
          a.classList.remove("in", "entering");
        });
      }, TRANSITION_MS);
    }

    function closeArticle() {
      if (!current) return;
      showFeed(savedScrollY);
      history.replaceState(null, "", window.location.pathname);
    }

    function toggleStream(item: Element) {
      const wasOpen = item.classList.contains("stream-open");
      document.querySelectorAll(".feed-item.stream-open").forEach((el) => el.classList.remove("stream-open"));
      if (!wasOpen) item.classList.add("stream-open");
    }

    // Event delegation for all click handlers
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      // Inactive stream choice — do nothing, don't toggle parent
      if (target.closest("[data-stream-inactive]")) {
        e.stopPropagation();
        return;
      }

      // Stream choice that opens an article
      const streamArt = target.closest<HTMLElement>("[data-stream-article]");
      if (streamArt) {
        e.stopPropagation();
        openArticle(streamArt.dataset.streamArticle!);
        return;
      }

      // Regular anchor inside stream-choices — let the browser handle it
      if (target.closest("a")) {
        return;
      }

      // Back button
      if (target.closest("[data-close]")) {
        closeArticle();
        return;
      }

      // Feed item that opens an article
      const openEl = target.closest<HTMLElement>("[data-open]");
      if (openEl) {
        openArticle(openEl.dataset.open!);
        return;
      }

      // Stream toggle
      const toggleEl = target.closest<HTMLElement>("[data-stream-toggle]");
      if (toggleEl) {
        toggleStream(toggleEl);
        return;
      }
    }

    document.addEventListener("click", handleClick);

    const onPopState = (e: PopStateEvent) => {
      const hash = window.location.hash.slice(1);
      const restoreY = e.state && typeof e.state.scrollY === "number" ? e.state.scrollY : savedScrollY;
      if (!hash) {
        if (current) showFeed(restoreY);
      } else if (articles[hash] && !current) {
        _showArticle(hash);
      }
    };
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) showFeed(savedScrollY || 0);
    };
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && !window.location.hash) showFeed(0);
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("pageshow", onPageShow);

    // Initial hash restore
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      if (articles[id]) {
        feedPage.classList.add("out", "hidden");
        articles[id].classList.add("entering", "in");
        current = id;
        preloadArticleImages(id);
        if (id === "themes") initMurmur();
        if (id === "promptlog") {
          const content = document.getElementById("promptlogContent");
          const el = document.getElementById("promptlogWordCount");
          if (content && el) {
            const words = content.textContent!.trim().split(/\s+/).filter((w) => w.length > 0).length;
            el.textContent = words.toLocaleString();
          }
        }
      }
    }

    // ─── HOUSE PHOTO STRIP ───
    const houseStrip = document.getElementById("houseStripBody");
    const houseCleanup: Array<() => void> = [];

    if (houseStrip) {
      const strip = houseStrip;
      let dragging = false;
      let startX = 0, startScroll = 0;
      let velX = 0, lastX = 0, lastT = 0;
      let rafId = 0;

      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        dragging = true;
        startX = e.clientX;
        startScroll = strip.scrollLeft;
        lastX = e.clientX;
        lastT = Date.now();
        velX = 0;
        strip.classList.add("dragging");
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
        strip.classList.remove("dragging");
        let v = -velX * 16;
        const coast = () => {
          if (Math.abs(v) < 0.3) return;
          strip.scrollLeft += v;
          v *= 0.92;
          rafId = requestAnimationFrame(coast);
        };
        coast();
      };

      strip.addEventListener("pointerdown", onPointerDown);
      strip.addEventListener("pointermove", onPointerMove);
      strip.addEventListener("pointerup", onEndDrag);
      strip.addEventListener("pointercancel", onEndDrag);

      const hint = document.getElementById("houseSwipeHint");
      const hideHint = () => { if (hint) hint.classList.add("hidden"); };
      strip.addEventListener("pointerdown", hideHint, { once: true });
      strip.addEventListener("scroll", hideHint, { once: true });

      houseCleanup.push(() => {
        strip.removeEventListener("pointerdown", onPointerDown);
        strip.removeEventListener("pointermove", onPointerMove);
        strip.removeEventListener("pointerup", onEndDrag);
        strip.removeEventListener("pointercancel", onEndDrag);
        strip.removeEventListener("pointerdown", hideHint);
        strip.removeEventListener("scroll", hideHint);
      });
    }

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("pageshow", onPageShow);
      houseCleanup.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="site">
      {/* ─── FEED PAGE ─── */}
      <div className="feed-page" id="feedPage">
        <main className="feed">
          <ul className="feed-list">
            <li className="feed-section">Music</li>

            <li className="feed-item passive progress-70" data-stream-toggle style={{ cursor: "pointer" }}>
              <div className="feed-row">
                <div className="stream-slot">
                  <span className="feed-title">album-01_wip-unmixed</span>
                  <div className="stream-choices">
                    <span className="stream-choice stream-choice-inactive" data-stream-inactive>In progress</span>
                    <a className="stream-choice" href="https://untitled.stream/library/project/vb44xdBFQh4WQ15UdPJmX" target="_blank" rel="noopener">Listen</a>
                  </div>
                </div>
              </div>
            </li>

            <li className="feed-item" data-stream-toggle style={{ cursor: "pointer" }}>
              <div className="feed-row">
                <div className="stream-slot">
                  <span className="feed-title">Lyla Minor - EP</span>
                  <div className="stream-choices">
                    <a className="stream-choice" href="https://music.apple.com/us/album/lyla-minor-ep/1754043528" target="_blank" rel="noopener">Apple Music</a>
                    <a className="stream-choice" href="https://open.spotify.com/album/24py69B0xZhT1V27lXv8us" target="_blank" rel="noopener">Spotify</a>
                  </div>
                </div>
              </div>
            </li>

            <li className="feed-item" data-stream-toggle style={{ cursor: "pointer" }}>
              <div className="feed-row">
                <div className="stream-slot">
                  <span className="feed-title">Intermezzos Vol. 1 - EP</span>
                  <div className="stream-choices">
                    <a className="stream-choice" href="https://music.apple.com/us/album/intermezzos-vol-1-ep/1754047264" target="_blank" rel="noopener">Apple Music</a>
                    <a className="stream-choice" href="https://open.spotify.com/album/0BDZT0rTYIAtGlzGr10YDl" target="_blank" rel="noopener">Spotify</a>
                  </div>
                </div>
              </div>
            </li>

            <li className="feed-section">Design</li>

            <li className="feed-item passive progress-85" data-stream-toggle style={{ cursor: "pointer" }}>
              <div className="feed-row">
                <div className="stream-slot">
                  <span className="feed-title">Prompting People</span>
                  <div className="stream-choices">
                    <span className="stream-choice stream-choice-inactive" data-stream-inactive>Coming soon</span>
                    <span className="stream-choice stream-choice-article" data-stream-article="prompting-people">About</span>
                  </div>
                </div>
              </div>
            </li>

            <li className="feed-item thought" data-open="gig-posters">
              <div className="feed-row"><span className="feed-title">Gig posters</span></div>
            </li>

            <li className="feed-item thought" data-open="a-house-is-not-a-home">
              <div className="feed-row"><span className="feed-title">A house is not a home</span></div>
            </li>

            <li className="feed-item thought" data-open="molecule">
              <div className="feed-row"><span className="feed-title">Molecule</span></div>
            </li>

            <li className="feed-section">Observations</li>

            <li className="feed-item thought" data-open="shared-excitement">
              <div className="feed-row"><span className="feed-title">Shared excitement</span></div>
            </li>

            <li className="feed-item thought" data-open="what-it-isnt">
              <div className="feed-row"><span className="feed-title">What it isn't</span></div>
            </li>

            <li className="feed-item thought" data-open="prisms">
              <div className="feed-row"><span className="feed-title">Prisms</span></div>
            </li>

            <li className="feed-item thought" data-open="you-already-know">
              <div className="feed-row"><span className="feed-title">You already know</span></div>
            </li>

            <li className="feed-item thought" data-open="the-anti-expert">
              <div className="feed-row"><span className="feed-title">The anti-expert</span></div>
            </li>

            <li className="feed-item thought" data-open="magic-is-earned">
              <div className="feed-row"><span className="feed-title">Magic is earned</span></div>
            </li>

            <li className="feed-item thought" data-open="the-leap">
              <div className="feed-row"><span className="feed-title">The leap</span></div>
            </li>

            <li className="feed-section">About</li>

            <li className="feed-item thought" data-open="bio">
              <div className="feed-row"><span className="feed-title">Bio</span></div>
            </li>

            <li className="feed-item thought" data-open="resume">
              <div className="feed-row"><span className="feed-title">Resume</span></div>
            </li>

            <li className="feed-section">Other</li>

            <li className="feed-item thought" data-open="themes">
              <div className="feed-row"><span className="feed-title">Themes</span></div>
            </li>

            <li className="feed-item thought" data-open="dreams">
              <div className="feed-row"><span className="feed-title">Dreams</span></div>
            </li>

            <li className="feed-item thought" data-open="promptlog">
              <div className="feed-row"><span className="feed-title">Promptlog</span></div>
            </li>
          </ul>
        </main>

        <footer className="home-footer">
          <div>
            <p className="home-footer-loc">Alden Huschle</p>
          </div>
          <div className="home-footer-right">
            <a href="mailto:alden@aldenhuschle.com">contact</a>
          </div>
        </footer>
      </div>

      {/* ─── GIG POSTERS ─── */}
      <div className="article" id="gig-posters">
        <div className="article-nav">
          <button className="back-btn" data-close><span>Back</span></button>
        </div>
        <div className="article-body">
          <h1 className="article-title">Gig posters</h1>
          <div className="poster-stack">
            {[
              { name: "shoecraft", alt: "Fine Arts Shoecraft gig poster", w: 1740, h: 2174, lg: "1740" },
              { name: "bathroom-poets", alt: "The Bathroom Poets gig poster", w: 955, h: 1193, lg: "955" },
              { name: "dull-culprit", alt: "Dull Culprit gig poster", w: 955, h: 1194, lg: "955" },
              { name: "esteb", alt: "McKenna Esteb gig poster", w: 1737, h: 2170, lg: "1737" },
              { name: "lyla-minor", alt: "Lyla Minor gig poster", w: 1302, h: 1627, lg: "1302" },
              { name: "little-planet", alt: "Little Planet gig poster", w: 1753, h: 2179, lg: "1753" },
              { name: "elvis-batchild", alt: "Elvis Batchild gig poster", w: 1740, h: 2174, lg: "1740" },
              { name: "lyla-minor-2", alt: "Lyla Minor gig poster", w: 1740, h: 2174, lg: "1740" },
            ].map((p) => (
              <picture key={p.name}>
                <source type="image/avif" srcSet={`/optimized/poster-${p.name}-800.avif 800w, /optimized/poster-${p.name}-${p.lg}.avif ${p.lg}w`} sizes="(max-width: 768px) 100vw, 700px" />
                <source type="image/webp" srcSet={`/optimized/poster-${p.name}-800.webp 800w, /optimized/poster-${p.name}-${p.lg}.webp ${p.lg}w`} sizes="(max-width: 768px) 100vw, 700px" />
                <img src={`/poster-${p.name}.png`} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async" />
              </picture>
            ))}
          </div>
        </div>
      </div>

      {/* ─── A HOUSE IS NOT A HOME ─── */}
      <div className="article" id="a-house-is-not-a-home">
        <div className="article-nav">
          <button className="back-btn" data-close><span>Back</span></button>
        </div>
        <h1 className="article-title house-strip-title">A house is not a&nbsp;home</h1>
        <div className="house-strip-body" id="houseStripBody">
          <div className="house-strip">
            <picture>
              <source type="image/avif" srcSet="/optimized/house-strip-4500.avif 4500w, /optimized/house-strip-9000.avif 9000w, /optimized/house-strip-16500.avif 16500w" sizes="(max-width: 640px) 1131vw, 817vh" />
              <source type="image/webp" srcSet="/optimized/house-strip-4500.webp 4500w, /optimized/house-strip-9000.webp 9000w, /optimized/house-strip-16000.webp 16000w" sizes="(max-width: 640px) 1131vw, 817vh" />
              <img src="/house-strip.jpg" alt="A house is not a home" width={27500} height={1750} loading="eager" decoding="async" />
            </picture>
          </div>
        </div>
        <div className="house-swipe-hint" id="houseSwipeHint">
          <svg viewBox="0 0 56 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="15" y1="12" x2="4" y2="12" />
            <polyline points="9,7 4,12 9,17" />
            <circle cx="28" cy="12" r="3" fill="currentColor" stroke="none" />
            <line x1="41" y1="12" x2="52" y2="12" />
            <polyline points="47,7 52,12 47,17" />
          </svg>
        </div>
      </div>

      {/* ─── MOLECULE ─── */}
      <div className="article molecule-article" id="molecule">
        <div className="article-nav molecule-nav">
          <button className="back-btn molecule-back" data-close><span>Back</span></button>
        </div>
        <div className="molecule-body">
          <div className="molecule-cards">
            <h1 className="article-title molecule-title">Molecule</h1>
            <div className="molecule-card"><img src="/lsd1-01.webp" alt="" width={2500} height={2500} loading="lazy" decoding="async" /></div>
            <div className="molecule-card"><img src="/lsd2-01.webp" alt="" width={2500} height={2500} loading="lazy" decoding="async" /></div>
            <div className="molecule-card"><img src="/lsd4-01.webp" alt="" width={2500} height={2500} loading="lazy" decoding="async" /></div>
            <div className="molecule-card"><img src="/lsd3-01.webp" alt="" width={2500} height={2500} loading="lazy" decoding="async" /></div>
          </div>
        </div>
      </div>

      {/* ─── SHARED EXCITEMENT ─── */}
      <div className="article" id="shared-excitement">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">Shared excitement</h1>
          <p className="article-text">excitement is honest signal because its challenging to fake convincingly. when someone else shares your excitement, not politely but genuinely, something shifts. there is a recognition that goes deeper than agreement. it's the relief of being understood without having to explain yourself first.</p>
        </div>
      </div>

      {/* ─── WHAT IT ISN'T ─── */}
      <div className="article" id="what-it-isnt">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">What it isn't</h1>
          <p className="article-text">most people are searching for what it is, which confines the search to whatever they can already conceive. an alternative approach is to search for what it isn't. every no is a positive narrowing of the space of possibilities. follow the eliminations long enough and something meaningful starts to remain.</p>
        </div>
      </div>

      {/* ─── PRISMS ─── */}
      <div className="article" id="prisms">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">Prisms</h1>
          <p className="article-text">artists will often speak of channeling, of receiving something from beyond themselves. what gets less attention is the transduction that follows. energy arrives as feeling, as unconscious knowing, and then moves through the body, through every experience and instinct that has ever been. it is through this process that we arrive at the output we recognize as creation. we are not the windows light passes through, but rather the prisms that expose its color and brilliance.</p>
        </div>
      </div>

      {/* ─── THE ANTI-EXPERT ─── */}
      <div className="article" id="the-anti-expert">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">The anti-expert</h1>
          <p className="article-text">there is a form of expertise that has nothing to do with formal training. it comes from something closer to devotion: the ability to know what good feels like before being able to explain why, and the willingness to sit with something and chisel away until a mirror is revealed. that is a different and equally valid form of mastery.</p>
        </div>
      </div>

      {/* ─── THE LEAP ─── */}
      <div className="article" id="the-leap">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">The leap</h1>
          <p className="article-text">some distances aren't about the miles. they're about the decision behind them, made on instinct rather than calculation, where the act of taking action proves what planning never could: that feeling can be trusted as much as logic. not because the destination or the outcome is necessarily better, but because the leap itself reveals a capacity for self-trust that most people never test.</p>
        </div>
      </div>

      {/* ─── YOU ALREADY KNOW ─── */}
      <div className="article" id="you-already-know">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">You already know</h1>
          <p className="article-text">indecision is rarely the absence of a preference. somewhere beneath the noise of opinions and the fear of being wrong, there is already a direction. most people can feel it, even when they refuse to name it. the hard part is not figuring out what to do. it is finding the nerve to admit that you already know.</p>
        </div>
      </div>

      {/* ─── PROMPTING PEOPLE ─── */}
      <div className="article" id="prompting-people">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">Prompting People</h1>
          <p className="article-text">most social products are built around ephemerality. click and scroll until you (maybe) find something interesting, move on. prompting people is built around the opposite instinct: sitting still as a feature, not a flaw.</p>
          <p className="article-text" style={{ marginTop: "1.5rem" }}>the core mechanic is simple. one prompt at a time. written by humans for humans. you write your response before you can read anyone else's. the feed only opens after you've contributed something unique to you.</p>
          <p className="article-text" style={{ marginTop: "1.5rem" }}>prompting people is a space where the act of writing before reading restores something that most platforms have mechanistically eroded.</p>
          <p className="article-text" style={{ marginTop: "1.5rem" }}>in the final stages of development.</p>
        </div>
      </div>

      {/* ─── DEBUT SOLO ALBUM ─── */}
      <div className="article" id="album-01_wip-unmixed">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">album-01_wip-unmixed</h1>
          <p className="article-text">while the <a href="https://music.apple.com/us/artist/lyla-minor/1753837557" target="_blank" rel="noopener" style={{ color: "inherit" }}>lyla minor</a> work was collaborative, arranged, negotiated, this project is more exposed. what started as a fragmented labor of love has slowly taken shape into a story that wants to be told.</p>
          <p className="article-text" style={{ marginTop: "1.5rem" }}>no title yet, no release date beyond 2026. ~13 songs, welcomed and nurtured as they arrive.</p>
        </div>
      </div>

      {/* ─── RESUME ─── */}
      <div className="article" id="resume">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">Resume</h1>

          <div className="resume-timeline">
            <div className="resume-tl-entry">
              <p className="resume-tl-date">2024 –</p>
              <div>
                <p className="resume-tl-role">Lead Designer</p>
                <p className="resume-tl-company">NumberOne AI</p>
                <p className="resume-tl-desc">Leading brand, website, and marketing design for <a href="https://wethos.ai/" target="_blank" rel="noopener" style={{ color: "inherit" }}>WethosAI</a> and <a href="https://numberone.ai/" target="_blank" rel="noopener" style={{ color: "inherit" }}>NumberOne AI</a>, shipping AI-forward websites and campaigns built from scratch. Leveraging emerging tools and systems to move fast, experiment boldly, and define the company's creative edge.</p>
              </div>
            </div>

            <div className="resume-tl-entry">
              <p className="resume-tl-date">2021 – 24</p>
              <div>
                <p className="resume-tl-role">Designer <span className="role-slash">/</span> Marketing Lead</p>
                <p className="resume-tl-company">Cascade Mountain Tech</p>
                <p className="resume-tl-desc">Led brand, website, and marketing design across digital and social channels. Expanded from an initial website and brand refresh into broader creative direction. Produced infographics, marketing assets, and merchandising that amplified reach and strengthened the company's visual presence.</p>
              </div>
            </div>

            <div className="resume-tl-entry">
              <p className="resume-tl-date">Aug '23</p>
              <div>
                <p className="resume-tl-role">Brand Designer (contract)</p>
                <p className="resume-tl-company">Coastline Custom Cabinetry</p>
                <p className="resume-tl-desc">Worked closely with the client to identify the core pillars of their business. Translated those insights into a new brand identity and a newly designed website.</p>
              </div>
            </div>

            <div className="resume-tl-entry">
              <p className="resume-tl-date">2020 – 21</p>
              <div>
                <p className="resume-tl-role">Brand Designer (contract)</p>
                <p className="resume-tl-company">SIPNSAND</p>
                <p className="resume-tl-desc">Strategized key brand elements including company color systems and typeface selection. Created a comprehensive style guide used in presentations to potential investors. Designed multiple exterior concepts for company vans.</p>
              </div>
            </div>

            <div className="resume-tl-entry">
              <p className="resume-tl-date">Jun '19</p>
              <div>
                <p className="resume-tl-role">Marketing <span className="role-slash">/</span> Design Intern</p>
                <p className="resume-tl-company">Ripl, Inc.</p>
                <p className="resume-tl-desc">Created digital content supporting the launch of a new webpage and iOS app. Collaborated with the UX/UI team to help troubleshoot and refine app functionality.</p>
              </div>
            </div>

            <div className="resume-tl-entry">
              <p className="resume-tl-date">2016 – 20</p>
              <div>
                <p className="resume-tl-role">BA Digital Design</p>
                <p className="resume-tl-company">Seattle University</p>
              </div>
            </div>
          </div>

          <div className="resume-footer">
            <p className="resume-footer-label">Proficiencies</p>
            <ul className="resume-skills-list">
              <li>Cursor</li>
              <li>Claude Code</li>
              <li>prototyping</li>
              <li>brand design</li>
              <li>web design</li>
              <li>copywriting</li>
              <li>UI/UX</li>
              <li>typography</li>
              <li>art direction</li>
              <li>whatever the story needs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── PROMPTLOG ─── */}
      <div className="article" id="promptlog">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">Promptlog</h1>
          <p className="promptlog-meta"><span id="promptlogWordCount">—</span> words</p>
          <ol className="promptlog-list" id="promptlogContent">
            {changelog.map((entry, i) => (
              <li key={i} className="promptlog-entry"><p>{entry}</p></li>
            ))}
          </ol>
        </div>
      </div>

      {/* ─── DREAMS ─── */}
      <div className="article" id="dreams">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">Dreams</h1>

          {[
            { slug: "guillotine-dream", phrase: "manual guillotine.", date: "2026.04.04", sizes: [800, 1600, 2400] },
            { slug: "fire-dream", phrase: "setting fire to pine.", date: "2026.04.02", sizes: [800, 1600, 2400] },
            { slug: "flight-dream", phrase: "a flight not taken.", date: "2026.03.30", sizes: [800, 1600, 2400] },
            { slug: "sent-adrift", phrase: "what was long stored, sent adrift.", date: "2026.03.27", sizes: [800, 1600, 2400] },
            { slug: "rabbit-hunters-dream", phrase: "hunting the hare.", date: "2026.02.14", sizes: [800, 1600, 2400] },
            { slug: "seating-dream", phrase: "seating derangement.", date: "2026.02.10", sizes: [800, 1232] },
            { slug: "culinary-dream", phrase: "culinary clutter.", date: "2026.01.24", sizes: [800, 1600, 2400] },
            { slug: "field-mentorship-dream", phrase: "field mentorship.", date: "2026.01.18", sizes: [800, 1600, 2400] },
          ].map((d) => {
            const avifSrcSet = d.sizes.map((s) => `/optimized/${d.slug}-${s}.avif ${s}w`).join(", ");
            const webpSrcSet = d.sizes.map((s) => `/optimized/${d.slug}-${s}.webp ${s}w`).join(", ");
            const isSeating = d.slug === "seating-dream";
            return (
              <div className="dream-entry" key={d.slug}>
                <div className="dream-sketch">
                  <picture>
                    <source type="image/avif" srcSet={avifSrcSet} sizes="(max-width: 768px) 100vw, 700px" />
                    <source type="image/webp" srcSet={webpSrcSet} sizes="(max-width: 768px) 100vw, 700px" />
                    <img src={`/${d.slug}.png`} alt="dream sketch" width={isSeating ? 1232 : 2464} height={isSeating ? 928 : 1856} loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
                  </picture>
                </div>
                <div className="dream-meta">
                  <span className="dream-phrase">{d.phrase}</span>
                  <span className="dream-date">{d.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── MURMUR (THEMES) ─── */}
      <div className="article" id="themes">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="murmur-field" id="murmurField"></div>
      </div>

      {/* ─── MAGIC IS EARNED ─── */}
      <div className="article" id="magic-is-earned">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">Magic is earned</h1>
          <p className="article-text">there is magic that exists in this world. it reveals itself through relentless dedication to craft, to honesty, to whatever form love takes in the work. the technical and the spiritual are not in conflict. the people doing the most interesting things tend to hold both without flinching and without needing to reconcile them. each makes the other more real.</p>
        </div>
      </div>

      {/* ─── BIO ─── */}
      <div className="article" id="bio">
        <div className="article-nav"><button className="back-btn" data-close><span>Back</span></button></div>
        <div className="article-body">
          <h1 className="article-title">Bio</h1>
          <p className="article-text"><b>alden huschle</b> is a musician, designer, and creative technologist based in long beach, california. he is the lead designer at numberone ai, a california-based startup incubator, and an independent solo recording artist.</p>
          <p className="article-text">his work spans songwriting, music production, product design, and brand design. he holds the technical and the spiritual as complementary rather than opposed, building with advanced ai tools professionally while maintaining an intentionally grounded musical practice.</p>
        </div>
      </div>
    </div>
  );
}
