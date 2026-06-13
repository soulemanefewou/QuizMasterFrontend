import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuizService } from '../../../core/services/quiz';
import { Quiz } from '../../../core/models';

@Component({
  selector: 'app-quiz-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="max-w-3xl mx-auto p-4 md:p-6" *ngIf="quiz">
      <div class="bg-qm-bg-surface/80 backdrop-blur-[12px] border border-white/10 rounded-[20px] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-slide-up">
        <!-- Title and Category -->
        <div class="flex flex-col gap-4 mb-6">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-qm-primary-600/20 text-qm-primary-300 border border-qm-primary-500/30">
              {{ quiz.category }}
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold" [class]="getDifficultyClass(quiz.difficulty)">
              {{ getDifficultyLabel(quiz.difficulty) }}
            </span>
          </div>
          <h1 class="font-outfit text-2xl md:text-3xl font-extrabold text-white leading-tight m-0">{{ quiz.title }}</h1>
        </div>

        <!-- Description -->
        <p class="text-sm md:text-base text-qm-text-secondary leading-relaxed mb-6 border-b border-white/5 pb-6">
          {{ quiz.description }}
        </p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div class="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <mat-icon class="text-qm-primary-300">question_answer</mat-icon>
            <div>
              <div class="text-xs text-qm-text-muted font-medium">Questions</div>
              <div class="text-sm font-bold text-white">{{ quiz.question_count }} questions</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <mat-icon class="text-qm-accent-400">timer</mat-icon>
            <div>
              <div class="text-xs text-qm-text-muted font-medium">Temps Limite</div>
              <div class="text-sm font-bold text-white">{{ quiz.time_limit / 60 | number:'1.0-0' }} minutes</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <mat-icon class="text-qm-primary-300">people</mat-icon>
            <div>
              <div class="text-xs text-qm-text-muted font-medium">Tentatives</div>
              <div class="text-sm font-bold text-white">{{ quiz.attempt_count }} tentatives</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <mat-icon class="text-qm-gold-500">trending_up</mat-icon>
            <div>
              <div class="text-xs text-qm-text-muted font-medium">Score Moyen</div>
              <div class="text-sm font-bold text-white">{{ quiz.avg_score | number:'1.0-0' }}%</div>
            </div>
          </div>
        </div>

        <!-- Max Attempts Alert -->
        <div *ngIf="quiz.max_attempts" class="flex items-center gap-3 p-4 mb-8 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-400 text-sm">
          <mat-icon class="text-lg w-[18px] h-[18px] shrink-0">info</mat-icon>
          <span>Attention : le nombre maximal de tentatives pour ce quiz est limité à <strong>{{ quiz.max_attempts }}</strong>.</span>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-4 items-center border-t border-white/5 pt-6">
          <button class="flex items-center gap-2 px-6 h-12 bg-gradient-to-r from-qm-primary-600 to-qm-accent-500 text-white font-outfit text-sm font-bold rounded-xl shadow-glow-primary border-none cursor-pointer transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_0_32px_rgba(139,92,246,0.6)]" 
                  (click)="startQuiz()">
            <mat-icon class="text-lg w-[18px] h-[18px]">play_arrow</mat-icon>
            Commencer le Quiz
          </button>
          
          <a class="px-5 h-12 flex items-center justify-center border border-white/10 rounded-xl text-qm-text-secondary font-outfit text-sm font-semibold transition-all duration-200 hover:text-white hover:border-white/25 no-underline" 
             routerLink="/quizzes">
            Retour
          </a>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="flex justify-center items-center py-20">
      <mat-spinner diameter="44"></mat-spinner>
    </div>
  `,
  styles: []
})
export class QuizDetail implements OnInit {
  quiz: Quiz | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private router: Router, private quizService: QuizService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quizService.getQuiz(id).subscribe({
      next: (quiz) => { this.quiz = quiz; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/quizzes']); }
    });
  }

  startQuiz(): void {
    if (this.quiz) {
      this.router.navigate(['/quizzes', this.quiz.id, 'attempt']);
    }
  }

  getDifficultyClass(diff: string): string {
    if (diff === 'easy') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (diff === 'medium') return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border border-red-500/30';
  }

  getDifficultyLabel(diff: string): string {
    return diff === 'easy' ? 'Facile' : diff === 'medium' ? 'Moyen' : 'Difficile';
  }
}
