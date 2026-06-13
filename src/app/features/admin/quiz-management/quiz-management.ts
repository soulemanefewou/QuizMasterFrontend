import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { QuizService } from '../../../core/services/quiz';
import { Quiz } from '../../../core/models';

@Component({
  selector: 'app-quiz-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MatMenuModule
  ],
  template: `
    <div class="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="font-outfit text-2xl md:text-3xl font-extrabold text-white m-0">Gestion des Quiz</h1>
          <p class="text-sm text-qm-text-secondary m-0 mt-1">Créez, modifiez, publiez ou importez des quiz</p>
        </div>

        <!-- Filters and Actions -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Search input -->
          <div class="flex items-center gap-2 px-3 h-10 bg-white/[0.04] border border-white/10 rounded-xl transition-all duration-200 min-w-[200px]"
               [class.border-qm-primary-500]="searchFocused"
               [class.bg-qm-primary-500/5]="searchFocused">
            <mat-icon class="text-base w-4.5 h-4.5 text-qm-text-muted transition-colors duration-200" [class.text-qm-primary-300]="searchFocused">search</mat-icon>
            <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-xs"
                   [(ngModel)]="searchTerm"
                   (ngModelChange)="filterQuizzes()"
                   placeholder="Rechercher..."
                   (focus)="searchFocused=true;"
                   (blur)="searchFocused=false;" />
          </div>

          <!-- Status Select -->
          <div class="flex items-center gap-2 px-3 h-10 bg-white/[0.04] border border-white/10 rounded-xl">
            <mat-icon class="text-base w-4.5 h-4.5 text-qm-text-muted">tune</mat-icon>
            <select [(ngModel)]="statusFilter" 
                    (ngModelChange)="filterQuizzes()" 
                    class="bg-transparent border-none outline-none text-white font-outfit text-xs font-semibold pr-4 cursor-pointer">
              <option value="" class="bg-qm-bg-surface text-white">Tous les statuts</option>
              <option value="draft" class="bg-qm-bg-surface text-white">Brouillon</option>
              <option value="published" class="bg-qm-bg-surface text-white">Publié</option>
              <option value="archived" class="bg-qm-bg-surface text-white">Archivé</option>
            </select>
          </div>

          <!-- Import Trigger -->
          <button class="flex items-center gap-1.5 px-4 h-10 bg-qm-primary-600/10 hover:bg-qm-primary-600/20 text-qm-primary-300 font-outfit text-xs font-bold rounded-xl border border-qm-primary-500/20 cursor-pointer transition-all duration-150"
                  (click)="showImportDialog()">
            <mat-icon class="text-base w-4.5 h-4.5">upload_file</mat-icon>
            Importer JSON
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Quiz Table Card -->
      <div class="bg-qm-bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden"
           *ngIf="!loading && filteredQuizzes.length > 0">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02] border-b border-white/5">
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider w-16">ID</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Titre</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Catégorie</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Difficulté</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Statut</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Questions</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Tentatives</th>
                <th class="px-6 py-4 w-16 text-right"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let q of filteredQuizzes" class="border-b border-white/5 hover:bg-white/[0.015] transition-colors duration-150">
                <td class="px-6 py-4 text-sm font-semibold text-qm-text-muted">#{{ q.id }}</td>
                <td class="px-6 py-4 text-sm font-bold text-white max-w-[200px] truncate">{{ q.title }}</td>
                <td class="px-6 py-4 text-sm text-qm-text-secondary">{{ q.category }}</td>
                <td class="px-6 py-4 text-sm">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        [class]="getDifficultyClass(q.difficulty)">
                    {{ getDifficultyLabel(q.difficulty) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        [class]="getStatusClass(q.status)">
                    {{ q.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-qm-text-secondary font-semibold">{{ q.question_count }}</td>
                <td class="px-6 py-4 text-sm text-qm-text-secondary font-semibold">{{ q.attempt_count }}</td>
                <td class="px-6 py-4 text-right">
                  <button class="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-qm-text-secondary hover:text-white flex items-center justify-center border border-white/5 transition-all duration-150 cursor-pointer ml-auto"
                          [matMenuTriggerFor]="menu">
                    <mat-icon class="text-base w-4.5 h-4.5">more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu" class="qm-user-menu">
                    <button mat-menu-item (click)="publishQuiz(q)" *ngIf="q.status === 'draft'">
                      <mat-icon>publish</mat-icon> <span>Publier</span>
                    </button>
                    <button mat-menu-item (click)="archiveQuiz(q)" *ngIf="q.status !== 'archived'">
                      <mat-icon>archive</mat-icon> <span>Archiver</span>
                    </button>
                    <button mat-menu-item class="logout-item" (click)="deleteQuiz(q)">
                      <mat-icon class="text-red-400">delete</mat-icon> <span class="text-red-400">Supprimer</span>
                    </button>
                  </mat-menu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div class="text-center py-20 bg-qm-bg-surface/50 border border-dashed border-white/10 rounded-2xl"
           *ngIf="!loading && filteredQuizzes.length === 0">
        <div class="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto text-qm-text-muted mb-4">
          <mat-icon class="text-3xl">search_off</mat-icon>
        </div>
        <h3 class="font-outfit text-lg font-bold text-white m-0">Aucun quiz trouvé</h3>
        <p class="text-sm text-qm-text-secondary m-0 mt-1">Aucun quiz ne correspond à vos critères.</p>
      </div>

      <!-- Import Textarea Card -->
      <div *ngIf="importing" class="mt-8 bg-qm-bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] animate-slide-up">
        <h3 class="font-outfit text-lg font-bold text-white m-0 mb-3 flex items-center gap-2">
          <mat-icon class="text-qm-primary-300">upload_file</mat-icon>
          Importer un Quiz (JSON)
        </h3>
        
        <div class="mb-4">
          <textarea [(ngModel)]="importJson" 
                    rows="8" 
                    class="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-xs font-mono text-white outline-none focus:border-qm-primary-500 focus:bg-qm-primary-500/5 transition-all duration-200" 
                    placeholder="Collez ici la structure JSON du quiz..."></textarea>
        </div>
        
        <div class="flex items-center justify-end gap-3">
          <button class="px-4 h-10 border border-white/10 hover:border-white/20 text-qm-text-secondary hover:text-white font-outfit text-xs font-bold rounded-xl bg-transparent cursor-pointer transition-all duration-150"
                  (click)="importing = false">
            Annuler
          </button>
          <button class="px-5 h-10 bg-gradient-to-r from-qm-primary-600 to-qm-accent-500 text-white font-outfit text-xs font-bold rounded-xl border-none cursor-pointer transition-all duration-150 shadow-glow-primary hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]"
                  (click)="importQuiz()">
            Valider l'import
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class QuizManagement implements OnInit {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  searchTerm = '';
  statusFilter = '';
  loading = true;
  importing = false;
  importJson = '';
  searchFocused = false;

  constructor(
    private quizService: QuizService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.adminGetQuizzes().subscribe({
      next: (res) => {
        this.quizzes = res.results || [];
        this.filteredQuizzes = this.quizzes;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  filterQuizzes(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredQuizzes = this.quizzes.filter(q => {
      const matchSearch = !term || q.title.toLowerCase().includes(term) || q.category.toLowerCase().includes(term);
      const matchStatus = !this.statusFilter || q.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  showImportDialog(): void {
    this.importing = true;
    this.importJson = '';
  }

  importQuiz(): void {
    try {
      const data = JSON.parse(this.importJson);
      this.quizService.adminImportQuiz(data).subscribe({
        next: (quiz) => {
          this.quizzes.unshift(quiz);
          this.filterQuizzes();
          this.importing = false;
          this.snackBar.open('Quiz importé avec succès', 'OK', { duration: 3000 });
        },
        error: (err) => this.snackBar.open('Erreur: ' + (err.error?.error || 'Import échoué'), 'OK', { duration: 5000 })
      });
    } catch (e) {
      this.snackBar.open('JSON invalide', 'OK', { duration: 3000 });
    }
  }

  publishQuiz(quiz: Quiz): void {
    this.quizService.adminPublishQuiz(quiz.id).subscribe({
      next: () => { quiz.status = 'published'; this.snackBar.open('Quiz publié', 'OK', { duration: 3000 }); },
      error: () => this.snackBar.open('Erreur', 'OK', { duration: 3000 })
    });
  }

  archiveQuiz(quiz: Quiz): void {
    this.quizService.adminArchiveQuiz(quiz.id).subscribe({
      next: () => { quiz.status = 'archived'; this.snackBar.open('Quiz archivé', 'OK', { duration: 3000 }); },
      error: () => this.snackBar.open('Erreur', 'OK', { duration: 3000 })
    });
  }

  deleteQuiz(quiz: Quiz): void {
    if (confirm(`Supprimer le quiz "${quiz.title}" ?`)) {
      this.quizService.adminDeleteQuiz(quiz.id).subscribe({
        next: () => {
          this.quizzes = this.quizzes.filter(q => q.id !== quiz.id);
          this.filterQuizzes();
          this.snackBar.open('Quiz supprimé', 'OK', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur', 'OK', { duration: 3000 })
      });
    }
  }

  getDifficultyClass(diff: string): string {
    const key = diff?.toLowerCase();
    if (key === 'easy') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
    if (key === 'medium') return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
    return 'bg-red-500/15 text-red-400 border border-red-500/20';
  }

  getDifficultyLabel(diff: string): string {
    return diff === 'easy' ? 'Facile' : diff === 'medium' ? 'Moyen' : 'Difficile';
  }

  getStatusClass(status: string): string {
    const key = status?.toLowerCase();
    if (key === 'draft') return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    if (key === 'published') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    return 'bg-white/[0.04] text-qm-text-secondary border border-white/5';
  }
}
