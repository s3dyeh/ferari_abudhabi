import { Component } from '@angular/core';
import { faLinkedinIn, faGithub, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-social-links',
  template: `<nav aria-label="Social profiles and email">
    @for (link of links; track link.label) {
      <a [href]="link.url" target="_blank" rel="noopener noreferrer"
        [attr.aria-label]="link.label + ' (opens in a new tab)'" [attr.title]="link.label + ' / s3dyeh'">
        <svg [attr.viewBox]="'0 0 ' + link.icon.icon[0] + ' ' + link.icon.icon[1]" aria-hidden="true" focusable="false">
          <path [attr.d]="link.icon.icon[4]" />
        </svg>
      </a>
    }
    <a href="mailto:s3dyeh00@gmail.com" aria-label="Email Ahmad at s3dyeh00@gmail.com" title="s3dyeh00@gmail.com">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
      </svg>
    </a>
  </nav>`,
  styles: `:host { display: block; } nav { display: flex; flex-wrap: wrap; gap: 8px; }
    a { position: relative; display: grid; place-items: center; width: 44px; height: 44px;
      border: 1px solid var(--line); border-radius: 50%; color: var(--muted); background: var(--paper);
      transition: color 200ms, border-color 200ms, transform 200ms; }
    a:hover, a:focus-visible { color: var(--accent); border-color: var(--accent); transform: translateY(-3px); }
    svg { width: 17px; height: 17px; fill: currentColor; }
    @media (prefers-reduced-motion: reduce) { a { transition: none; } }`,
})
export class SocialLinks {
  readonly links = [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/s3dyeh/', icon: faLinkedinIn },
    { label: 'GitHub', url: 'https://github.com/s3dyeh', icon: faGithub },
    { label: 'Instagram', url: 'https://www.instagram.com/s3dyeh/', icon: faInstagram },
    { label: 'Facebook', url: 'https://www.facebook.com/s3dyeh', icon: faFacebookF },
  ];
}
