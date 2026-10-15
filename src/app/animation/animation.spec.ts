import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Animation } from './animation';
import { AnimationService } from './animation.service';

describe('Hold-to-brake controls', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('brakes on press and releases on cancellation, capture loss, or window blur', async () => {
    const scene = {
      initialize: vi.fn().mockResolvedValue(undefined),
      setNight: vi.fn(), setMode: vi.fn(), setPaused: vi.fn(),
      setPointer: vi.fn(), resetPointer: vi.fn(), setBraking: vi.fn(),
      resize: vi.fn(), dispose: vi.fn(),
    };
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    });
    TestBed.configureTestingModule({ imports: [Animation] });
    TestBed.overrideComponent(Animation, {
      set: { providers: [{ provide: AnimationService, useValue: scene }] },
    });
    const fixture = TestBed.createComponent(Animation);
    fixture.detectChanges();
    await fixture.whenStable();
    const canvas = fixture.nativeElement.querySelector('canvas') as HTMLCanvasElement;
    canvas.setPointerCapture = vi.fn();
    const pointer = (type: string, id = 1) => {
      const event = new Event(type);
      Object.assign(event, { pointerId: id, isPrimary: id === 1, button: 0, clientX: 10, clientY: 10 });
      canvas.dispatchEvent(event);
    };
    for (const release of ['pointerup', 'pointercancel', 'lostpointercapture', 'blur']) {
      pointer('pointerdown');
      expect(scene.setBraking).toHaveBeenLastCalledWith(true);
      pointer('pointerup', 2);
      expect(scene.setBraking).toHaveBeenLastCalledWith(true);
      if (release === 'blur') window.dispatchEvent(new Event('blur'));
      else pointer(release);
      expect(scene.setBraking).toHaveBeenLastCalledWith(false);
    }
    fixture.destroy();
    scene.setBraking.mockClear();
    window.dispatchEvent(new Event('blur'));
    expect(scene.setBraking).not.toHaveBeenCalled();
  });
});
