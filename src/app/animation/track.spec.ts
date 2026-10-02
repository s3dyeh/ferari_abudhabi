import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { advanceProgress, createTrackCurve } from './track';

describe('Coaster path and time', () => {
  it('closes with a continuous tangent and no mutated sample vectors', () => {
    const curve = createTrackCurve();
    expect(curve.getPointAt(0).distanceTo(curve.getPointAt(1))).toBeLessThan(0.001);
    expect(curve.getTangentAt(0).dot(curve.getTangentAt(1))).toBeGreaterThan(0.999);
    const point = curve.getPointAt(0.4, new Vector3());
    const before = point.clone();
    curve.getTangentAt(0.4);
    expect(point.equals(before)).toBe(true);
    for (let i = 0; i <= 100; i++) {
      const tangent = curve.getTangentAt(i / 100);
      expect(Number.isFinite(tangent.x + tangent.y + tangent.z)).toBe(true);
      expect(tangent.length()).toBeCloseTo(1);
    }
  });
  it('moves the same distance at 30, 60 and 120 frames per second', () => {
    const result = (fps: number) => {
      let progress = 0;
      for (let i = 0; i < fps * 10; i++) progress = advanceProgress(progress, 1 / fps);
      return progress;
    };
    expect(result(30)).toBeCloseTo(result(60), 8);
    expect(result(120)).toBeCloseTo(result(60), 8);
  });
  it('bounds long frame gaps and wraps without leaving the curve', () => {
    expect(advanceProgress(0.9999, 4)).toBeGreaterThanOrEqual(0);
    expect(advanceProgress(0.9999, 4)).toBeLessThan(0.001);
    expect(advanceProgress(0.5, -1)).toBe(0.5);
  });
});
