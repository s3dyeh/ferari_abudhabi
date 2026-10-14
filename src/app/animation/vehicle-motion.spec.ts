import { describe, expect, it } from 'vitest';
import { approachDrivingSpeed, targetDrivingSpeed } from './vehicle-motion';

describe('Driving dynamics', () => {
  it('brakes for tight bends and climbs more slowly than descents', () => {
    expect(targetDrivingSpeed(.1, 0)).toBeLessThan(targetDrivingSpeed(.005, 0));
    expect(targetDrivingSpeed(.001, .4)).toBeLessThan(targetDrivingSpeed(.001, -.4));
  });
  it('limits acceleration and braking instead of snapping to a new speed', () => {
    expect(approachDrivingSpeed(0, 12, .1)).toBeCloseTo(.22);
    expect(approachDrivingSpeed(12, 3, .1)).toBeCloseTo(11.55);
    expect(approachDrivingSpeed(10, 10.01, .1)).toBe(10.01);
  });
  it('accelerates consistently at different update rates', () => {
    const simulate = (rate: number) => {
      let speed = 0;
      for (let i = 0; i < rate * 3; i++) speed = approachDrivingSpeed(speed, 12, 1 / rate);
      return speed;
    };
    expect(simulate(60)).toBeCloseTo(simulate(120), 8);
  });
});
