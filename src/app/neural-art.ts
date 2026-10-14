import { Component, input } from '@angular/core';

// Deterministic star field: no sphere, horizon ring, or central boundary.
const neurons = Array.from({ length: 115 }, (_, i) => ({
  x: ((i * 613 + 47) % 1480) + 10,
  y: ((i * i * 37 + i * 113 + 29) % 540) + 10,
  radius: i % 9 === 0 ? 2.5 : 0.8 + (i % 4) * 0.35,
}));
const connections = neurons.flatMap((a, i) => neurons.slice(i + 1).flatMap((b, j) => {
  const distance = Math.hypot(a.x - b.x, a.y - b.y);
  return distance < 145 && distance > 40 ? [{ a, b, id: `${i}-${j}`, delay: `${-(i % 13)}s` }] : [];
}));
@Component({
  selector: 'app-neural-art',
  host: { 'aria-hidden': 'true', '[class.paused]': 'paused()' },
  template: `<svg viewBox="0 0 1500 560" preserveAspectRatio="xMidYMid slice" focusable="false">
    @for (edge of connections; track edge.id) {
      <line class="synapse" [attr.x1]="edge.a.x" [attr.y1]="edge.a.y" [attr.x2]="edge.b.x" [attr.y2]="edge.b.y" />
    }
    @for (edge of signals; track edge.id) {
      <line class="signal" [style.animation-delay]="edge.delay" [attr.x1]="edge.a.x" [attr.y1]="edge.a.y" [attr.x2]="edge.b.x" [attr.y2]="edge.b.y" pathLength="100" />
    }
    @for (node of neurons; track $index) {
      <g class="star" [style.animation-delay]="-($index % 11) + 's'">
        <circle class="glow" [attr.cx]="node.x" [attr.cy]="node.y" [attr.r]="node.radius * 4" />
        <circle [attr.cx]="node.x" [attr.cy]="node.y" [attr.r]="node.radius" />
        @if (node.radius > 2) { <path class="flare" [attr.d]="'M' + (node.x-7) + ' ' + node.y + 'h14M' + node.x + ' ' + (node.y-7) + 'v14'" /> }
      </g>
    }
  </svg>`,
  styleUrl: './neural-art.scss',
})
export class NeuralArt {
  readonly paused = input(false);
  readonly neurons = neurons;
  readonly connections = connections;
  readonly signals = connections.filter((_, i) => i % 9 === 0);
}
