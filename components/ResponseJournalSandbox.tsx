'use client'

import { useState } from 'react'

const PROMPT_NUMBER = 1
const QUESTION = 'What do you protect that no one asked you to?'
const PLACEHOLDER = 'Take your time. Say what you actually notice.'
const MAX_CHARS = 800

const FONT_SANS = "'Geist', system-ui, -apple-system, sans-serif"
const FONT_MONO = "'Geist Mono', ui-monospace, 'SF Mono', Consolas, monospace"
const FONT_SERIF = "'Newsreader', Georgia, 'Times New Roman', serif"

const COLOR_BORDER = 'rgba(0, 0, 0, 0.08)'
const COLOR_GLASS_BORDER = 'rgba(0, 0, 0, 0.06)'
const COLOR_SURFACE = 'rgba(0, 0, 0, 0.03)'
const COLOR_LOUD = 'rgba(0, 0, 0, 0.88)'
const COLOR_SOFT = 'rgba(0, 0, 0, 0.46)'
const COLOR_FG_03 = 'rgba(26, 26, 31, 0.03)'
const COLOR_FG_10 = 'rgba(26, 26, 31, 0.10)'
const COLOR_FG_12 = 'rgba(26, 26, 31, 0.12)'
const COLOR_FG_40 = 'rgba(26, 26, 31, 0.40)'
const COLOR_FG_80 = 'rgba(26, 26, 31, 0.80)'

const STYLES = `
.rjs-root {
  position: relative;
  border-radius: 12px;
  border: 1px solid ${COLOR_BORDER};
  background: ${COLOR_SURFACE};
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10);
  overflow: hidden;
  height: min(56vh, 480px);
  min-height: 280px;
}
.rjs-spine {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 24px;
  background: ${COLOR_FG_03};
  border-right: 1px solid ${COLOR_GLASS_BORDER};
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rjs-spine-line {
  display: block;
  width: 1px;
  height: 32px;
  background: ${COLOR_FG_10};
  border-radius: 9999px;
}
.rjs-page {
  position: absolute;
  inset: 0;
  left: 24px;
  display: flex;
  flex-direction: column;
}
.rjs-section {
  flex-shrink: 0;
  padding: 0 16px;
}
@media (min-width: 640px) {
  .rjs-section { padding: 0 24px; }
}
.rjs-header {
  padding-top: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${COLOR_GLASS_BORDER};
}
.rjs-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rjs-prompt-label {
  font-family: ${FONT_MONO};
  font-size: 12px;
  color: ${COLOR_SOFT};
}
.rjs-meta-time {
  font-family: ${FONT_SANS};
  font-size: 12px;
  color: ${COLOR_SOFT};
}
.rjs-question {
  margin-top: 6px;
  font-family: ${FONT_SERIF};
  font-style: italic;
  font-size: 14px;
  line-height: 1.375;
  color: ${COLOR_LOUD};
}
.rjs-body-scroll {
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${COLOR_GLASS_BORDER} transparent;
}
.rjs-body-scroll::-webkit-scrollbar {
  width: 6px;
}
.rjs-body-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.rjs-body-scroll::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 9999px;
}
.rjs-body-scroll:hover::-webkit-scrollbar-thumb {
  background: ${COLOR_GLASS_BORDER};
}
.rjs-body-inner {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 16px 16px;
}
@media (min-width: 640px) {
  .rjs-body-inner { padding: 16px 24px; }
}
.rjs-textarea {
  flex: 1 1 0%;
  width: 100%;
  min-height: 120px;
  background: transparent;
  border: 0;
  outline: none;
  resize: none;
  font-family: ${FONT_SANS};
  font-size: 14px;
  line-height: 1.85;
  color: ${COLOR_FG_80};
  padding: 0;
}
.rjs-textarea::placeholder {
  color: ${COLOR_SOFT};
  opacity: 1;
}
.rjs-meta-line {
  margin-top: 16px;
  font-family: ${FONT_SANS};
  font-size: 12px;
  color: ${COLOR_SOFT};
}
.rjs-footer {
  border-top: 1px solid ${COLOR_GLASS_BORDER};
  padding-top: 12px;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rjs-nav-btn {
  font-family: ${FONT_SANS};
  font-size: 12px;
  color: ${COLOR_SOFT};
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  transition: color 200ms;
}
.rjs-nav-btn:hover {
  color: ${COLOR_LOUD};
}
.rjs-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}
.rjs-dot {
  height: 6px;
  border-radius: 9999px;
  display: block;
}
.rjs-dot--active {
  width: 16px;
  background: ${COLOR_FG_40};
}
.rjs-dot--inactive {
  width: 6px;
  background: ${COLOR_FG_12};
}
`

export function ResponseJournalSandbox() {
  const [body, setBody] = useState('')
  const charCount = body.length

  return (
    <>
      <style>{STYLES}</style>
      <div className="rjs-root">
        <div className="rjs-spine">
          <span className="rjs-spine-line" />
        </div>

        <div className="rjs-page">
          <div className="rjs-section rjs-header">
            <div className="rjs-header-row">
              <span className="rjs-prompt-label">
                Prompt {String(PROMPT_NUMBER).padStart(2, '0')}
              </span>
              <span className="rjs-meta-time">just now</span>
            </div>
            <p className="rjs-question">{QUESTION}</p>
          </div>

          <div className="rjs-body-scroll">
            <div className="rjs-body-inner">
              <textarea
                className="rjs-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, MAX_CHARS))}
                placeholder={PLACEHOLDER}
                maxLength={MAX_CHARS}
                aria-label="Write your response"
              />
              <p className="rjs-meta-line">
                {charCount} / {MAX_CHARS} characters · public
              </p>
            </div>
          </div>

          <div className="rjs-section rjs-footer">
            <button type="button" className="rjs-nav-btn">&larr; Prev</button>
            <div className="rjs-dots">
              <span className="rjs-dot rjs-dot--active" />
              <span className="rjs-dot rjs-dot--inactive" />
              <span className="rjs-dot rjs-dot--inactive" />
            </div>
            <button type="button" className="rjs-nav-btn">Next &rarr;</button>
          </div>
        </div>
      </div>
    </>
  )
}
