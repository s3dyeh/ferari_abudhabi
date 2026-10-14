import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AmmanTheme, isAmmanNight } from './amman-theme';

afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); });
describe('Amman theme', () => {
  it.each([
    ['2026-10-14T02:59:59Z', true],
    ['2026-10-14T03:00:00Z', false],
    ['2026-10-14T14:59:59Z', false],
    ['2026-10-14T15:00:00Z', true],
    ['2026-10-14T21:00:00Z', true],
  ])('uses Amman day/night boundaries for %s', (date, expected) => {
    expect(isAmmanNight(new Date(date))).toBe(expected);
  });
  it('updates across sunset, refreshes on return, and cleans up', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-14T14:59:59Z'));
    const theme = TestBed.inject(AmmanTheme);
    expect(document.documentElement.dataset['theme']).toBe('day');
    vi.advanceTimersByTime(1000);
    expect(theme.night()).toBe(true);
    expect(document.documentElement.dataset['theme']).toBe('night');
    vi.setSystemTime(new Date('2026-10-15T09:00:00Z'));
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(theme.night()).toBe(false);
    TestBed.resetTestingModule();
    expect(vi.getTimerCount()).toBe(0);
  });
});
