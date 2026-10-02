import { describe, expect, it, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AmmanClock, formatAmmanTime } from './amman-clock';

afterEach(() => {
  TestBed.resetTestingModule();
  vi.useRealTimers();
});
describe('Amman clock', () => {
  it('uses Amman time rather than the input timestamp offset', () => {
    expect(formatAmmanTime(new Date('2026-10-02T10:00:00-07:00')).time).toBe('20:00:00');
  });
  it('changes the weekday and date at Amman midnight', () => {
    expect(formatAmmanTime(new Date('2026-10-02T20:59:59Z'))).toEqual({
      time: '23:59:59',
      date: 'Friday, 2 October 2026',
    });
    expect(formatAmmanTime(new Date('2026-10-02T21:00:00Z'))).toEqual({
      time: '00:00:00',
      date: 'Saturday, 3 October 2026',
    });
  });
  it('ticks, refreshes after visibility changes, and disposes its timer', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-02T20:59:59Z'));
    const fixture = TestBed.createComponent(AmmanClock);
    expect(fixture.componentInstance.current().time).toBe('23:59:59');
    vi.advanceTimersByTime(1000);
    expect(fixture.componentInstance.current().time).toBe('00:00:00');
    vi.setSystemTime(new Date('2026-10-03T09:00:00Z'));
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(fixture.componentInstance.current().time).toBe('12:00:00');
    fixture.destroy();
    expect(vi.getTimerCount()).toBe(0);
  });
});
