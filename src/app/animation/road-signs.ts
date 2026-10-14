import * as THREE from 'three';
import { siAngular, siNodedotjs, siNestjs, siTypescript, siPostgresql, siDocker, siGooglecloud } from 'simple-icons';
import { AI_TOOLS } from '../ai-tools';
import { groundHeight } from './track';

const destinations = [
  ...AI_TOOLS,
  { icon: siAngular, name: 'Angular', detail: 'Build with intention', next: 'Interfaces & responsive UI', color: '#f74198', background: '#571535' },
  { icon: siNodedotjs, name: 'Node.js', detail: 'Connect the pieces', next: 'Services & integrations', color: '#80cf59', background: '#183e24' },
  { icon: siNestjs, name: 'NestJS', detail: 'Design for scale', next: 'Backend architecture & APIs', color: '#ff4565', background: '#571425' },
  { icon: siPostgresql, name: 'PostgreSQL', detail: 'Find the bottleneck', next: 'Data & query optimization', color: '#80bce8', background: '#18364d' },
  { icon: siTypescript, name: 'TypeScript', detail: 'Make ideas work', next: 'Typed, maintainable systems', color: '#69b5ff', background: '#123968' },
  { icon: siDocker, name: 'Docker', detail: 'Ready to ship', next: 'Containers & deployment', color: '#43b6ff', background: '#073c77' },
  { icon: siGooglecloud, name: 'Google Cloud', detail: 'Take it to production', next: 'Cloud infrastructure', color: '#fbbc04', background: '#183c68' },
];
export const ROAD_SIGN_PROGRESS = destinations.map((_, index) => (.13 + index / destinations.length) % 1);

/** Slow the approach, giving the visitor time to read without stopping the tour. */
export function signApproachSpeed(progress: number): number {
  const distance = Math.min(...ROAD_SIGN_PROGRESS.map(t => (t - progress + 1) % 1));
  return distance < .065 ? .45 : 1;
}

export function createRoadSigns(curve: THREE.Curve<THREE.Vector3>): THREE.Group {
  const signs = new THREE.Group();
  signs.name = 'road-signs';
  const poleMaterial = new THREE.MeshStandardMaterial({ color: '#8c9b9e', metalness: .65, roughness: .4 });
  destinations.forEach((destination, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1536; canvas.height = 768;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(1.5, 1.5);
    ctx.fillStyle = destination.background; ctx.fillRect(0, 0, 1024, 512);
    ctx.strokeStyle = destination.color; ctx.lineWidth = 9;
    ctx.strokeRect(15, 15, 994, 482);
    ctx.fillStyle = destination.color; ctx.fillRect(40, 44, 8, 32);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 25px Arial';
    ctx.fillText(`${index < AI_TOOLS.length ? 'AI DEVELOPMENT' : 'ENGINEERING ROUTE'} / ${String(index + 1).padStart(2, '0')}`, 64, 69);
    ctx.save(); ctx.translate(55, 108); ctx.scale(4.5, 4.5);
    ctx.fillStyle = destination.color; ctx.fill(new Path2D(destination.icon.path)); ctx.restore();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 80px Arial';
    ctx.fillText(destination.name, 195, 188);
    ctx.lineWidth = 13; ctx.lineCap = 'square'; ctx.strokeStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(931, 216); ctx.lineTo(931, 115);
    ctx.moveTo(902, 146); ctx.lineTo(931, 115); ctx.lineTo(960, 146); ctx.stroke();
    ctx.font = 'bold 52px Arial'; ctx.fillText(destination.detail, 55, 305);
    ctx.strokeStyle = destination.color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(55, 350); ctx.lineTo(970, 350); ctx.stroke();
    ctx.font = '36px Arial'; ctx.fillText(destination.next, 55, 427);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false, fog: false, shadowSide: THREE.DoubleSide }));
    // Put the message at camera height rather than high above the driver's view.
    board.castShadow = true;
    board.name = 'sign-face';
    board.position.y = 3.5;
    const sign = new THREE.Group(); sign.add(board);
    const t = ROAD_SIGN_PROGRESS[index];
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const side = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
    sign.position.copy(point).addScaledVector(side, 10.5);
    const approach = curve.getPointAt((t - .04 + 1) % 1);
    sign.lookAt(new THREE.Vector3(approach.x, sign.position.y, approach.z));
    for (const x of [-5.8, 5.8]) {
      const foot = sign.localToWorld(new THREE.Vector3(x, 0, 0));
      const length = Math.max(3, sign.position.y - groundHeight(foot.x, foot.z) + 3.5);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, length, 6), poleMaterial);
      pole.castShadow = true;
      pole.receiveShadow = true;
      pole.position.set(x, 3.5 - length / 2, -.35); sign.add(pole);
    }
    signs.add(sign);
  });
  signs.visible = true;
  return signs;
}

/** Face the overview camera; return to the fixed road approach angle for the ride. */
export function orientRoadSigns(signs: THREE.Group, overview: boolean, camera: THREE.Vector3): boolean {
  let changed = false;
  const previous = new THREE.Quaternion();
  signs.children.forEach(sign => {
    const board = sign.getObjectByName('sign-face');
    if (!board) return;
    previous.copy(board.quaternion);
    if (overview) board.lookAt(camera);
    else board.rotation.set(0, 0, 0);
    changed ||= 1 - Math.abs(previous.dot(board.quaternion)) > 1e-8;
  });
  return changed;
}
