import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <div class="progress-container">
      <div class="progress-label">
        <span>{{ label }}</span>
        <span>{{ current }}/{{ total }}</span>
      </div>
      <mat-progress-bar mode="determinate" [value]="percentage"></mat-progress-bar>
    </div>
  `,
  styles: [`
    .progress-container { width: 100%; }
    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
    }
  `]
})
export class ProgressBar {
  @Input() current = 0;
  @Input() total = 100;
  @Input() label = 'Progression';

  get percentage(): number {
    return this.total > 0 ? (this.current / this.total) * 100 : 0;
  }
}
