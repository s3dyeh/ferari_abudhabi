import { Component } from '@angular/core';
import { ArrowIcon } from '../arrow-icon';

@Component({
  selector: 'app-certifications',
  imports: [ArrowIcon],
  template: `<section id="certifications" aria-labelledby="certifications-title">
    <div class="heading"><div><p class="eyebrow">Continuing to sharpen the craft</p><h2 id="certifications-title">Certifications</h2></div><p>Explore the credentials.</p></div>
    <div class="credentials">
      @for (certificate of certificates; track certificate.url) {
        <a [href]="certificate.url" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 32 40" aria-hidden="true" focusable="false"><path d="M8 24 5 37l11-5 11 5-3-13" /><circle cx="16" cy="15" r="12" /><path d="m10 15 4 4 8-9" /></svg>
          <span><span class="issuer">{{ certificate.issuer }}</span><strong>{{ certificate.title }}</strong><span class="verify">View certificate <span class="sr-only">(opens in a new tab)</span></span></span>
          <app-arrow-icon />
        </a>
      }
    </div>
  </section>`,
  styles: `:host { display: block; margin-top: 64px; }
    section { padding-top: 40px; border-top: 1px solid var(--line); }
    .heading { display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-bottom: 28px; }
    .eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: 11px; color: var(--accent); }
    h2 { margin: 12px 0 0; font-size: 32px; font-weight: 450; letter-spacing: -.035em; }
    .heading > p { color: var(--muted); font-size: 13px; }
    .credentials { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    a { display: flex; align-items: center; gap: 20px; padding: 24px; border: 1px solid var(--line); border-radius: 10px; text-decoration: none; color: var(--ink); }
    a:hover { border-color: var(--accent); background: var(--surface); }
    svg { width: 32px; height: 40px; flex: none; fill: none; stroke: var(--accent); stroke-width: 1.5; }
    a > span { flex: 1; }
    .issuer, .verify { display: block; font-size: 12px; color: var(--muted); }
    strong { display: block; font-size: 16px; font-weight: 500; line-height: 1.5; margin: 6px 0 10px; }
    .verify { color: var(--accent); }
    @media(max-width:650px) { .credentials { grid-template-columns: 1fr; } .heading > p { display: none; } a { padding: 20px; } }
  `,
})
export class Certifications {
  readonly certificates = [
    { issuer: 'Certificates.dev', title: 'Certified Junior Angular Developer', url: 'https://certificates.dev/angular/certificates/a1b458be-af97-46b5-989f-ef23c100fbaf' },
    { issuer: 'SCRUMstudy', title: 'Scrum Fundamentals Certified (SFC)', url: 'https://www.scrumstudy.com/certification/verify?type=SFC&number=1144567' },
    { issuer: 'HackerRank', title: 'Rest API (Intermediate)', url: 'https://www.hackerrank.com/certificates/04b6e8fe3bf9' },
    { issuer: 'HackerRank', title: 'JavaScript (Intermediate)', url: 'https://www.hackerrank.com/certificates/422d16d45a73' },
    { issuer: 'HackerRank', title: 'Angular (Intermediate)', url: 'https://www.hackerrank.com/certificates/6742297293d2' },
  ];
}
