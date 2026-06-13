import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatMenuModule, MatDividerModule],
  template: `
    <header class="qm-header">
      <div class="header-inner">

        <!-- Left: Toggle + Logo -->
        <div class="header-left">
          <button class="toggle-btn" (click)="toggleSidebar()" aria-label="Toggle sidebar">
            <mat-icon>menu</mat-icon>
          </button>
          <a class="logo" routerLink="/quizzes">
            <div class="logo-icon">
              <span>QM</span>
            </div>
            <span class="logo-text">Quiz<strong>Master</strong></span>
          </a>
        </div>

        <!-- Right: Actions -->
        <div class="header-right" *ngIf="authService.isAuthenticated()">

          <!-- Notification Bell -->
          <button class="icon-btn notif-btn" routerLink="/notifications"
                  [class.has-unread]="unreadCount > 0"
                  aria-label="Notifications">
            <mat-icon>notifications</mat-icon>
            <span class="notif-badge" *ngIf="unreadCount > 0">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
          </button>

          <!-- User Menu -->
          <button class="user-btn" [matMenuTriggerFor]="userMenu">
            <div class="avatar">
              <span>{{ getUserInitial() }}</span>
            </div>
            <span class="username">{{ authService.getCurrentUser()?.username }}</span>
            <mat-icon class="chevron">expand_more</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu" class="qm-user-menu">
            <div class="menu-header" mat-menu-item disabled>
              <div class="menu-avatar">{{ getUserInitial() }}</div>
              <div class="menu-user-info">
                <span class="menu-username">{{ authService.getCurrentUser()?.username }}</span>
                <span class="menu-email">{{ authService.getCurrentUser()?.email }}</span>
              </div>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/history">
              <mat-icon>history</mat-icon>
              <span>Mon Historique</span>
            </button>
            <button mat-menu-item routerLink="/badges">
              <mat-icon>emoji_events</mat-icon>
              <span>Mes Badges</span>
            </button>
            <button mat-menu-item *ngIf="authService.isAdmin()" routerLink="/admin">
              <mat-icon>admin_panel_settings</mat-icon>
              <span>Administration</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item class="logout-item" (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Déconnexion</span>
            </button>
          </mat-menu>
        </div>

        <!-- Guest buttons -->
        <div class="header-right" *ngIf="!authService.isAuthenticated()">
          <a class="guest-btn" routerLink="/auth/login">Se connecter</a>
          <a class="guest-btn primary" routerLink="/auth/register">Créer un compte</a>
        </div>

      </div>
    </header>
  `,
  styles: [`
    .qm-header {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      height: 64px;
      background: rgba(13, 15, 20, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(148, 163, 184, 0.08);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 20px;
    }

    /* ── Left ── */
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px; height: 40px;
      border: none;
      background: rgba(139, 92, 246, 0.08);
      border-radius: 10px;
      color: var(--qm-text-secondary);
      cursor: pointer;
      transition: var(--qm-transition);
      &:hover {
        background: rgba(139, 92, 246, 0.2);
        color: var(--qm-primary-500);
      }
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      cursor: pointer;
    }

    .logo-icon {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: var(--qm-gradient-brand);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--qm-glow-primary);
      span {
        font-size: 13px;
        font-weight: 800;
        color: white;
        letter-spacing: -0.5px;
        font-family: 'Outfit', sans-serif;
      }
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 400;
      color: var(--qm-text-primary);
      letter-spacing: -0.3px;
      strong {
        font-weight: 800;
        background: var(--qm-gradient-brand);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    /* ── Right ── */
    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px; height: 40px;
      border: none;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      color: var(--qm-text-secondary);
      cursor: pointer;
      transition: var(--qm-transition);
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover {
        background: rgba(139, 92, 246, 0.15);
        color: var(--qm-primary-300);
      }
    }

    .notif-btn.has-unread {
      color: var(--qm-accent-400);
      background: rgba(6, 182, 212, 0.1);
      animation: qm-badge-bounce 2s infinite;
    }

    .notif-badge {
      position: absolute;
      top: 4px; right: 4px;
      min-width: 16px; height: 16px;
      background: var(--qm-error);
      border-radius: 8px;
      font-size: 10px;
      font-weight: 700;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      line-height: 1;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px 4px 4px;
      border: 1px solid rgba(148, 163, 184, 0.1);
      border-radius: 40px;
      background: rgba(255, 255, 255, 0.03);
      cursor: pointer;
      transition: var(--qm-transition);
      &:hover {
        border-color: rgba(139, 92, 246, 0.4);
        background: rgba(139, 92, 246, 0.08);
      }
    }

    .avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: var(--qm-gradient-brand);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: white;
      font-family: 'Outfit', sans-serif;
    }

    .username {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: var(--qm-text-primary);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chevron {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      color: var(--qm-text-muted);
    }

    /* Menu header block */
    .menu-header {
      display: flex !important;
      align-items: center;
      gap: 12px;
      padding: 12px 16px !important;
      opacity: 1 !important;
      cursor: default !important;
    }

    .menu-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: var(--qm-gradient-brand);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .menu-user-info {
      display: flex;
      flex-direction: column;
    }

    .menu-username {
      font-size: 14px;
      font-weight: 600;
      color: var(--qm-text-primary);
    }

    .menu-email {
      font-size: 12px;
      color: var(--qm-text-secondary);
    }

    .logout-item {
      color: var(--qm-error) !important;
      mat-icon { color: var(--qm-error) !important; }
    }

    /* Guest */
    .guest-btn {
      padding: 8px 18px;
      border-radius: var(--qm-radius-md);
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: var(--qm-transition);
      color: var(--qm-text-secondary);
      border: 1px solid var(--qm-border);
      &:hover { color: var(--qm-text-primary); border-color: rgba(139,92,246,0.4); }
      &.primary {
        background: var(--qm-gradient-brand);
        color: white;
        border-color: transparent;
        box-shadow: var(--qm-glow-primary);
        &:hover { box-shadow: 0 0 28px rgba(139,92,246,0.6); transform: translateY(-1px); }
      }
    }

    @media (max-width: 600px) {
      .username, .logo-text { display: none; }
      .logo-icon { margin-left: 4px; }
    }
  `]
})
export class Header implements OnInit {
  unreadCount = 0;

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      });
      this.notificationService.refreshUnreadCount();
    }
  }

  getUserInitial(): string {
    const user = this.authService.getCurrentUser();
    return user?.username?.charAt(0)?.toUpperCase() || '?';
  }

  toggleSidebar(): void {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
      sidebar?.classList.toggle('sidebar-mobile-open');
      overlay?.classList.toggle('active');
    } else {
      sidebar?.classList.toggle('sidebar-hidden');
      mainContent?.classList.toggle('main-no-sidebar');
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
