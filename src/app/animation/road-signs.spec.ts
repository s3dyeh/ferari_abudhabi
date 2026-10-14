import { describe, expect, it } from 'vitest';
import { ROAD_SIGN_PROGRESS, signApproachSpeed } from './road-signs';

describe('Road sign reading pace', () => {
  it('slows before a sign and resumes after passing it', () => {
    const sign = ROAD_SIGN_PROGRESS[0];
    expect(signApproachSpeed(sign - .03)).toBeLessThan(1);
    expect(signApproachSpeed(sign + .01)).toBe(1);
  });
  it('slows for the first sign across the track seam', () => {
    expect(signApproachSpeed(.99)).toBeLessThan(1);
  });
});
