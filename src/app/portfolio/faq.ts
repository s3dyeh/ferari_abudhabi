import { Component } from '@angular/core';
import { FAQS } from '../faq.data';
@Component({
  selector: 'app-faq',
  template: `<section id="faq" aria-labelledby="faq-title">
    <p class="eyebrow">Before we get started</p><h2 id="faq-title">Frequently asked questions</h2>
    @for (faq of faqs; track faq.question) {
      <details><summary>{{ faq.question }}<span aria-hidden="true">+</span></summary><p>{{ faq.answer }}</p></details>
    }
    <p class="contact">Have a different question? <a href="mailto:s3dyeh00@gmail.com">Let’s talk about your project.</a></p>
  </section>`,
  styles: `:host { display: block; margin-top: 64px; } section { border-top: 1px solid var(--line); padding-top: 40px; scroll-margin-top: 100px; }
    .eyebrow { color: var(--accent); font-size: 11px; text-transform: uppercase; letter-spacing: .13em; }
    h2 { font-size: clamp(26px,4vw,36px); font-weight: 450; letter-spacing: -.035em; margin: 12px 0 28px; }
    details { border-bottom: 1px solid var(--line); } summary { display: flex; justify-content: space-between; align-items: center; gap: 24px; min-height: 64px; padding: 18px 0; cursor: pointer; list-style: none; font-size: 16px; line-height: 1.5; }
    summary::-webkit-details-marker { display: none; } summary span { color: var(--accent); font-size: 24px; } details[open] summary span { transform: rotate(45deg); }
    summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
    p { max-width: 800px; font-size: 15px; line-height: 1.85; color: var(--muted); margin: 0 0 24px; }
    .contact { margin-top: 24px; } a { display: inline-block; min-height: 44px; color: var(--accent); text-underline-offset: 4px; }
  `,
})
export class Faq { readonly faqs = FAQS; }
