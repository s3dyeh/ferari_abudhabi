import { Component } from '@angular/core';

@Component({
  selector: 'app-intelligence-story',
  template: `<section aria-labelledby="intelligence-title">
    <div class="story-heading"><p class="kicker">A little intelligence. A lot of intention.</p>
      <h2 id="intelligence-title">From information<br />to <em>understanding.</em></h2>
      <p>Useful AI starts with the right connections. Your knowledge, a reasoning layer, and the systems people already use.</p>
    </div>
    <div class="pipeline">
      <article><svg viewBox="0 0 200 125" aria-hidden="true"><path class="wire" d="M35 25H85V60H160M35 60H160M35 95H85V60" />
        <rect x="16" y="12" width="38" height="26" rx="5" /><rect x="16" y="47" width="38" height="26" rx="5" /><rect x="16" y="82" width="38" height="26" rx="5" />
        <circle cx="160" cy="60" r="19" /><path d="m151 60 6 6 12-13" /></svg>
        <span>01 / CONTEXT</span><h3>Connect the knowledge.</h3><p>Documents and data become grounded, searchable context.</p></article>
      <article><svg viewBox="0 0 200 125" aria-hidden="true"><path class="wire" d="m35 22 65 18 65-18M35 62l65-22 65 22M35 102l65-62M35 22l65 62 65-62M35 62l65 22 65-22M35 102l65-18 65 18" />
        <circle cx="35" cy="22" r="7" /><circle cx="35" cy="62" r="7" /><circle cx="35" cy="102" r="7" /><circle cx="100" cy="40" r="10" /><circle cx="100" cy="84" r="10" /><circle cx="165" cy="22" r="7" /><circle cx="165" cy="62" r="7" /><circle cx="165" cy="102" r="7" /></svg>
        <span>02 / REASONING</span><h3>Make sense of it.</h3><p>LLMs and retrieval turn relevant context into useful answers.</p></article>
      <article><svg viewBox="0 0 200 125" aria-hidden="true"><rect x="25" y="15" width="150" height="94" rx="9" /><path d="M25 37h150M42 55h50M42 68h70M42 81h38" /><circle cx="141" cy="74" r="19" /><path d="m132 74 6 6 12-13" /></svg>
        <span>03 / ACTION</span><h3>Put it to work.</h3><p>Assistants and agents connect to real workflows and applications.</p></article>
    </div>
  </section>`,
  styles: `:host { display: block; margin: 16px 0 72px; }
    section { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 40px 0; }
    .story-heading { display: grid; grid-template-columns: 1.1fr 1fr; gap: 8px 40px; align-items: end; }
    .kicker { grid-column: 1 / -1; color: var(--accent); font-size: 11px; text-transform: uppercase; letter-spacing: .12em; }
    h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 450; letter-spacing: -.045em; line-height: 1.1; margin: 8px 0; }
    em { color: var(--accent); font-style: normal; }
    p { color: var(--muted); font-size: 14px; line-height: 1.8; }
    .pipeline { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; margin-top: 30px; }
    svg { display: block; width: 100%; height: 140px; stroke: var(--neural); fill: var(--paper); stroke-width: 1.5; }
    .wire { fill: none; opacity: .55; }
    article span { display: block; color: var(--accent); font-size: 10px; letter-spacing: .12em; margin-top: 20px; }
    h3 { font-size: 18px; font-weight: 500; letter-spacing: -.025em; margin: 12px 0 0; }
    @media(max-width:650px) { .story-heading, .pipeline { grid-template-columns: 1fr; } .pipeline { gap: 24px; } article { border-top: 1px solid var(--line); padding-top: 16px; } svg { height: 120px; } }
  `,
})
export class IntelligenceStory {}
