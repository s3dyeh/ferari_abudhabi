import { DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { App } from './app';

describe('Portfolio experience', () => {
  beforeEach(async () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
    };
    await TestBed.configureTestingModule({
      imports: [App],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    }).compileComponents();
  });
  afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); });

  it('opens the portfolio from the sun and restores focus on dismissal', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const sun = root.querySelector<HTMLButtonElement>('app-sun-button button')!;
    sun.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.portfolioOpen()).toBe(true);
    expect(root.querySelector('dialog')?.hasAttribute('open')).toBe(true);
    root.querySelector<HTMLButtonElement>('.close-button')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.portfolioOpen()).toBe(false);
    expect(root.querySelector('dialog')?.hasAttribute('open')).toBe(false);
  });

  it('keeps ride mode when opening and closing work', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    fixture.componentInstance.selectMode('ride');
    fixture.componentInstance.openPortfolio();
    fixture.componentInstance.closePortfolio();
    expect(fixture.componentInstance.mode()).toBe('ride');
  });

  it('passes ride mode to the sun', () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.selectMode('ride');
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('app-sun-button')?.classList.contains('is-riding')).toBe(true);
    expect(root.querySelector('.pause-control, .precision-control')).toBeNull();
    fixture.componentInstance.selectMode('overview');
    fixture.detectChanges();
    expect(root.querySelector('app-sun-button')?.classList.contains('is-riding')).toBe(false);
  });

  it('retains reduced-motion preference for interface transitions', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance.reducedMotion()).toBe(true);
  });

  it('starts animation after three seconds without a motion toggle', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.motion-toggle')).toBeNull();
    expect(root.querySelector('app-neural-art')).toBeNull();
    vi.advanceTimersByTime(2999);
    expect(fixture.componentInstance.animationReady()).toBe(false);
    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(fixture.componentInstance.animationReady()).toBe(true);
  });

  it('cancels startup when leaving the page before three seconds', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(App);
    fixture.destroy();
    vi.advanceTimersByTime(3000);
    expect(fixture.componentInstance.animationReady()).toBe(false);
  });

  it('allows portfolio access when the renderer fails', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    fixture.componentInstance.sceneStatus.set('fallback');
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('[role="status"]')?.textContent).toContain('portfolio is ready');
    root.querySelector<HTMLButtonElement>('app-sun-button button')!.click();
    expect(fixture.componentInstance.portfolioOpen()).toBe(true);
  });
});
