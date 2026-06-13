import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AttemptService } from '../../../core/services/attempt';
import { Attempt, UserStats } from '../../../core/models';

@Component({
  selector: 'app-attempt-history',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <h1 class="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-6">Mon Historique</h1>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" *ngIf="stats">
        <div class="bg-qm-bg-surface/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:translate-y-[-2px]">
          <div class="w-12 h-12 rounded-xl bg-qm-primary-600/10 flex items-center justify-center text-qm-primary-300 mb-3">
            <mat-icon class="text-2xl">quiz</mat-icon>
          </div>
          <h3 class="font-outfit text-2xl font-black text-white leading-none m-0">{{ stats.total_quizzes }}</h3>
          <p class="text-xs text-qm-text-secondary m-0 mt-2 font-medium uppercase tracking-wide">Quiz Complétés</p>
        </div>

        <div class="bg-qm-bg-surface/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:translate-y-[-2px]">
          <div class="w-12 h-12 rounded-xl bg-qm-accent-500/10 flex items-center justify-center text-qm-accent-400 mb-3">
            <mat-icon class="text-2xl">trending_up</mat-icon>
          </div>
          <h3 class="font-outfit text-2xl font-black text-white leading-none m-0">{{ stats.avg_score | number:'1.0-0' }}%</h3>
          <p class="text-xs text-qm-text-secondary m-0 mt-2 font-medium uppercase tracking-wide">Score Moyen</p>
        </div>

        <div class="bg-qm-bg-surface/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:translate-y-[-2px]">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <mat-icon class="text-2xl">check_circle</mat-icon>
          </div>
          <h3 class="font-outfit text-2xl font-black text-white leading-none m-0">{{ stats.total_correct_answers }}</h3>
          <p class="text-xs text-qm-text-secondary m-0 mt-2 font-medium uppercase tracking-wide">Bonnes Réponses</p>
        </div>

        <div class="bg-qm-bg-surface/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:translate-y-[-2px]">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
            <mat-icon class="text-2xl">local_fire_department</mat-icon>
          </div>
          <h3 class="font-outfit text-2xl font-black text-white leading-none m-0">{{ stats.streak_days }}</h3>
          <p class="text-xs text-qm-text-secondary m-0 mt-2 font-medium uppercase tracking-wide">Jours Consécutifs</p>
        </div>
      </div>

      <h2 class="font-outfit text-xl font-bold text-white mb-4">Historique des Tentatives</h2>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Attempts Table Card -->
      <div class="bg-qm-bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden" 
           *ngIf="!loading && attempts.length > 0">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02] border-b border-white/5">
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Quiz</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Score</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Temps passé</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 w-16 text-right"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of attempts" class="border-b border-white/5 hover:bg-white/[0.015] transition-colors duration-150">
                <td class="px-6 py-4 text-sm font-semibold text-white">{{ row.quiz_title }}</td>
                <td class="px-6 py-4 text-sm font-bold" [class.text-emerald-400]="row.percentage >= 60" [class.text-red-400]="row.percentage < 60">
                  {{ row.percentage | number:'1.0-0' }}%
                </td>
                <td class="px-6 py-4 text-sm text-qm-text-secondary">{{ formatTime(row.time_spent) }}</td>
                <td class="px-6 py-4 text-sm text-qm-text-secondary">{{ row.completed_at | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="px-6 py-4 text-right">
                  <a class="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-qm-text-secondary hover:text-white hover:bg-qm-primary-600/20 border border-white/5 transition-all duration-200" 
                     [routerLink]="['/quizzes', 'result', row.id]">
                    <mat-icon class="text-lg w-[18px] h-[18px]">visibility</mat-icon>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div class="text-center py-20 bg-qm-bg-surface/50 border border-dashed border-white/10 rounded-2xl" 
           *ngIf="!loading && attempts.length === 0">
        <div class="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto text-qm-text-muted mb-4">
          <mat-icon class="text-3xl">history</mat-icon>
        </div>
        <h3 class="font-outfit text-lg font-bold text-white m-0">Aucune tentative</h3>
        <p class="text-sm text-qm-text-secondary m-0 mt-1">Vous n'avez pas encore complété de quiz.</p>
        <a class="mt-4 inline-flex items-center gap-2 px-5 h-11 bg-gradient-to-r from-qm-primary-600 to-qm-accent-500 text-white font-outfit text-xs font-bold rounded-lg no-underline shadow-glow-primary border-none cursor-pointer transition-all duration-200 hover:translate-y-[-1px]" 
           routerLink="/quizzes">
          Voir les Quiz
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class AttemptHistory implements OnInit {
  attempts: Attempt[] = [];
  stats: UserStats | null = null;
  loading = true;

  constructor(private attemptService: AttemptService) {}

  ngOnInit(): void {
    this.attemptService.getHistory().subscribe({
      next: (res) => { this.attempts = res.results || []; this.loading = false; },
      error: () => this.loading = false
    });
    this.attemptService.getUserStats().subscribe(stats => this.stats = stats);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }
}
