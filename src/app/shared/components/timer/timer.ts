import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="timer" [class.warning]="remainingTime <= 30" [class.danger]="remainingTime <= 10">
      <mat-icon>timer</mat-icon>
      <span class="time-display">{{ displayTime }}</span>
    </div>
  `,
  styles: [`
    .timer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 8px;
      background: var(--mat-sys-surface-container);
    }
    .warning { color: #f57c00; }
    .danger { color: #d32f2f; animation: pulse 1s infinite; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class Timer implements OnInit, OnDestroy {
  @Input() totalTime = 300; // seconds
  @Output() timeUp = new EventEmitter<void>();
  @Output() timeChange = new EventEmitter<number>();

  remainingTime = 300;
  private intervalId: any;

  get displayTime(): string {
    const mins = Math.floor(this.remainingTime / 60);
    const secs = this.remainingTime % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  get elapsedSeconds(): number {
    return this.totalTime - this.remainingTime;
  }

  ngOnInit(): void {
    this.remainingTime = this.totalTime;
    this.intervalId = setInterval(() => {
      this.remainingTime--;
      this.timeChange.emit(this.elapsedSeconds);
      if (this.remainingTime <= 0) {
        this.stop();
        this.timeUp.emit();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    this.stop();
    this.remainingTime = this.totalTime;
    this.ngOnInit();
  }
}
