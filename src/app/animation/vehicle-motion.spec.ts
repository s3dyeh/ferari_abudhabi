import { describe, expect, it } from 'vitest';
import { approachDrivingSpeed, targetDrivingSpeed } from './vehicle-motion';

describe('Driving dynamics', () => {
  it('brakes for tight bends and climbs more slowly than descents', () => {
    expect(targetDrivingSpeed(.1, 0)).toBeLessThan(targetDrivingSpeed(.005, 0));
    expect(targetDrivingSpeed(.001, .4)).toBeLessThan(targetDrivingSpeed(.001, -.4));
  });
  it('limits acceleration and braking instead of snapping to a new speed', () => {
    expect(approachDrivingSpeed(0, 12, .1)).toBeCloseTo(.6);
    expect(approachDrivingSpeed(12, 3, .1)).toBeCloseTo(10.8);
    expect(approachDrivingSpeed(10, 10.01, .1)).toBe(10.01);
  });
  it('cruises faster and smoothly brakes while held, then accelerates on release', () => {
    const cruise = targetDrivingSpeed(0, 0);
    expect(cruise).toBe(22);
    const held = targetDrivingSpeed(0, 0, 1, true);
    let speed = cruise;
    for (let i = 0; i < 240; i++) speed = approachDrivingSpeed(speed, held, 1 / 120);
    expect(speed).toBeCloseTo(held);
    expect(speed).toBeGreaterThan(0);
    const released = approachDrivingSpeed(speed, cruise, 1 / 120);
    expect(released).toBeGreaterThan(speed);
    expect(released).toBeLessThan(cruise);
    for (let i = 0; i < 480; i++) speed = approachDrivingSpeed(speed, cruise, 1 / 120);
    expect(speed).toBe(cruise);
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
