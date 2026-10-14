/** Distances are scene metres and speeds are metres per second. */
export function targetDrivingSpeed(curvature: number, grade: number, readingFactor = 1): number {
  const cornerLimit = Math.sqrt(3.2 / Math.max(Math.abs(curvature), .001));
  const cruise = Math.max(5, Math.min(14, 11 - grade * 7));
  return Math.max(3, Math.min(cruise, cornerLimit) * readingFactor);
}
export function approachDrivingSpeed(current: number, target: number, dt: number): number {
  const limit = (target < current ? 4.5 : 2.2) * Math.max(0, dt);
  return current + Math.max(-limit, Math.min(limit, target - current));
}
