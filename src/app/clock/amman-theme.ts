import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';

const hourFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Amman', hour: '2-digit', hourCycle: 'h23',
});

/** Fixed local schedule: daylight from 06:00 inclusive to 18:00 exclusive. */
export function isAmmanNight(date: Date): boolean {
  const hour = Number(hourFormat.format(date));
  return hour < 6 || hour >= 18;
}

@Injectable({ providedIn: 'root' })
export class AmmanTheme {
  readonly night = signal(isAmmanNight(new Date()));
  private readonly document = inject(DOCUMENT);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const update = () => {
      const night = isAmmanNight(new Date());
      this.night.set(night);
      this.document.documentElement.dataset['theme'] = night ? 'night' : 'day';
      this.document.querySelector('meta[name="theme-color"]')?.setAttribute(
        'content', night ? '#171f2b' : '#efe6d8',
      );
    };
    update();
    const timer = window.setInterval(update, 1000);
    const visible = () => { if (!this.document.hidden) update(); };
    this.document.addEventListener('visibilitychange', visible);
    inject(DestroyRef).onDestroy(() => {
      window.clearInterval(timer);
      this.document.removeEventListener('visibilitychange', visible);
    });
  }
}
