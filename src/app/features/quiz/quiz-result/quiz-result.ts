import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AttemptService } from '../../../core/services/attempt';
import { Attempt } from '../../../core/models';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="result-page">

      <!-- Loading -->
      <div class="result-loading" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <div class="result-layout" *ngIf="attempt && !loading">

        <!-- Confetti layer -->
        <div class="confetti-layer" *ngIf="attempt.percentage >= 60">
          <div class="confetti-piece" *ngFor="let c of confetti"
               [style.left]="c.x+'%'"
               [style.background]="c.color"
               [style.animationDelay]="c.delay+'s'"
               [style.animationDuration]="c.dur+'s'"
               [style.transform]="'rotate('+c.rot+'deg)'">
          </div>
        </div>

        <!-- Score hero -->
        <div class="score-hero">
          <div class="score-ring" [class]="getScoreClass()">
            <svg class="score-svg" viewBox="0 0 140 140">
              <circle class="ring-track" cx="70" cy="70" r="60" />
              <circle class="ring-fill" cx="70" cy="70" r="60"
                      [style.strokeDashoffset]="scoreOffset"
                      [style.stroke]="getScoreColor()" />
            </svg>
            <div class="score-inner">
              <span class="score-emoji">{{ getScoreEmoji() }}</span>
              <span class="score-pct">{{ attempt.percentage | number:'1.0-0' }}%</span>
              <span class="score-fraction">{{ attempt.score }}/{{ attempt.max_score }}</span>
            </div>
          </div>

          <div class="score-info">
            <h1 class="result-title">{{ getResultTitle() }}</h1>
            <h2 class="quiz-name">{{ attempt.quiz_title }}</h2>

            <div class="result-stats">
              <div class="stat-pill">
                <mat-icon>timer</mat-icon>
                <span>{{ formatTime(attempt.time_spent) }}</span>
              </div>
              <div class="stat-pill" *ngIf="attempt.is_cheating">
                <mat-icon class="warn-icon">warning</mat-icon>
                <span class="warn-text">Triche détectée</span>
              </div>
              <div class="stat-pill" [class]="getScoreClass()">
                <mat-icon>{{ getScoreIcon() }}</mat-icon>
                <span>{{ getScoreLabel() }}</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="result-actions">
              <a class="action-btn action-primary" [routerLink]="['/quizzes', attempt.quiz_id]">
                <mat-icon>replay</mat-icon>
                Refaire le Quiz
              </a>
              <a class="action-btn action-secondary" routerLink="/rankings">
                <mat-icon>leaderboard</mat-icon>
                Classement
              </a>
              <a class="action-btn action-ghost" routerLink="/quizzes">
                <mat-icon>grid_view</mat-icon>
                Tous les Quiz
              </a>
            </div>
          </div>
        </div>

        <!-- Correction section -->
        <div class="correction-section">
          <div class="section-header">
            <div class="section-icon">
              <mat-icon>school</mat-icon>
            </div>
            <div>
              <h3 class="section-title">Correction Pédagogique</h3>
              <p class="section-sub">{{ getCorrectCount() }} / {{ (attempt.answers || []).length }} bonnes réponses</p>
            </div>
            <div class="correct-rate">
              <div class="rate-bar-track">
                <div class="rate-bar-fill" [style.width]="(getCorrectCount()/(attempt.answers || []).length*100)+'%'"></div>
              </div>
            </div>
          </div>

          <div class="answers-list">
            <div *ngFor="let answer of (attempt.answers || []); let i=index"
                 class="answer-item"
                 [class.answer-correct]="answer.is_correct"
                 [class.answer-wrong]="!answer.is_correct">

              <div class="answer-status">
                <mat-icon>{{ answer.is_correct ? 'check_circle' : 'cancel' }}</mat-icon>
              </div>

              <div class="answer-content">
                <p class="answer-question">{{ i+1 }}. {{ answer.question_text }}</p>
                <div class="answer-details">
                  <div class="answer-row your-answer" [class.correct-answer-row]="answer.is_correct">
                    <span class="answer-label">Votre réponse :</span>
                    <span class="answer-value">{{ answer.selected_answer_text || 'Aucune réponse' }}</span>
                  </div>
                  <div class="answer-row correct-row" *ngIf="!answer.is_correct">
                    <span class="answer-label">Bonne réponse :</span>
                    <span class="answer-value correct-value">{{ answer.correct_answer_text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .result-page {
      max-width: 900px;
      margin: 0 auto;
      animation: qm-fade-in 0.5s ease;
    }

    /* ── Loading ── */
    .result-loading {
      display: flex;
      justify-content: center;
      padding: 100px;
    }

    /* ── Layout ── */
    .result-layout {
      display: flex;
      flex-direction: column;
      gap: 28px;
      position: relative;
    }

    /* ── Confetti ── */
    .confetti-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1000;
      overflow: hidden;
    }

    .confetti-piece {
      position: absolute;
      top: -20px;
      width: 10px;
      height: 14px;
      border-radius: 2px;
      animation: confetti-fall linear both;
    }

    @keyframes confetti-fall {
      0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
      80%  { opacity: 1; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }

    /* ── Score hero ── */
    .score-hero {
      display: flex;
      align-items: center;
      gap: 40px;
      padding: 40px;
      background: rgba(22,27,46,0.85);
      border: 1px solid rgba(148,163,184,0.1);
      border-radius: var(--qm-radius-2xl);
      backdrop-filter: blur(16px);
      flex-wrap: wrap;
    }

    /* ── Score ring ── */
    .score-ring {
      position: relative;
      width: 140px;
      height: 140px;
      flex-shrink: 0;
    }

    .score-svg {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      transform: rotate(-90deg);
    }

    .ring-track {
      fill: none;
      stroke: rgba(255,255,255,0.06);
      stroke-width: 8;
    }

    .ring-fill {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: 376.9;
      transition: stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1) 0.3s;
    }

    .score-inner {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .score-emoji { font-size: 24px; line-height: 1; }

    .score-pct {
      font-family: 'Outfit', sans-serif;
      font-size: 30px;
      font-weight: 900;
      color: var(--qm-text-primary);
      line-height: 1;
      animation: qm-count-up 0.8s ease 0.5s both;
    }

    .score-fraction {
      font-size: 12px;
      color: var(--qm-text-muted);
    }

    /* ── Score info ── */
    .score-info {
      flex: 1;
      min-width: 220px;
    }

    .result-title {
      font-family: 'Outfit', sans-serif;
      font-size: 30px;
      font-weight: 900;
      margin: 0 0 6px;
      background: var(--qm-gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .quiz-name {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--qm-text-secondary);
      margin: 0 0 20px;
    }

    /* ── Stats pills ── */
    .result-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }

    .stat-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(148,163,184,0.12);
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      color: var(--qm-text-secondary);
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .warn-icon { color: #f87171; }
    .warn-text  { color: #f87171; }

    .stat-pill.excellent { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); color: #34d399; }
    .stat-pill.good      { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); color: #60a5fa; }
    .stat-pill.average   { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); color: #fbbf24; }
    .stat-pill.poor      { background: rgba(239,68,68,0.1);  border-color: rgba(239,68,68,0.3);  color: #f87171; }

    /* ── Action buttons ── */
    .result-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: var(--qm-radius-md);
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      transition: var(--qm-transition);
      mat-icon { font-size: 18px; width: 18px; height: 18px; }

      &.action-primary {
        background: var(--qm-gradient-brand);
        color: white;
        box-shadow: var(--qm-glow-primary);
        &:hover { transform: translateY(-2px); box-shadow: 0 0 32px rgba(139,92,246,0.6); }
      }
      &.action-secondary {
        background: rgba(6,182,212,0.1);
        border: 1px solid rgba(6,182,212,0.3);
        color: var(--qm-accent-400);
        &:hover { background: rgba(6,182,212,0.2); }
      }
      &.action-ghost {
        background: rgba(255,255,255,0.04);
        border: 1px solid var(--qm-border);
        color: var(--qm-text-secondary);
        &:hover { border-color: rgba(139,92,246,0.3); color: var(--qm-text-primary); }
      }
    }

    /* ── Correction section ── */
    .correction-section {
      background: rgba(22,27,46,0.8);
      border: 1px solid rgba(148,163,184,0.08);
      border-radius: var(--qm-radius-xl);
      backdrop-filter: blur(12px);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 28px;
      border-bottom: 1px solid var(--qm-border);
    }

    .section-icon {
      width: 44px; height: 44px;
      border-radius: 12px;
      background: rgba(6,182,212,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { color: var(--qm-accent-400); font-size: 20px; }
    }

    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: var(--qm-text-primary);
      margin: 0 0 2px;
    }

    .section-sub {
      font-size: 13px;
      color: var(--qm-text-secondary);
      margin: 0;
    }

    .correct-rate { flex: 1; }

    .rate-bar-track {
      height: 6px;
      background: rgba(255,255,255,0.06);
      border-radius: 3px;
      overflow: hidden;
    }

    .rate-bar-fill {
      height: 100%;
      background: var(--qm-gradient-success);
      border-radius: 3px;
      transition: width 1s ease 0.5s;
    }

    /* ── Answers list ── */
    .answers-list {
      padding: 16px 28px 28px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .answer-item {
      display: flex;
      gap: 16px;
      padding: 16px 20px;
      border-radius: var(--qm-radius-md);
      border: 1px solid transparent;
      transition: var(--qm-transition);

      &.answer-correct {
        background: rgba(16,185,129,0.06);
        border-color: rgba(16,185,129,0.2);
        .answer-status mat-icon { color: #34d399; }
      }
      &.answer-wrong {
        background: rgba(239,68,68,0.05);
        border-color: rgba(239,68,68,0.15);
        .answer-status mat-icon { color: #f87171; }
      }
    }

    .answer-status {
      flex-shrink: 0;
      margin-top: 2px;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .answer-content { flex: 1; }

    .answer-question {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--qm-text-primary);
      margin: 0 0 8px;
      line-height: 1.4;
    }

    .answer-details { display: flex; flex-direction: column; gap: 4px; }

    .answer-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }

    .answer-label {
      color: var(--qm-text-muted);
      font-weight: 500;
      min-width: 120px;
    }

    .answer-value {
      color: var(--qm-text-secondary);
      font-weight: 400;
    }

    .correct-value {
      color: #34d399;
      font-weight: 600;
    }

    .correct-answer-row .answer-value {
      color: #34d399;
      font-weight: 600;
    }

    @media (max-width: 640px) {
      .score-hero { flex-direction: column; align-items: center; text-align: center; padding: 28px 20px; }
      .result-actions { justify-content: center; }
      .result-stats { justify-content: center; }
      .answers-list { padding: 12px 16px 20px; }
    }
  `]
})
export class QuizResult implements OnInit {
  attempt: Attempt | null = null;
  loading = true;
  confetti: any[] = [];
  scoreOffset = 376.9;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attemptService: AttemptService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.attemptService.getAttempt(id).subscribe({
      next: (attempt) => {
        this.attempt = attempt;
        this.loading = false;
        if (attempt.percentage >= 60) this.generateConfetti();
        // Animate score ring after render
        setTimeout(() => {
          this.scoreOffset = 376.9 * (1 - attempt.percentage / 100);
        }, 100);
      },
      error: () => { this.loading = false; this.router.navigate(['/quizzes']); }
    });
  }

  generateConfetti(): void {
    const colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#3b82f6'];
    this.confetti = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3,
      dur: 2.5 + Math.random() * 2,
      rot: Math.random() * 360
    }));
  }

  getScoreClass(): string {
    if (!this.attempt) return '';
    if (this.attempt.percentage >= 80) return 'excellent';
    if (this.attempt.percentage >= 60) return 'good';
    if (this.attempt.percentage >= 40) return 'average';
    return 'poor';
  }

  getScoreColor(): string {
    if (!this.attempt) return '#8b5cf6';
    if (this.attempt.percentage >= 80) return '#10b981';
    if (this.attempt.percentage >= 60) return '#3b82f6';
    if (this.attempt.percentage >= 40) return '#f59e0b';
    return '#ef4444';
  }

  getScoreEmoji(): string {
    if (!this.attempt) return '';
    if (this.attempt.percentage >= 80) return '🏆';
    if (this.attempt.percentage >= 60) return '🎯';
    if (this.attempt.percentage >= 40) return '📚';
    return '💪';
  }

  getResultTitle(): string {
    if (!this.attempt) return '';
    if (this.attempt.percentage >= 80) return 'Excellent !';
    if (this.attempt.percentage >= 60) return 'Bien joué !';
    if (this.attempt.percentage >= 40) return 'Pas mal !';
    return 'Continuez à vous entraîner !';
  }

  getScoreIcon(): string {
    if (!this.attempt) return 'star';
    if (this.attempt.percentage >= 80) return 'emoji_events';
    if (this.attempt.percentage >= 60) return 'thumb_up';
    if (this.attempt.percentage >= 40) return 'trending_up';
    return 'fitness_center';
  }

  getScoreLabel(): string {
    if (!this.attempt) return '';
    if (this.attempt.percentage >= 80) return 'Excellent';
    if (this.attempt.percentage >= 60) return 'Bien';
    if (this.attempt.percentage >= 40) return 'Moyen';
    return 'À améliorer';
  }

  getCorrectCount(): number {
    return this.attempt?.answers?.filter(a => a.is_correct).length || 0;
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }
}
