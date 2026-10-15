/** Distances are scene metres and speeds are metres per second. */
export function targetDrivingSpeed(curvature: number, grade: number, readingFactor = 1, braking = false): number {
  const cornerLimit = Math.sqrt(10 / Math.max(Math.abs(curvature), .001));
  const cruise = Math.max(10, Math.min(28, 22 - grade * 10));
  const drivingSpeed = Math.max(3, Math.min(cruise, cornerLimit) * readingFactor);
  return braking ? Math.min(3, drivingSpeed * .25) : drivingSpeed;
}
export function approachDrivingSpeed(current: number, target: number, dt: number): number {
  const limit = (target < current ? 12 : 6) * Math.max(0, dt);
  return current + Math.max(-limit, Math.min(limit, target - current));
}
