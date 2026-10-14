import { Seo } from './seo';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { SocialLinks } from './social-links';
import { ArrowIcon } from './arrow-icon';
import { AmmanTheme } from './clock/amman-theme';
import { Component, DestroyRef, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { Animation } from './animation/animation';
import { AmmanClock } from './clock/amman-clock';
import { Portfolio } from './portfolio/portfolio';
import { SunButton } from './sun/sun-button';

@Component({
  selector: 'app-experience',
  imports: [ SocialLinks, ArrowIcon, Animation, AmmanClock, Portfolio, SunButton],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly theme = inject(AmmanTheme);
  @ViewChild('portfolioDialog') private dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild(SunButton) private sun!: SunButton;
  readonly mode = signal<'overview' | 'ride'>('overview');
  readonly portfolioOpen = signal(false);
  readonly sceneStatus = signal<'loading' | 'ready' | 'fallback'>('loading');
  readonly reducedMotion = signal(false);
  readonly animationReady = signal(false);
  readonly revealOrigin = signal('78% 32%');

  constructor() {
    inject(Seo).setPage();
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion.set(preference.matches);
    const update = () => {
      this.reducedMotion.set(preference.matches);
    };
    preference.addEventListener('change', update);
    const startAnimation = window.setTimeout(() => this.animationReady.set(true), 3000);
    inject(DestroyRef).onDestroy(() => {
      window.clearTimeout(startAnimation);
      preference.removeEventListener('change', update);
    });
  }

  openPortfolio(): void {
    const rect = this.sun.button.nativeElement.getBoundingClientRect();
    this.revealOrigin.set(`${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`);
    this.portfolioOpen.set(true);
    this.dialog.nativeElement.showModal();
  }

  closePortfolio(): void {
    this.dialog.nativeElement.close();
    this.onDialogClosed();
  }

  onDialogClosed(): void {
    if (!this.portfolioOpen()) return;
    this.portfolioOpen.set(false);
    this.sun.focus();
  }

  containDialogFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const items = Array.from(
      this.dialog.nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], summary, [tabindex="0"]',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    const first = items[0],
      last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  selectMode(mode: 'overview' | 'ride'): void {
    this.mode.set(mode);
  }
}
