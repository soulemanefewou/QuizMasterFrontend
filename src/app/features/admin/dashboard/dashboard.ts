import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { AdminStats } from '../../../core/models';
import { environment } from '../../../../environments/environment';

const API_URL = environment.apiUrl;

interface StatCard {
  icon: string;
  label: string;
  value: number | string;
  color: string;
  bg: string;
  glow: string;
  change?: string;
}

interface QuickLink {
  icon: string;
  label: string;
  desc: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="dashboard-page">

      <!-- Header -->
      <div class="dash-header">
        <div>
          <div class="dash-badge">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>Administration</span>
          </div>
          <h1 class="dash-title">Dashboard</h1>
          <p class="dash-sub">Vue d'ensemble de la plateforme QuizMaster</p>
        </div>
        <div class="dash-date">
          <mat-icon>calendar_today</mat-icon>
          <span>{{ today }}</span>
        </div>
      </div>

      <!-- Loading -->
      <div class="dash-loading" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Chargement des statistiques…</span>
      </div>

      <!-- Stats grid -->
      <div class="stats-grid" *ngIf="stats && !loading">
        <div class="stat-card" *ngFor="let card of buildStatCards(); let i=index"
             [style.animationDelay]="(i*0.1)+'s'">
          <div class="stat-icon-wrap" [style.background]="card.bg" [style.boxShadow]="card.glow">
            <mat-icon [style.color]="card.color">{{ card.icon }}</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ card.value }}</span>
            <span class="stat-label">{{ card.label }}</span>
          </div>
          <div class="stat-trend" *ngIf="card.change">
            <mat-icon>trending_up</mat-icon>
            <span>{{ card.change }}</span>
          </div>
        </div>
      </div>

      <!-- Quick links -->
      <div class="quick-links-section">
        <h2 class="section-title">
          <mat-icon>bolt</mat-icon>
          Accès Rapide
        </h2>
        <div class="links-grid">
          <a class="link-card" *ngFor="let link of quickLinks; let i=index"
             [routerLink]="link.route"
             [style.animationDelay]="(i*0.08)+'s'">
            <div class="link-icon" [style.background]="link.color">
              <mat-icon>{{ link.icon }}</mat-icon>
            </div>
            <div class="link-content">
              <span class="link-label">{{ link.label }}</span>
              <span class="link-desc">{{ link.desc }}</span>
            </div>
            <mat-icon class="link-arrow">chevron_right</mat-icon>
          </a>
        </div>
      </div>

      <!-- Activity placeholder -->
      <div class="activity-section" *ngIf="stats">
        <h2 class="section-title">
          <mat-icon>insights</mat-icon>
          Aperçu de l'Activité
        </h2>
        <div class="activity-bars">
          <div class="activity-row" *ngFor="let item of activityItems">
            <span class="activity-label">{{ item.label }}</span>
            <div class="activity-bar-track">
              <div class="activity-bar-fill"
                   [style.width]="item.pct+'%'"
                   [style.background]="item.color">
              </div>
            </div>
            <span class="activity-value">{{ item.value }}</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .dashboard-page {
      max-width: 1200px;
      margin: 0 auto;
      animation: qm-fade-in 0.4s ease;
    }

    /* ── Header ── */
    .dash-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--qm-border);
    }

    .dash-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: rgba(245,158,11,0.1);
      border: 1px solid rgba(245,158,11,0.25);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      color: var(--qm-gold-400);
      margin-bottom: 10px;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    .dash-title {
      font-family: 'Outfit', sans-serif;
      font-size: 36px;
      font-weight: 900;
      color: var(--qm-text-primary);
      margin: 0 0 6px;
    }

    .dash-sub {
      font-size: 15px;
      color: var(--qm-text-secondary);
      margin: 0;
    }

    .dash-date {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: rgba(22,27,46,0.8);
      border: 1px solid var(--qm-border);
      border-radius: var(--qm-radius-lg);
      font-size: 14px;
      color: var(--qm-text-secondary);
      font-weight: 500;
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--qm-gold-400); }
    }

    /* ── Loading ── */
    .dash-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 60px;
      color: var(--qm-text-secondary);
    }

    /* ── Stats grid ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: rgba(22,27,46,0.8);
      border: 1px solid rgba(148,163,184,0.08);
      border-radius: var(--qm-radius-xl);
      backdrop-filter: blur(12px);
      transition: var(--qm-transition-slow);
      animation: qm-slide-in-up 0.4s ease both;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%);
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-4px);
        border-color: rgba(139,92,246,0.25);
        box-shadow: 0 12px 40px rgba(0,0,0,0.3);
      }
    }

    .stat-icon-wrap {
      width: 56px; height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { font-size: 26px; width: 26px; height: 26px; }
    }

    .stat-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-family: 'Outfit', sans-serif;
      font-size: 32px;
      font-weight: 900;
      color: var(--qm-text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 13px;
      color: var(--qm-text-secondary);
      font-weight: 500;
      margin-top: 4px;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 2px;
      color: var(--qm-success);
      font-size: 11px;
      font-weight: 700;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    /* ── Quick links ── */
    .quick-links-section {
      margin-bottom: 32px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: var(--qm-text-primary);
      margin: 0 0 16px;
      mat-icon { color: var(--qm-primary-500); font-size: 22px; }
    }

    .links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .link-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 20px;
      background: rgba(22,27,46,0.7);
      border: 1px solid rgba(148,163,184,0.08);
      border-radius: var(--qm-radius-xl);
      text-decoration: none;
      transition: var(--qm-transition);
      animation: qm-slide-in-up 0.4s ease both;
      cursor: pointer;

      &:hover {
        border-color: rgba(139,92,246,0.3);
        background: rgba(139,92,246,0.06);
        transform: translateX(4px);
        .link-arrow { color: var(--qm-primary-300); transform: translateX(4px); }
      }
    }

    .link-icon {
      width: 46px; height: 46px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { font-size: 22px; color: white; }
    }

    .link-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .link-label {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: var(--qm-text-primary);
    }

    .link-desc {
      font-size: 12px;
      color: var(--qm-text-secondary);
    }

    .link-arrow {
      color: var(--qm-text-muted);
      transition: var(--qm-transition);
      font-size: 20px;
    }

    /* ── Activity ── */
    .activity-section {
      padding: 28px;
      background: rgba(22,27,46,0.8);
      border: 1px solid rgba(148,163,184,0.08);
      border-radius: var(--qm-radius-xl);
      backdrop-filter: blur(12px);
    }

    .activity-bars {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 4px;
    }

    .activity-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .activity-label {
      font-size: 13px;
      color: var(--qm-text-secondary);
      font-weight: 600;
      min-width: 140px;
    }

    .activity-bar-track {
      flex: 1;
      height: 8px;
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
      overflow: hidden;
    }

    .activity-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 1s cubic-bezier(0.4,0,0.2,1) 0.3s;
    }

    .activity-value {
      font-size: 13px;
      font-weight: 700;
      color: var(--qm-text-primary);
      min-width: 40px;
      text-align: right;
    }

    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .dash-header { flex-direction: column; align-items: flex-start; }
      .stat-value { font-size: 24px; }
    }
  `]
})
export class Dashboard implements OnInit {
  stats: AdminStats | null = null;
  loading = true;
  today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  quickLinks: QuickLink[] = [
    { icon: 'people',       label: 'Gestion Utilisateurs', desc: 'Gérer les comptes et rôles',    route: '/admin/users',       color: 'linear-gradient(135deg,#4c1d95,#7c3aed)' },
    { icon: 'manage_search',label: 'Gestion Quiz',         desc: 'Créer, modifier, archiver',     route: '/admin/quizzes',     color: 'linear-gradient(135deg,#164e63,#06b6d4)' },
    { icon: 'military_tech',label: 'Gestion Badges',       desc: 'Attribuer des récompenses',     route: '/admin/badges',      color: 'linear-gradient(135deg,#78350f,#f59e0b)' },
    { icon: 'bar_chart',    label: 'Statistiques',         desc: 'Analyse des performances',      route: '/admin/statistics',  color: 'linear-gradient(135deg,#064e3b,#10b981)' },
  ];

  activityItems: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<AdminStats>(`${API_URL}/auth/admin/stats/`).subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.buildActivityItems(data);
      },
      error: () => this.loading = false
    });
  }

  buildStatCards(): StatCard[] {
    if (!this.stats) return [];
    return [
      {
        icon: 'people',
        label: 'Utilisateurs totaux',
        value: this.stats.total_users,
        color: '#a78bfa',
        bg: 'rgba(124,58,237,0.15)',
        glow: '0 0 20px rgba(124,58,237,0.25)',
        change: '+12 ce mois'
      },
      {
        icon: 'quiz',
        label: 'Quiz publiés',
        value: this.stats.total_quizzes,
        color: '#34d399',
        bg: 'rgba(16,185,129,0.15)',
        glow: '0 0 20px rgba(16,185,129,0.2)',
        change: '+3 cette semaine'
      },
      {
        icon: 'assessment',
        label: 'Tentatives totales',
        value: this.stats.total_attempts,
        color: '#60a5fa',
        bg: 'rgba(59,130,246,0.15)',
        glow: '0 0 20px rgba(59,130,246,0.2)',
        change: '+87 ce mois'
      },
      {
        icon: 'verified_user',
        label: 'Utilisateurs actifs',
        value: this.stats.active_users,
        color: '#fbbf24',
        bg: 'rgba(245,158,11,0.15)',
        glow: '0 0 20px rgba(245,158,11,0.2)',
        change: '7j derniers jours'
      },
    ];
  }

  buildActivityItems(stats: AdminStats): void {
    const maxVal = Math.max(stats.total_users, stats.total_quizzes, stats.total_attempts, stats.active_users, 1);
    this.activityItems = [
      { label: 'Utilisateurs',      value: stats.total_users,    pct: (stats.total_users / maxVal * 100).toFixed(0),    color: 'linear-gradient(90deg,#7c3aed,#a855f7)' },
      { label: 'Quiz',              value: stats.total_quizzes,  pct: (stats.total_quizzes / maxVal * 100).toFixed(0),  color: 'linear-gradient(90deg,#059669,#10b981)' },
      { label: 'Tentatives',        value: stats.total_attempts, pct: Math.min(100, (stats.total_attempts / maxVal * 100)).toFixed(0), color: 'linear-gradient(90deg,#1d4ed8,#3b82f6)' },
      { label: 'Utilisateurs actifs', value: stats.active_users, pct: (stats.active_users / maxVal * 100).toFixed(0),  color: 'linear-gradient(90deg,#d97706,#fbbf24)' },
    ];
  }
}
