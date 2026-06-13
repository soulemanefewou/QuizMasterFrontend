import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'QuizMaster';

  constructor(public authService: AuthService) {}

  closeSidebarMobile(): void {
    document.querySelector('.sidebar')?.classList.remove('sidebar-mobile-open');
    document.querySelector('.sidebar-overlay')?.classList.remove('active');
  }
}
