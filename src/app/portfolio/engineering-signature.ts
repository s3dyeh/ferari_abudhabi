import { Component } from '@angular/core';
import { ENGINEERING_THEMES } from '../engineering-themes';
@Component({
  selector: 'app-engineering-signature',
  template: `<section aria-labelledby="signature-title">
    <div class="signature-intro">
      <p class="eyebrow">The way I think</p>
      <h2 id="signature-title">The interesting part is<br /><em>between the pieces.</em></h2>
      <p>A slow query can look like a broken interface. A useful AI feature depends on the knowledge behind it. A good idea still needs a path to production.</p>
      <p>That’s the work I’m drawn to: following a problem across the layers, finding the connection, and making the whole system work better.</p>
    </div>
    <div class="themes">
      @for (theme of themes; track theme.name) {
        <article><p class="number">0{{ $index + 1 }} / {{ theme.name }}</p>
          <h3>{{ theme.phrase }}</h3><p>{{ theme.description }}</p>
          <ul aria-label="Relevant technologies and capabilities">@for (keyword of theme.keywords; track keyword) { <li>{{ keyword }}</li> }</ul>
        </article>
      }
    </div>
    <p class="learning">Still learning, always connecting. <span>Currently studying cloud security, compliance and governance.</span></p>
  </section>`,
  styles: `:host { display: block; margin: 48px 0 64px; }
    section { border-top: 1px solid var(--line); padding-top: 40px; }
    .signature-intro { max-width: 720px; }
    .eyebrow, .number { color: var(--accent); font-size: 11px; text-transform: uppercase; letter-spacing: .12em; }
    h2 { font-size: clamp(30px, 4vw, 48px); line-height: 1.1; font-weight: 450; letter-spacing: -.045em; margin: 16px 0 24px; }
    em { font-style: normal; color: var(--accent); }
    p { font-size: 15px; line-height: 1.85; color: var(--muted); }
    .themes { display: grid; grid-template-columns: 1fr 1fr; column-gap: 48px; margin-top: 32px; }
    article { padding: 24px 0; border-top: 1px solid var(--line); }
    h3 { margin: 12px 0; font-size: 22px; font-weight: 500; letter-spacing: -.03em; }
    ul { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; margin-top: 18px; }
    li { background: var(--surface); color: var(--ink); padding: 5px 9px; border-radius: 5px; font-size: 12px; }
    .learning { border-top: 1px solid var(--line); padding-top: 24px; color: var(--ink); font-size: 13px; }
    .learning span { display: block; color: var(--muted); }
    @media(max-width:650px) { .themes { grid-template-columns: 1fr; } }
  `,
})
export class EngineeringSignature { readonly themes = ENGINEERING_THEMES; }
