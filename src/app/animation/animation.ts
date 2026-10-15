import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  effect,
  inject,
  input,
  output,
  NgZone,
} from '@angular/core';
import { AnimationService } from './animation.service';
@Component({
  selector: 'app-animation',
  templateUrl: './animation.html',
  styleUrl: './animation.scss',
  providers: [AnimationService],
})
export class Animation implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  readonly mode = input<'overview' | 'ride'>('overview');
  readonly paused = input(false);
  readonly night = input(false);
  readonly reducedMotion = input(false);
  readonly statusChange = output<'loading' | 'ready' | 'fallback'>();
  private readonly scene = inject(AnimationService);
  private readonly zone = inject(NgZone);
  private initialized = false;
  private destroyed = false;
  private observer?: ResizeObserver;
  private activePointerId?: number;
  private readonly visibility = () => {
    if (document.hidden) this.pointerUp();
    this.sync();
  };
  private readonly lost = (event: Event) => {
    event.preventDefault();
    this.scene.setPaused(true);
    this.statusChange.emit('fallback');
  };
  private readonly restored = () => {
    this.scene.resize();
    this.sync();
    this.statusChange.emit('ready');
  };
  private readonly pointerDown = (event: PointerEvent) => {
    if (!this.paused() && event.isPrimary && event.button === 0) {
      this.canvasRef.nativeElement.setPointerCapture(event.pointerId);
      this.activePointerId = event.pointerId;
      this.scene.setBraking(true);
      this.scene.setPointer(event.clientX, event.clientY);
    }
  };
  private readonly pointerMove = (event: PointerEvent) => {
    if (this.canvasRef.nativeElement.hasPointerCapture(event.pointerId) && !this.paused()) {
      this.scene.setPointer(event.clientX, event.clientY);
    }
  };
  private readonly pointerUp = (event?: Event) => {
    if (event && 'pointerId' in event && event.pointerId !== this.activePointerId) return;
    this.activePointerId = undefined;
    this.scene.setBraking(false);
    this.scene.resetPointer();
  };

  constructor() {
    effect(() => {
      this.mode();
      this.night();
      this.paused();
      this.reducedMotion();
      this.sync();
    });
  }
  async ngAfterViewInit(): Promise<void> {
    const canvas = this.canvasRef.nativeElement;
    try {
      await this.zone.runOutsideAngular(() => this.scene.initialize(canvas));
      if (this.destroyed) return;
      this.zone.runOutsideAngular(() => {
        this.initialized = true;
        this.sync();
        this.observer = new ResizeObserver(() => this.scene.resize());
        this.observer.observe(canvas);
      });
      this.statusChange.emit('ready');
    } catch {
      if (this.destroyed) return;
      this.scene.dispose();
      this.statusChange.emit('fallback');
    }
    document.addEventListener('visibilitychange', this.visibility);
    window.addEventListener('blur', this.pointerUp);
    canvas.addEventListener('webglcontextlost', this.lost);
    canvas.addEventListener('webglcontextrestored', this.restored);
    canvas.addEventListener('pointerdown', this.pointerDown);
    canvas.addEventListener('pointermove', this.pointerMove);
    canvas.addEventListener('pointerup', this.pointerUp);
    canvas.addEventListener('pointercancel', this.pointerUp);
    canvas.addEventListener('lostpointercapture', this.pointerUp);
  }
  private sync(): void {
    if (!this.initialized) return;
    this.zone.runOutsideAngular(() => {
      this.scene.setNight(this.night());
      this.scene.setMode(this.mode(), this.reducedMotion() || this.paused());
      this.scene.setPaused(this.paused() || document.hidden);
    });
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    this.observer?.disconnect();
    document.removeEventListener('visibilitychange', this.visibility);
    window.removeEventListener('blur', this.pointerUp);
    const canvas = this.canvasRef.nativeElement;
    canvas.removeEventListener('webglcontextlost', this.lost);
    canvas.removeEventListener('webglcontextrestored', this.restored);
    canvas.removeEventListener('pointerdown', this.pointerDown);
    canvas.removeEventListener('pointermove', this.pointerMove);
    canvas.removeEventListener('pointerup', this.pointerUp);
    canvas.removeEventListener('pointercancel', this.pointerUp);
    canvas.removeEventListener('lostpointercapture', this.pointerUp);
    this.scene.dispose();
  }
}
