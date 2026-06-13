import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { AdminStats } from '../../../core/models';
import { environment } from '../../../../environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <h1 class="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-6">Statistiques Détaillées</h1>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && stats" class="space-y-6">
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-qm-bg-surface/85 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:translate-y-[-2px]">
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <mat-icon class="text-2xl">people</mat-icon>
            </div>
            <div>
              <h2 class="font-outfit text-2xl md:text-3xl font-black text-white leading-none m-0">{{ stats.total_users }}</h2>
              <p class="text-xs text-qm-text-secondary m-0 mt-1.5 font-medium uppercase tracking-wide">Utilisateurs</p>
            </div>
          </div>

          <div class="bg-qm-bg-surface/85 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:translate-y-[-2px]">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <mat-icon class="text-2xl">quiz</mat-icon>
            </div>
            <div>
              <h2 class="font-outfit text-2xl md:text-3xl font-black text-white leading-none m-0">{{ stats.total_quizzes }}</h2>
              <p class="text-xs text-qm-text-secondary m-0 mt-1.5 font-medium uppercase tracking-wide">Quiz Publiés</p>
            </div>
          </div>

          <div class="bg-qm-bg-surface/85 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:translate-y-[-2px]">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <mat-icon class="text-2xl">assessment</mat-icon>
            </div>
            <div>
              <h2 class="font-outfit text-2xl md:text-3xl font-black text-white leading-none m-0">{{ stats.total_attempts }}</h2>
              <p class="text-xs text-qm-text-secondary m-0 mt-1.5 font-medium uppercase tracking-wide">Tentatives</p>
            </div>
          </div>

          <div class="bg-qm-bg-surface/85 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:translate-y-[-2px]">
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <mat-icon class="text-2xl">trending_up</mat-icon>
            </div>
            <div>
              <h2 class="font-outfit text-2xl md:text-3xl font-black text-white leading-none m-0">{{ stats.active_users }}</h2>
              <p class="text-xs text-qm-text-secondary m-0 mt-1.5 font-medium uppercase tracking-wide">Actifs (7j)</p>
            </div>
          </div>
        </div>

        <!-- Metrics Detail Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Key Metrics -->
          <div class="bg-qm-bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h3 class="font-outfit text-lg font-bold text-white m-0 mb-4 flex items-center gap-2">
              <mat-icon class="text-qm-primary-300">insights</mat-icon>
              Métriques Clés
            </h3>
            
            <div class="flex flex-col">
              <div class="flex justify-between items-center py-3.5 border-b border-white/5">
                <span class="text-sm text-qm-text-secondary font-medium">Moyenne de tentatives par quiz</span>
                <strong class="text-sm font-bold text-white">
                  {{ stats.total_quizzes > 0 ? (stats.total_attempts / stats.total_quizzes).toFixed(1) : '0' }}
                </strong>
              </div>
              <div class="flex justify-between items-center py-3.5 border-b border-white/5">
                <span class="text-sm text-qm-text-secondary font-medium">Tentatives par utilisateur</span>
                <strong class="text-sm font-bold text-white">
                  {{ stats.total_users > 0 ? (stats.total_attempts / stats.total_users).toFixed(1) : '0' }}
                </strong>
              </div>
              <div class="flex justify-between items-center py-3.5">
                <span class="text-sm text-qm-text-secondary font-medium">Taux d'activité global</span>
                <strong class="text-sm font-bold text-qm-accent-400">
                  {{ stats.total_users > 0 ? ((stats.active_users / stats.total_users) * 100).toFixed(0) : '0' }}%
                </strong>
              </div>
            </div>
          </div>

          <!-- Summary Platform -->
          <div class="bg-qm-bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between">
            <div>
              <h3 class="font-outfit text-lg font-bold text-white m-0 mb-4 flex items-center gap-2">
                <mat-icon class="text-qm-gold-500">description</mat-icon>
                Résumé de la plateforme
              </h3>
              
              <p class="text-sm text-qm-text-secondary leading-relaxed m-0">
                La plateforme QuizMaster compte actuellement <strong class="text-white">{{ stats.total_users }}</strong> utilisateurs enregistrés, dont 
                <strong class="text-white">{{ stats.active_users }}</strong> ont été actifs au cours des 7 derniers jours. Un catalogue de 
                <strong class="text-white">{{ stats.total_quizzes }}</strong> quiz thématiques est mis à disposition, ayant généré 
                <strong class="text-white">{{ stats.total_attempts }}</strong> tentatives d'évaluation cumulées au total.
              </p>
            </div>
            
            <div class="mt-6 flex items-center gap-2.5 text-xs text-qm-text-muted font-semibold uppercase tracking-wide select-none">
              <mat-icon class="text-sm w-4 h-4">update</mat-icon>
              <span>Mis à jour en temps réel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class Statistics implements OnInit {
  stats: AdminStats | null = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<AdminStats>(`${API_URL}/auth/admin/stats/`).subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
