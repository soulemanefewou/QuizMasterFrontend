import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RankingService } from '../../../core/services/ranking';
import { Ranking } from '../../../core/models';

@Component({
  selector: 'app-global-ranking',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-6 animate-fade-in">
      <h1 class="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-6">Classements</h1>

      <!-- Tab Switcher -->
      <div class="flex gap-2 border-b border-white/5 pb-4 mb-6">
        <button *ngFor="let tab of tabs; let idx = index"
                class="px-5 h-10 flex items-center rounded-xl text-xs sm:text-sm font-semibold font-outfit border border-transparent transition-all duration-200 cursor-pointer"
                [class.bg-qm-primary-600/15]="activeTab === idx"
                [class.text-qm-primary-300]="activeTab === idx"
                [class.border-qm-primary-500/25]="activeTab === idx"
                [class.text-qm-text-secondary]="activeTab !== idx"
                [class.hover:text-white]="activeTab !== idx"
                (click)="onTabChange(idx)">
          {{ tab }}
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Rankings Table -->
      <div class="bg-qm-bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden" 
           *ngIf="!loading && activeList.length > 0">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02] border-b border-white/5">
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider w-20">Rang</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Joueur</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Quiz Résolus</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Score Moyen</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of activeList; let i = index" 
                  class="border-b border-white/5 hover:bg-white/[0.015] transition-colors duration-150"
                  [class.bg-qm-primary-600/5]="row.rank <= 3">
                <td class="px-6 py-4 text-sm font-semibold text-white">
                  <div class="flex items-center gap-1.5">
                    <mat-icon *ngIf="row.rank === 1" class="text-qm-gold-500 text-lg w-[18px] h-[18px]">emoji_events</mat-icon>
                    <mat-icon *ngIf="row.rank === 2" class="text-slate-300 text-lg w-[18px] h-[18px]">emoji_events</mat-icon>
                    <mat-icon *ngIf="row.rank === 3" class="text-amber-700 text-lg w-[18px] h-[18px]">emoji_events</mat-icon>
                    <span [class.font-black]="row.rank <= 3"
                          [class.text-qm-gold-400]="row.rank === 1"
                          [class.text-slate-300]="row.rank === 2"
                          [class.text-amber-600]="row.rank === 3"
                          [class.text-qm-text-muted]="row.rank > 3">
                      #{{ row.rank }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm font-bold text-white flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-qm-primary-600 to-qm-accent-500 flex items-center justify-center text-xs font-black text-white shrink-0">
                    {{ row.username.charAt(0).toUpperCase() }}
                  </div>
                  <span>{{ row.username }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-qm-text-secondary font-semibold">{{ row.total_quizzes }}</td>
                <td class="px-6 py-4 text-sm text-qm-text-secondary font-bold">
                  {{ row.avg_percentage | number:'1.1-1' }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div class="text-center py-20 bg-qm-bg-surface/50 border border-dashed border-white/10 rounded-2xl" 
           *ngIf="!loading && activeList.length === 0">
        <div class="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto text-qm-text-muted mb-4">
          <mat-icon class="text-3xl">leaderboard</mat-icon>
        </div>
        <h3 class="font-outfit text-lg font-bold text-white m-0">Aucun classement</h3>
        <p class="text-sm text-qm-text-secondary m-0 mt-1">Aucune tentative n'a été enregistrée pour cette période.</p>
      </div>
    </div>
  `,
  styles: []
})
export class GlobalRanking implements OnInit {
  tabs = ['Global', 'Hebdomadaire', 'Mensuel'];
  activeTab = 0;

  globalRankings: Ranking[] = [];
  weeklyRankings: Ranking[] = [];
  monthlyRankings: Ranking[] = [];
  loading = true;

  constructor(private rankingService: RankingService) {}

  ngOnInit(): void {
    this.loadRankings('global');
  }

  get activeList(): Ranking[] {
    if (this.activeTab === 0) return this.globalRankings;
    if (this.activeTab === 1) return this.weeklyRankings;
    return this.monthlyRankings;
  }

  onTabChange(index: number): void {
    this.activeTab = index;
    const types = ['global', 'weekly', 'monthly'];
    this.loadRankings(types[index]);
  }

  loadRankings(type: string): void {
    const cachedData = type === 'global' ? this.globalRankings
      : type === 'weekly' ? this.weeklyRankings
      : this.monthlyRankings;

    if (cachedData.length > 0) {
      // Avoid loading state if data is already cached
      return;
    }

    this.loading = true;
    const obs = type === 'global' ? this.rankingService.getGlobalRanking()
      : type === 'weekly' ? this.rankingService.getWeeklyRanking()
      : this.rankingService.getMonthlyRanking();

    obs.subscribe({
      next: (res) => {
        const data = res.results || [];
        if (type === 'global') this.globalRankings = data;
        else if (type === 'weekly') this.weeklyRankings = data;
        else this.monthlyRankings = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
