import { Component, ElementRef, ViewChild, input, output } from '@angular/core';
@Component({
  selector: 'app-sun-button',
  host: { '[class.is-riding]': 'riding()' },
  template: `<button
    #button
    type="button"
    aria-label="Explore my work, open portfolio"
    aria-haspopup="dialog"
    (click)="activated.emit()"
  >
    <span class="sun" aria-hidden="true"><span class="sun-core"></span></span
    ><span class="sun-label">Explore my work <span aria-hidden="true">↗</span></span
    ><span class="sun-hint">A closer look at what I do</span>
  </button>`,
  styleUrl: './sun-button.scss',
})
export class SunButton {
  readonly riding = input(false);
  @ViewChild('button', { static: true }) button!: ElementRef<HTMLButtonElement>;
  readonly activated = output<void>();
  focus(): void {
    this.button.nativeElement.focus();
  }
}
