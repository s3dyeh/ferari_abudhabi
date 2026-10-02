import * as THREE from 'three';

/** A closed, arc-length sampled path: endpoint and tangent agree across the seam. */
export function createTrackCurve(): THREE.CatmullRomCurve3 {
  const points = [
    [-65, 12, 18],
    [-50, 18, 48],
    [-6, 12, 59],
    [38, 14, 42],
    [61, 28, 8],
    [43, 44, -30],
    [5, 35, -49],
    [-35, 16, -36],
    [-17, 10, -8],
    [15, 18, 8],
    [5, 29, 29],
    [-29, 26, 21],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal');
  curve.arcLengthDivisions = 1800;
  return curve;
}

export function advanceProgress(progress: number, seconds: number, speed = 0.018): number {
  return (progress + Math.max(0, Math.min(seconds, 0.05)) * speed) % 1;
}

export function groundHeight(x: number, z: number): number {
  const outside = THREE.MathUtils.smoothstep(Math.hypot(x, z), 75, 180);
  return -2 + outside * (9 + Math.sin(x * 0.019 + z * 0.008) * 7 + Math.cos(z * 0.022) * 5);
}
