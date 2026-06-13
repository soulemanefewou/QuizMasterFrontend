import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BadgeService } from '../../../core/services/badge';
import { Badge } from '../../../core/models';

@Component({
  selector: 'app-badge-catalog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <h1 class="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-2">Catalogue des Badges</h1>
      <p class="text-sm text-qm-text-secondary mb-8">Collectionnez les badges en complétant des quiz et en atteignant des objectifs !</p>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Badges Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="!loading">
        <div *ngFor="let badge of badges" 
             class="relative rounded-2xl p-6 border transition-all duration-300"
             [class]="badge.is_unlocked ? 'bg-qm-bg-surface/80 border-emerald-500/20 shadow-[0_8px_32px_rgba(16,185,129,0.05)] hover:translate-y-[-4px] hover:border-emerald-500/40 hover:shadow-[0_12px_40px_rgba(16,185,129,0.1)]' : 'bg-qm-bg-surface/40 border-white/5 opacity-55 grayscale-[60%] hover:opacity-80 hover:grayscale-[20%]'">
          
          <!-- Badge Header -->
          <div class="flex items-start justify-between gap-4 mb-4">
            <!-- Icon Wrapper -->
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300"
                 [class]="badge.is_unlocked ? 'bg-qm-gold-500/10 text-qm-gold-400 border-qm-gold-400/25 shadow-glow-gold' : 'bg-white/[0.04] text-qm-text-muted border-white/5'">
              <mat-icon class="text-3xl w-7 h-7">{{ badge.icon }}</mat-icon>
            </div>
            
            <!-- Difficulty Chip -->
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" 
                  [class]="getDifficultyClass(badge.difficulty)">
              {{ badge.difficulty }}
            </span>
          </div>

          <!-- Content -->
          <h3 class="font-outfit text-base font-bold text-white m-0 mb-1.5">{{ badge.name }}</h3>
          <p class="text-xs text-qm-text-secondary leading-relaxed m-0 mb-4 h-9 overflow-hidden text-ellipsis">{{ badge.description }}</p>
          
          <div class="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
            <span class="text-[11px] text-qm-text-muted font-medium uppercase tracking-wide">Objectif: {{ badge.threshold }}</span>
            
            <!-- Unlock Date -->
            <span *ngIf="badge.unlocked_at" class="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <mat-icon class="text-sm w-3.5 h-3.5">check_circle</mat-icon>
              Débloqué
            </span>
            <span *ngIf="!badge.is_unlocked" class="flex items-center gap-1 text-[11px] text-qm-text-muted font-semibold">
              <mat-icon class="text-sm w-3.5 h-3.5">lock</mat-icon>
              Verrouillé
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BadgeCatalog implements OnInit {
  badges: Badge[] = [];
  loading = true;

  constructor(private badgeService: BadgeService) {}

  ngOnInit(): void {
    this.badgeService.getCatalog().subscribe({
      next: (res) => { this.badges = res.results || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  getDifficultyClass(diff: string): string {
    const key = diff?.toLowerCase();
    if (key === 'bronze') return 'bg-amber-800/20 text-amber-500 border border-amber-800/30';
    if (key === 'silver') return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    if (key === 'gold') return 'bg-qm-gold-500/20 text-qm-gold-400 border border-qm-gold-500/30';
    return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
  }
}
