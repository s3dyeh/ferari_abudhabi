import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AmmanTheme } from './amman-theme';
import { Component, DestroyRef, inject, signal } from '@angular/core';
const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Amman',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Amman',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
export function formatAmmanTime(date: Date) {
  return { time: timeFormat.format(date), date: dateFormat.format(date) };
}
@Component({
  selector: 'app-amman-clock',
  template: `<aside aria-label="Current time in Amman" aria-live="off">
    <div class="time-row">
      <span class="city">Amman</span><time>{{ current().time }}</time>
    </div>
    <p>{{ current().date }}</p><span class="period">{{ theme.night() ? 'Night in Amman' : 'Day in Amman' }} &middot; Auto theme</span>
  </aside>`,
  styles: `
    .period { display: block; margin-top: 8px; font-size: 10px; color: var(--accent); }
    aside {
      text-align: right;
      color: var(--ink);
    }
    .time-row {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      align-items: baseline;
    }
    .city {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }
    time {
      font-size: 19px;
      font-weight: 400;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
      min-width: 78px;
    }
    p {
      margin: 7px 0 0;
      font-size: 10px;
      min-width: 185px;
      color: var(--muted);
    }
    @media (max-width: 600px) {
      .time-row {
        gap: 7px;
      }
      .city {
        font-size: 8px;
      }
      time {
        font-size: 14px;
        min-width: 58px;
      }
      p {
        font-size: 8px;
        min-width: 135px;
        margin-top: 5px;
      }
    }
  `,
})
export class AmmanClock {
  readonly theme = inject(AmmanTheme);
  readonly current = signal(formatAmmanTime(new Date()));
  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const update = () => this.current.set(formatAmmanTime(new Date()));
    const timer = window.setInterval(update, 1000);
    const visible = () => {
      if (!document.hidden) update();
    };
    document.addEventListener('visibilitychange', visible);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', visible);
    });
  }
}
