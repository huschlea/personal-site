"use client";

/* Below the desktop breakpoint the page is a single line and a way out.
   Nothing else mounts: not the canvas, not the classic view. */

export function DesktopGate() {
  return (
    <div className="site-ds ds-gate">
      <div className="ds-gate-inner">
        <p>This page is intended for desktop view only.</p>
        {/* back to the page they came from, if that page was this site;
            home otherwise, which is where a cold arrival wants to land
            anyway. Checking the referrer rather than history length keeps
            a cold tab from stepping back onto a blank entry. */}
        <a
          href="/"
          className="ds-gate-back"
          onClick={(e) => {
            const from = document.referrer;
            const same = !!from && new URL(from).origin === window.location.origin;
            if (same && window.history.length > 1) {
              e.preventDefault();
              window.history.back();
            }
          }}
        >Go back</a>
      </div>
    </div>
  );
}
