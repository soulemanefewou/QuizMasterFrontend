import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BadgeService } from '../../../core/services/badge';
import { Badge } from '../../../core/models';

@Component({
  selector: 'app-badge-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <div class="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="font-outfit text-2xl md:text-3xl font-extrabold text-white m-0">Gestion des Badges</h1>
          <p class="text-sm text-qm-text-secondary m-0 mt-1">Créez, modifiez ou supprimez des récompenses</p>
        </div>
        
        <button class="flex items-center gap-1.5 px-4 h-11 bg-gradient-to-r from-qm-primary-600 to-qm-accent-500 text-white font-outfit text-xs font-bold rounded-xl border-none cursor-pointer transition-all duration-150 shadow-glow-primary hover:translate-y-[-1px] hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]"
                (click)="toggleCreateForm()">
          <mat-icon class="text-sm w-4.5 h-4.5">add</mat-icon>
          Nouveau Badge
        </button>
      </div>

      <!-- Create/Edit Form Card -->
      <div *ngIf="showCreateForm" class="bg-qm-bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)] animate-slide-up">
        <h3 class="font-outfit text-lg font-bold text-white m-0 mb-4 flex items-center gap-2">
          <mat-icon class="text-qm-primary-300">emoji_events</mat-icon>
          {{ editingBadge ? 'Modifier' : 'Créer' }} un Badge
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <!-- Name -->
          <div class="flex flex-col gap-1.5">
            <label class="font-outfit text-xs font-semibold text-qm-text-secondary tracking-wide">Nom du Badge</label>
            <div class="flex items-center gap-2 px-3 h-11 bg-white/[0.03] border border-white/10 rounded-xl">
              <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-xs" 
                     [(ngModel)]="badgeForm.name" 
                     placeholder="e.g. Master du Code" />
            </div>
          </div>

          <!-- Type -->
          <div class="flex flex-col gap-1.5">
            <label class="font-outfit text-xs font-semibold text-qm-text-secondary tracking-wide">Condition (Type)</label>
            <div class="flex items-center gap-2 px-3 h-11 bg-white/[0.03] border border-white/10 rounded-xl">
              <select [(ngModel)]="badgeForm.badge_type" 
                      class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-xs pr-4 cursor-pointer font-semibold">
                <option value="quiz_count" class="bg-qm-bg-surface text-white">Nombre de Quiz</option>
                <option value="avg_score" class="bg-qm-bg-surface text-white">Score Moyen</option>
                <option value="streak" class="bg-qm-bg-surface text-white">Jours Consécutifs</option>
                <option value="correct_answers" class="bg-qm-bg-surface text-white">Bonnes Réponses</option>
              </select>
            </div>
          </div>

          <!-- Difficulty -->
          <div class="flex flex-col gap-1.5">
            <label class="font-outfit text-xs font-semibold text-qm-text-secondary tracking-wide">Palier / Difficulté</label>
            <div class="flex items-center gap-2 px-3 h-11 bg-white/[0.03] border border-white/10 rounded-xl">
              <select [(ngModel)]="badgeForm.difficulty" 
                      class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-xs pr-4 cursor-pointer font-semibold">
                <option value="bronze" class="bg-qm-bg-surface text-white">Bronze</option>
                <option value="silver" class="bg-qm-bg-surface text-white">Argent</option>
                <option value="gold" class="bg-qm-bg-surface text-white">Or</option>
                <option value="platinum" class="bg-qm-bg-surface text-white">Platine</option>
              </select>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- Icon -->
          <div class="flex flex-col gap-1.5">
            <label class="font-outfit text-xs font-semibold text-qm-text-secondary tracking-wide">Nom de l'icône (Material icon)</label>
            <div class="flex items-center gap-2 px-3 h-11 bg-white/[0.03] border border-white/10 rounded-xl">
              <mat-icon class="text-base w-4.5 h-4.5 text-qm-text-muted">{{ badgeForm.icon }}</mat-icon>
              <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-xs" 
                     [(ngModel)]="badgeForm.icon" 
                     placeholder="e.g. emoji_events, school, local_fire_department" />
            </div>
          </div>

          <!-- Threshold -->
          <div class="flex flex-col gap-1.5">
            <label class="font-outfit text-xs font-semibold text-qm-text-secondary tracking-wide">Seuil numérique</label>
            <div class="flex items-center gap-2 px-3 h-11 bg-white/[0.03] border border-white/10 rounded-xl">
              <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-xs" 
                     type="number" 
                     [(ngModel)]="badgeForm.threshold" 
                     placeholder="e.g. 5, 80, 10" />
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-1.5 mb-5">
          <label class="font-outfit text-xs font-semibold text-qm-text-secondary tracking-wide">Description / Consigne</label>
          <textarea [(ngModel)]="badgeForm.description" 
                    rows="3" 
                    class="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-qm-primary-500 focus:bg-qm-primary-500/5 transition-all duration-200" 
                    placeholder="e.g. Avoir complété 5 quiz avec succès..."></textarea>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
          <button class="px-4 h-10 border border-white/10 hover:border-white/20 text-qm-text-secondary hover:text-white font-outfit text-xs font-bold rounded-xl bg-transparent cursor-pointer transition-all duration-150"
                  (click)="cancelEdit()">
            Annuler
          </button>
          <button class="px-5 h-10 bg-gradient-to-r from-qm-primary-600 to-qm-accent-500 text-white font-outfit text-xs font-bold rounded-xl border-none cursor-pointer transition-all duration-150 shadow-glow-primary hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]"
                  (click)="saveBadge()">
            {{ editingBadge ? 'Sauvegarder' : 'Créer' }} le Badge
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Badges Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="!loading">
        <div *ngFor="let badge of badges" 
             class="bg-qm-bg-surface/80 border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between hover:border-white/20 transition-all duration-200">
          
          <div>
            <!-- Badge Icon and Difficulty -->
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="w-12 h-12 rounded-xl bg-qm-gold-500/10 border border-qm-gold-400/20 text-qm-gold-400 flex items-center justify-center shadow-glow-gold shrink-0">
                <mat-icon class="text-2xl">{{ badge.icon }}</mat-icon>
              </div>
              
              <div class="flex flex-col gap-1 items-end">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" 
                      [class]="getDifficultyClass(badge.difficulty)">
                  {{ badge.difficulty }}
                </span>
                <span class="text-[9px] font-semibold text-qm-text-muted tracking-wide uppercase mt-1">
                  {{ badge.badge_type }}
                </span>
              </div>
            </div>

            <!-- Header Title -->
            <h3 class="font-outfit text-base font-bold text-white m-0 mb-1 leading-snug">{{ badge.name }}</h3>
            <p class="text-xs text-qm-text-secondary leading-relaxed m-0 mb-4 h-9 overflow-hidden text-ellipsis">{{ badge.description }}</p>
          </div>

          <!-- Bottom Meta & Actions -->
          <div class="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
            <span class="text-[11px] text-qm-text-muted font-bold uppercase tracking-wide">Seuil: {{ badge.threshold }}</span>
            
            <div class="flex items-center gap-1.5">
              <!-- Edit Button -->
              <button class="w-7 h-7 rounded-lg bg-white/[0.03] hover:bg-qm-primary-600/20 hover:text-qm-primary-300 border border-white/5 text-qm-text-secondary flex items-center justify-center cursor-pointer transition-all duration-150" 
                      (click)="editBadge(badge)" 
                      title="Modifier">
                <mat-icon class="text-base w-4.5 h-4.5">edit</mat-icon>
              </button>
              
              <!-- Delete Button -->
              <button class="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-white/5 text-red-400 flex items-center justify-center cursor-pointer transition-all duration-150" 
                      (click)="deleteBadge(badge)" 
                      title="Supprimer">
                <mat-icon class="text-base w-4.5 h-4.5">delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BadgeManagement implements OnInit {
  badges: Badge[] = [];
  loading = true;
  showCreateForm = false;
  editingBadge: Badge | null = null;
  badgeForm: any = {
    name: '', description: '', badge_type: 'quiz_count', difficulty: 'bronze', icon: 'emoji_events', threshold: 1
  };

  constructor(private badgeService: BadgeService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadBadges();
  }

  loadBadges(): void {
    this.badgeService.adminGetBadges().subscribe({
      next: (res) => { this.badges = res.results || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.editingBadge = null;
      this.resetForm();
    }
  }

  cancelEdit(): void {
    this.showCreateForm = false;
    this.editingBadge = null;
    this.resetForm();
  }

  saveBadge(): void {
    const obs = this.editingBadge
      ? this.badgeService.adminUpdateBadge(this.editingBadge.id, this.badgeForm)
      : this.badgeService.adminCreateBadge(this.badgeForm);

    obs.subscribe({
      next: () => {
        this.loadBadges();
        this.showCreateForm = false;
        this.editingBadge = null;
        this.resetForm();
        this.snackBar.open('Badge sauvegardé', 'OK', { duration: 3000 });
      },
      error: (err) => this.snackBar.open('Erreur: ' + JSON.stringify(err.error), 'OK', { duration: 5000 })
    });
  }

  editBadge(badge: Badge): void {
    this.editingBadge = badge;
    this.badgeForm = { ...badge };
    this.showCreateForm = true;
  }

  deleteBadge(badge: Badge): void {
    if (confirm(`Supprimer le badge "${badge.name}" ?`)) {
      this.badgeService.adminDeleteBadge(badge.id).subscribe({
        next: () => {
          this.badges = this.badges.filter(b => b.id !== badge.id);
          this.snackBar.open('Badge supprimé', 'OK', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur', 'OK', { duration: 3000 })
      });
    }
  }

  getDifficultyClass(diff: string): string {
    const key = diff?.toLowerCase();
    if (key === 'bronze') return 'bg-amber-800/20 text-amber-500 border border-amber-800/30';
    if (key === 'silver') return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    if (key === 'gold') return 'bg-qm-gold-500/20 text-qm-gold-400 border border-qm-gold-500/30';
    return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
  }

  private resetForm(): void {
    this.badgeForm = { name: '', description: '', badge_type: 'quiz_count', difficulty: 'bronze', icon: 'emoji_events', threshold: 1 };
  }
}
