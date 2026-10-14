import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Material north_east glyph, bundled as SVG to avoid an external font request. */
@Component({
  selector: 'app-arrow-icon',
  imports: [MatIconModule],
  host: { 'aria-hidden': 'true' },
  template: `<mat-icon><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z" />
  </svg></mat-icon>`,
  styles: `:host { display: inline-flex; vertical-align: middle; flex: none; }
    mat-icon { width: 18px; height: 18px; }
    svg { width: 100%; height: 100%; fill: currentColor; }`,
})
export class ArrowIcon {}
