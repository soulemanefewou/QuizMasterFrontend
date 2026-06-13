import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuizService } from '../../../core/services/quiz';
import { AttemptService } from '../../../core/services/attempt';
import { Question, AttemptAnswerSubmit, QuizStartResponse } from '../../../core/models';

@Component({
  selector: 'app-quiz-attempt',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="attempt-page">

      <!-- Loading State -->
      <div class="attempt-loading" *ngIf="loading">
        <div class="loading-card">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Chargement du quiz…</p>
        </div>
      </div>

      <!-- Quiz Interface -->
      <div class="attempt-layout" *ngIf="quizData && !loading">

        <!-- Top bar -->
        <div class="attempt-topbar">
          <div class="quiz-title-wrap">
            <div class="quiz-icon">
              <mat-icon>quiz</mat-icon>
            </div>
            <div>
              <h2 class="quiz-title">{{ quizData.title }}</h2>
              <span class="quiz-progress-label">Question {{ currentQuestion + 1 }} / {{ quizData.questions.length }}</span>
            </div>
          </div>

          <!-- Circular timer -->
          <div class="timer-wrap" [class.timer-danger]="timerDanger">
            <svg class="timer-svg" viewBox="0 0 80 80">
              <circle class="timer-track" cx="40" cy="40" r="34" />
              <circle class="timer-progress" cx="40" cy="40" r="34"
                      [style.strokeDashoffset]="timerOffset"
                      [style.stroke]="timerDanger ? '#ef4444' : '#8b5cf6'" />
            </svg>
            <div class="timer-text" [class.timer-text-danger]="timerDanger">
              <span class="timer-digits">{{ formatTime(timeRemaining) }}</span>
              <span class="timer-sub">restant</span>
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-track">
          <div class="progress-fill" [style.width]="((currentQuestion + 1) / quizData.questions.length * 100) + '%'"></div>
          <div class="progress-segments">
            <div *ngFor="let q of quizData.questions; let i=index"
                 class="progress-dot"
                 [class.dot-done]="i < currentQuestion"
                 [class.dot-current]="i === currentQuestion"
                 [class.dot-answered]="selectedAnswers[q.id]">
            </div>
          </div>
        </div>

        <!-- Question card -->
        <div class="question-card" *ngIf="currentQuestionData" [style.animationName]="cardAnimation">
          <!-- Points badge -->
          <div class="points-badge">
            <mat-icon>star</mat-icon>
            {{ currentQuestionData.points }} pt{{ currentQuestionData.points > 1 ? 's' : '' }}
          </div>

          <!-- Question text -->
          <h3 class="question-text">{{ currentQuestionData.text }}</h3>

          <!-- Answers -->
          <div class="answers-grid">
            <button *ngFor="let answer of currentQuestionData.answers; let ai=index"
                    class="answer-btn"
                    [class.answer-selected]="selectedAnswers[currentQuestionData.id] === answer.id"
                    (click)="selectAnswer(currentQuestionData.id, answer.id)">
              <span class="answer-letter">{{ answerLetters[ai] }}</span>
              <span class="answer-text">{{ answer.text }}</span>
              <div class="answer-check" *ngIf="selectedAnswers[currentQuestionData.id] === answer.id">
                <mat-icon>check</mat-icon>
              </div>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="attempt-nav">
          <button class="nav-btn nav-prev"
                  (click)="previousQuestion()"
                  [disabled]="currentQuestion === 0">
            <mat-icon>arrow_back</mat-icon>
            <span>Précédent</span>
          </button>

          <!-- Question dots mini -->
          <div class="q-dots">
            <div *ngFor="let q of quizData.questions; let i=index"
                 class="q-dot"
                 [class.q-dot-current]="i === currentQuestion"
                 [class.q-dot-answered]="selectedAnswers[q.id]"
                 (click)="goToQuestion(i)">
            </div>
          </div>

          <button class="nav-btn nav-next"
                  *ngIf="currentQuestion < quizData.questions.length - 1"
                  (click)="nextQuestion()">
            <span>Suivant</span>
            <mat-icon>arrow_forward</mat-icon>
          </button>

          <button class="submit-btn"
                  *ngIf="currentQuestion === quizData.questions.length - 1"
                  (click)="submitQuiz()"
                  [disabled]="submitting">
            <mat-spinner *ngIf="submitting" diameter="18"></mat-spinner>
            <span *ngIf="!submitting">
              <mat-icon>check_circle</mat-icon>
              Terminer le Quiz
            </span>
          </button>
        </div>

        <!-- Answered summary -->
        <div class="answered-summary">
          <span class="answered-count">
            {{ getAnsweredCount() }} / {{ quizData.questions.length }} répondues
          </span>
          <div class="answered-bar">
            <div class="answered-fill"
                 [style.width]="(getAnsweredCount() / quizData.questions.length * 100) + '%'"></div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .attempt-page {
      max-width: 860px;
      margin: 0 auto;
      animation: qm-fade-in 0.4s ease;
    }

    /* ── Loading ── */
    .attempt-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }
    .loading-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 48px;
      background: rgba(22,27,46,0.8);
      border: 1px solid var(--qm-border);
      border-radius: var(--qm-radius-xl);
      color: var(--qm-text-secondary);
      font-size: 14px;
    }

    /* ── Layout ── */
    .attempt-layout {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* ── Topbar ── */
    .attempt-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: rgba(22,27,46,0.8);
      border: 1px solid var(--qm-border);
      border-radius: var(--qm-radius-xl);
      backdrop-filter: blur(12px);
    }

    .quiz-title-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .quiz-icon {
      width: 48px; height: 48px;
      border-radius: 14px;
      background: var(--qm-gradient-brand);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--qm-glow-primary);
      mat-icon { color: white; font-size: 22px; }
    }

    .quiz-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--qm-text-primary);
      margin: 0;
    }

    .quiz-progress-label {
      font-size: 13px;
      color: var(--qm-text-secondary);
    }

    /* ── Circular timer ── */
    .timer-wrap {
      position: relative;
      width: 80px; height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .timer-svg {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      transform: rotate(-90deg);
    }

    .timer-track {
      fill: none;
      stroke: rgba(255,255,255,0.06);
      stroke-width: 5;
    }

    .timer-progress {
      fill: none;
      stroke-width: 5;
      stroke-linecap: round;
      stroke-dasharray: 213.6;
      transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
    }

    .timer-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
    }

    .timer-digits {
      font-family: 'Outfit', sans-serif;
      font-size: 17px;
      font-weight: 800;
      color: var(--qm-text-primary);
      line-height: 1;
    }

    .timer-sub {
      font-size: 9px;
      color: var(--qm-text-muted);
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .timer-danger .timer-digits, .timer-text-danger .timer-digits {
      color: #f87171 !important;
      animation: qm-pulse-glow 0.8s infinite;
    }

    /* ── Progress ── */
    .progress-track {
      position: relative;
      height: 6px;
      background: rgba(255,255,255,0.06);
      border-radius: 3px;
      overflow: visible;
    }

    .progress-fill {
      height: 100%;
      background: var(--qm-gradient-brand);
      border-radius: 3px;
      transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
      box-shadow: var(--qm-glow-primary);
    }

    .progress-segments {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0; right: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 4px;
    }

    .progress-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 2px solid rgba(255,255,255,0.12);
      transition: var(--qm-transition);
      &.dot-done     { background: var(--qm-primary-600); border-color: var(--qm-primary-500); }
      &.dot-current  { background: white; border-color: var(--qm-primary-500); transform: scale(1.4); box-shadow: var(--qm-glow-primary); }
      &.dot-answered { background: var(--qm-primary-500); }
    }

    /* ── Question card ── */
    .question-card {
      position: relative;
      padding: 32px;
      background: rgba(22,27,46,0.85);
      border: 1px solid rgba(148,163,184,0.1);
      border-radius: var(--qm-radius-xl);
      backdrop-filter: blur(16px);
      animation: qm-slide-in-up 0.3s ease;
    }

    .points-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      background: rgba(245,158,11,0.12);
      border: 1px solid rgba(245,158,11,0.25);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      color: var(--qm-gold-400);
      margin-bottom: 20px;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    .question-text {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--qm-text-primary);
      margin: 0 0 28px;
      line-height: 1.5;
    }

    /* ── Answers ── */
    .answers-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .answer-btn {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      padding: 16px 20px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(148,163,184,0.1);
      border-radius: var(--qm-radius-md);
      color: var(--qm-text-secondary);
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: var(--qm-transition);

      &:hover:not(.answer-selected) {
        background: rgba(139,92,246,0.06);
        border-color: rgba(139,92,246,0.25);
        color: var(--qm-text-primary);
        .answer-letter { background: rgba(139,92,246,0.2); color: var(--qm-primary-300); }
      }

      &.answer-selected {
        background: rgba(139,92,246,0.12);
        border-color: rgba(139,92,246,0.5);
        color: var(--qm-primary-100);
        box-shadow: 0 0 0 1px rgba(139,92,246,0.3), var(--qm-glow-primary);
        .answer-letter { background: var(--qm-primary-600); color: white; }
      }
    }

    .answer-letter {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      color: var(--qm-text-muted);
      flex-shrink: 0;
      transition: var(--qm-transition);
    }

    .answer-text { flex: 1; line-height: 1.4; }

    .answer-check {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: var(--qm-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      animation: qm-slide-in-up 0.2s ease;
      mat-icon { font-size: 14px; width: 14px; height: 14px; color: white; }
    }

    /* ── Navigation ── */
    .attempt-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 24px;
      background: rgba(22,27,46,0.6);
      border: 1px solid var(--qm-border);
      border-radius: var(--qm-radius-xl);
    }

    .nav-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: var(--qm-radius-md);
      border: 1px solid var(--qm-border);
      background: rgba(255,255,255,0.04);
      color: var(--qm-text-secondary);
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--qm-transition);
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover:not(:disabled) {
        border-color: rgba(139,92,246,0.4);
        background: rgba(139,92,246,0.08);
        color: var(--qm-primary-300);
      }
      &:disabled { opacity: 0.35; cursor: not-allowed; }
    }

    .q-dots {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .q-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      cursor: pointer;
      transition: var(--qm-transition);
      &.q-dot-current  { background: var(--qm-primary-500); transform: scale(1.5); }
      &.q-dot-answered { background: rgba(139,92,246,0.5); }
      &:hover { transform: scale(1.3); }
    }

    .submit-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      border-radius: var(--qm-radius-md);
      border: none;
      background: var(--qm-gradient-brand);
      color: white;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: var(--qm-transition);
      box-shadow: var(--qm-glow-primary);
      span { display: flex; align-items: center; gap: 6px; }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 0 32px rgba(139,92,246,0.6);
      }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    /* ── Answered summary ── */
    .answered-summary {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: rgba(22,27,46,0.5);
      border: 1px solid var(--qm-border);
      border-radius: var(--qm-radius-lg);
    }

    .answered-count {
      font-size: 13px;
      font-weight: 600;
      color: var(--qm-text-secondary);
      white-space: nowrap;
    }

    .answered-bar {
      flex: 1;
      height: 4px;
      background: rgba(255,255,255,0.06);
      border-radius: 2px;
      overflow: hidden;
    }

    .answered-fill {
      height: 100%;
      background: var(--qm-gradient-success);
      border-radius: 2px;
      transition: width 0.4s ease;
    }

    @media (max-width: 600px) {
      .question-card { padding: 20px 16px; }
      .attempt-topbar { flex-direction: column; gap: 12px; align-items: flex-start; }
      .question-text { font-size: 17px; }
    }
  `]
})
export class QuizAttempt implements OnInit, OnDestroy {
  quizData: QuizStartResponse | null = null;
  currentQuestion = 0;
  selectedAnswers: { [questionId: number]: number } = {};
  timeSpent = 0;
  timeRemaining = 0;
  startedAt = '';
  loading = true;
  submitting = false;
  timerDanger = false;
  cardAnimation = 'qm-slide-in-up';
  answerLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  private timerInterval: any;

  get currentQuestionData(): Question | null {
    return this.quizData?.questions[this.currentQuestion] || null;
  }

  get timerOffset(): number {
    if (!this.quizData) return 0;
    const total = this.quizData.time_limit;
    const pct = this.timeRemaining / total;
    return 213.6 * (1 - pct);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private attemptService: AttemptService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quizService.startQuiz(id).subscribe({
      next: (data) => {
        this.quizData = data;
        this.startedAt = data.started_at;
        this.timeRemaining = data.time_limit;
        this.loading = false;
        this.startTimer();
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.detail || 'Impossible de démarrer le quiz.', 'OK', { duration: 3000 });
        this.router.navigate(['/quizzes', id]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeSpent++;
      this.timeRemaining--;
      this.timerDanger = this.timeRemaining <= 30;
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.snackBar.open('Temps écoulé ! Soumission automatique.', 'OK', { duration: 3000 });
        this.submitQuiz();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(Math.max(0, seconds) / 60);
    const s = Math.max(0, seconds) % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  selectAnswer(questionId: number, answerId: number): void {
    this.selectedAnswers[questionId] = answerId;
  }

  goToQuestion(i: number): void {
    this.currentQuestion = i;
    this.cardAnimation = 'none';
    setTimeout(() => this.cardAnimation = 'qm-slide-in-up', 10);
  }

  nextQuestion(): void {
    if (this.quizData && this.currentQuestion < this.quizData.questions.length - 1) {
      this.currentQuestion++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestion > 0) this.currentQuestion--;
  }

  getAnsweredCount(): number {
    return Object.keys(this.selectedAnswers).length;
  }

  onTimeChange(seconds: number): void { this.timeSpent = seconds; }
  onTimeUp(): void {
    this.snackBar.open('Temps écoulé !', 'OK', { duration: 3000 });
    this.submitQuiz();
  }

  submitQuiz(): void {
    if (!this.quizData || this.submitting) return;
    this.submitting = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    const answers: AttemptAnswerSubmit[] = this.quizData.questions.map(q => ({
      question_id: q.id,
      answer_id: this.selectedAnswers[q.id] || null
    }));

    this.attemptService.submitAttempt({
      quiz_id: this.quizData.quiz_id,
      started_at: this.startedAt,
      time_spent: this.timeSpent,
      answers
    }).subscribe({
      next: (attempt) => this.router.navigate(['/quizzes', 'result', attempt.id]),
      error: () => {
        this.submitting = false;
        this.snackBar.open('Erreur lors de la soumission.', 'OK', { duration: 3000 });
      }
    });
  }
}
