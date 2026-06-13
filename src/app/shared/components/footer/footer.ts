import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <p>&copy; {{ year }} QuizMaster - Application de Quiz en Ligne</p>
    </footer>
  `,
  styles: [`
    .app-footer {
      text-align: center;
      padding: 16px;
      background: var(--mat-sys-surface-container);
      color: var(--mat-sys-on-surface-variant);
      font-size: 14px;
    }
  `]
})
export class Footer {
  year = new Date().getFullYear();
}
