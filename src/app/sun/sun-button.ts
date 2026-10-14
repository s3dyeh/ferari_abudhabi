import { ArrowIcon } from '../arrow-icon';
import { AmmanTheme } from '../clock/amman-theme';
import { Component, inject, ElementRef, ViewChild, input, output } from '@angular/core';
@Component({
  imports: [ArrowIcon],
  selector: 'app-sun-button',
  host: { '[class.is-riding]': 'riding()', '[class.is-night]': 'theme.night()' },
  template: `<button
    #button
    type="button"
    aria-label="Explore my work, open portfolio"
    aria-haspopup="dialog"
    (click)="activated.emit()"
  >
    <span class="sun" aria-hidden="true"><span class="sun-core"></span></span>
    <span class="sun-label">Explore my work <app-arrow-icon /></span>

  </button>`,
  styleUrl: './sun-button.scss',
})
export class SunButton {
  readonly theme = inject(AmmanTheme);
  readonly riding = input(false);
  @ViewChild('button', { static: true }) button!: ElementRef<HTMLButtonElement>;
  readonly activated = output<void>();
  focus(): void {
    this.button.nativeElement.focus({ preventScroll: true });
  }
}
