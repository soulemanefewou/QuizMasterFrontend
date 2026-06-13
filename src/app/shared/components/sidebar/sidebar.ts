import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <nav class="sidebar" role="navigation" aria-label="Navigation principale">

      <!-- User section -->
      <div class="sidebar-user" *ngIf="authService.isAuthenticated()">
        <div class="sidebar-avatar">
          <span>{{ getUserInitial() }}</span>
        </div>
        <div class="sidebar-user-info">
          <span class="sidebar-username">{{ authService.getCurrentUser()?.username }}</span>
          <span class="sidebar-role" [class.admin-role]="authService.isAdmin()">
            {{ authService.isAdmin() ? '⚡ Admin' : '🎮 Joueur' }}
          </span>
        </div>
      </div>

      <!-- User nav -->
      <div class="nav-section">
        <span class="nav-label">Navigation</span>
        <a *ngFor="let item of userNavItems"
           class="nav-item"
           [routerLink]="item.route"
           routerLinkActive="nav-item--active"
           [attr.aria-label]="item.label">
          <div class="nav-icon-wrap">
            <mat-icon>{{ item.icon }}</mat-icon>
          </div>
          <span class="nav-text">{{ item.label }}</span>
          <div class="nav-indicator"></div>
        </a>
      </div>

      <!-- Admin nav -->
      <div class="nav-section" *ngIf="authService.isAdmin()">
        <span class="nav-label">Administration</span>
        <a *ngFor="let item of adminNavItems"
           class="nav-item nav-item--admin"
           [routerLink]="item.route"
           routerLinkActive="nav-item--active"
           [attr.aria-label]="item.label">
          <div class="nav-icon-wrap">
            <mat-icon>{{ item.icon }}</mat-icon>
          </div>
          <span class="nav-text">{{ item.label }}</span>
          <div class="nav-indicator"></div>
        </a>
      </div>

      <!-- Bottom glow orb decoration -->
      <div class="sidebar-orb"></div>
    </nav>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 64px; left: 0; bottom: 0;
      width: 260px;
      background: rgba(13, 15, 20, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-right: 1px solid rgba(148, 163, 184, 0.07);
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 999;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      padding: 16px 0 24px;
      animation: qm-slide-in-left 0.3s ease;
    }

    .sidebar-hidden {
      transform: translateX(-260px);
    }

    .sidebar-mobile-open {
      transform: translateX(0) !important;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    }

    /* ── User block ── */
    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px 20px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.07);
      margin-bottom: 8px;
    }

    .sidebar-avatar {
      width: 44px; height: 44px;
      border-radius: 14px;
      background: var(--qm-gradient-brand);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      color: white;
      font-family: 'Outfit', sans-serif;
      flex-shrink: 0;
      box-shadow: var(--qm-glow-primary);
    }

    .sidebar-user-info {
      display: flex;
      flex-direction: column;
    }

    .sidebar-username {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--qm-text-primary);
    }

    .sidebar-role {
      font-size: 11px;
      font-weight: 500;
      color: var(--qm-text-muted);
      margin-top: 2px;
    }

    .admin-role { color: var(--qm-primary-300); }

    /* ── Nav section ── */
    .nav-section {
      padding: 8px 12px;
      flex: none;
    }

    .nav-label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: var(--qm-text-muted);
      padding: 8px 8px 6px;
    }

    /* ── Nav item ── */
    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--qm-radius-md);
      text-decoration: none;
      color: var(--qm-text-secondary);
      transition: var(--qm-transition);
      margin-bottom: 2px;
      overflow: hidden;

      &:hover {
        background: rgba(139, 92, 246, 0.08);
        color: var(--qm-text-primary);
        .nav-icon-wrap {
          background: rgba(139, 92, 246, 0.2);
          color: var(--qm-primary-300);
        }
      }

      &--active {
        background: rgba(139, 92, 246, 0.15) !important;
        color: var(--qm-primary-300) !important;

        .nav-icon-wrap {
          background: rgba(139, 92, 246, 0.3) !important;
          color: var(--qm-primary-300) !important;
        }

        .nav-indicator {
          opacity: 1;
        }
      }

      &--admin:hover {
        background: rgba(251, 191, 36, 0.08);
        .nav-icon-wrap {
          background: rgba(251, 191, 36, 0.15);
          color: var(--qm-gold-400);
        }
      }

      &--admin.nav-item--active {
        background: rgba(251, 191, 36, 0.1) !important;
        color: var(--qm-gold-400) !important;
        .nav-icon-wrap {
          background: rgba(251, 191, 36, 0.2) !important;
          color: var(--qm-gold-400) !important;
        }
      }
    }

    .nav-icon-wrap {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.04);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--qm-transition);
      flex-shrink: 0;
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .nav-text {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 500;
    }

    .nav-indicator {
      position: absolute;
      right: 0; top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: var(--qm-gradient-brand);
      border-radius: 3px 0 0 3px;
      opacity: 0;
      transition: var(--qm-transition);
    }

    /* ── Orb decoration ── */
    .sidebar-orb {
      position: absolute;
      bottom: -60px;
      left: -60px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    /* ── Scrollbar ── */
    .sidebar::-webkit-scrollbar { width: 3px; }
    .sidebar::-webkit-scrollbar-track { background: transparent; }
    .sidebar::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }

    @media (max-width: 768px) {
      .sidebar { transform: translateX(-260px); }
    }
  `]
})
export class Sidebar {
  userNavItems: NavItem[] = [
    { icon: 'quiz',        label: 'Quiz',           route: '/quizzes' },
    { icon: 'leaderboard', label: 'Classements',    route: '/rankings' },
    { icon: 'emoji_events',label: 'Badges',         route: '/badges' },
    { icon: 'history',     label: 'Historique',     route: '/history' },
    { icon: 'notifications',label: 'Notifications', route: '/notifications' },
  ];

  adminNavItems: NavItem[] = [
    { icon: 'dashboard',      label: 'Dashboard',       route: '/admin',             adminOnly: true },
    { icon: 'people',         label: 'Utilisateurs',    route: '/admin/users',       adminOnly: true },
    { icon: 'manage_search',  label: 'Gestion Quiz',    route: '/admin/quizzes',     adminOnly: true },
    { icon: 'military_tech',  label: 'Gestion Badges',  route: '/admin/badges',      adminOnly: true },
    { icon: 'bar_chart',      label: 'Statistiques',    route: '/admin/statistics',  adminOnly: true },
  ];

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      document.querySelector('.sidebar')?.classList.remove('sidebar-mobile-open');
      document.querySelector('.sidebar-overlay')?.classList.remove('active');
    });
  }

  getUserInitial(): string {
    const user = this.authService.getCurrentUser();
    return user?.username?.charAt(0)?.toUpperCase() || '?';
  }
}
