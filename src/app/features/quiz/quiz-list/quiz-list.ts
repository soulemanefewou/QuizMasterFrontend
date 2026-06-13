import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuizService } from '../../../core/services/quiz';
import { Quiz } from '../../../core/models';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="quiz-list-page">

      <!-- Hero Section -->
      <div class="hero">
        <div class="hero-content">
          <div class="hero-badge">
            <mat-icon>auto_awesome</mat-icon>
            <span>{{ quizzes.length }} quiz disponibles</span>
          </div>
          <h1 class="hero-title">Choisissez votre <span class="gradient-text">Challenge</span></h1>
          <p class="hero-sub">Testez vos connaissances, grimpez au classement et débloquez des badges exclusifs.</p>
        </div>
        <div class="hero-orb"></div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-wrap" [class.focused]="searchFocused">
          <mat-icon>search</mat-icon>
          <input
            class="search-input"
            type="text"
            [(ngModel)]="search"
            (ngModelChange)="loadQuizzes()"
            placeholder="Rechercher un quiz..."
            (focus)="searchFocused=true"
            (blur)="searchFocused=false" />
          <button class="clear-search" *ngIf="search" (click)="search=''; loadQuizzes()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="filter-chips">
          <button class="chip" [class.chip--active]="category===''" (click)="category=''; loadQuizzes()">Toutes</button>
          <button *ngFor="let c of categories"
                  class="chip"
                  [class.chip--active]="category===c"
                  (click)="category=c; loadQuizzes()">{{ c }}</button>
        </div>

        <div class="diff-chips">
          <button class="diff-chip" [class.diff--active]="difficulty===''" (click)="difficulty=''; loadQuizzes()">Tous</button>
          <button class="diff-chip diff-easy"   [class.diff--active]="difficulty==='easy'"   (click)="difficulty='easy';   loadQuizzes()">
            <mat-icon>sentiment_satisfied</mat-icon> Facile
          </button>
          <button class="diff-chip diff-medium" [class.diff--active]="difficulty==='medium'" (click)="difficulty='medium'; loadQuizzes()">
            <mat-icon>sentiment_neutral</mat-icon> Moyen
          </button>
          <button class="diff-chip diff-hard"   [class.diff--active]="difficulty==='hard'"   (click)="difficulty='hard';   loadQuizzes()">
            <mat-icon>whatshot</mat-icon> Difficile
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner-wrap">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
        <p>Chargement des quiz…</p>
      </div>

      <!-- Quiz Grid -->
      <div class="quiz-grid" *ngIf="!loading">
        <a class="quiz-card" *ngFor="let quiz of quizzes; let i=index"
           [routerLink]="['/quizzes', quiz.id]"
           [style.animationDelay]="(i*0.05)+'s'">

          <!-- Card header strip -->
          <div class="card-strip" [class]="'strip-'+getCategoryColor(quiz.category)">
            <div class="card-category-icon">
              <mat-icon>{{ getCategoryIcon(quiz.category) }}</mat-icon>
            </div>
            <div class="card-glow"></div>
          </div>

          <!-- Content -->
          <div class="card-body">
            <div class="card-top">
              <span class="diff-badge" [class]="'diff-'+quiz.difficulty">
                {{ getDiffLabel(quiz.difficulty) }}
              </span>
              <span class="card-category">{{ quiz.category }}</span>
            </div>

            <h3 class="card-title">{{ quiz.title }}</h3>
            <p class="card-desc">{{ quiz.description | slice:0:100 }}{{ (quiz.description && quiz.description.length > 100) ? '…' : '' }}</p>

            <div class="card-meta">
              <div class="meta-item">
                <mat-icon>help_outline</mat-icon>
                <span>{{ quiz.question_count }} questions</span>
              </div>
              <div class="meta-item">
                <mat-icon>timer</mat-icon>
                <span>{{ quiz.time_limit / 60 | number:'1.0-0' }} min</span>
              </div>
              <div class="meta-item">
                <mat-icon>people</mat-icon>
                <span>{{ quiz.attempt_count }}</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="avg-score">
                <div class="score-bar-track">
                  <div class="score-bar-fill" [style.width]="(quiz.avg_score || 0)+'%'"></div>
                </div>
                <span>Moy. {{ quiz.avg_score | number:'1.0-0' }}%</span>
              </div>
              <div class="play-btn">
                <mat-icon>play_arrow</mat-icon>
              </div>
            </div>
          </div>
        </a>
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading && quizzes.length === 0">
        <div class="empty-icon">
          <mat-icon>search_off</mat-icon>
        </div>
        <h3>Aucun quiz trouvé</h3>
        <p>Essayez de modifier vos filtres de recherche</p>
        <button class="reset-btn" (click)="resetFilters()">
          <mat-icon>refresh</mat-icon> Réinitialiser les filtres
        </button>
      </div>

    </div>
  `,
  styles: [`
    .quiz-list-page {
      max-width: 1400px;
      margin: 0 auto;
      animation: qm-fade-in 0.4s ease;
    }

    /* ── Hero ── */
    .hero {
      position: relative;
      padding: 40px 0 32px;
      overflow: hidden;
    }

    .hero-content { position: relative; z-index: 1; }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.25);
      border-radius: 20px;
      margin-bottom: 16px;
      font-size: 13px;
      font-weight: 600;
      color: var(--qm-primary-300);
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    .hero-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 800;
      color: var(--qm-text-primary);
      margin: 0 0 12px;
      line-height: 1.2;
    }

    .gradient-text {
      background: var(--qm-gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-sub {
      font-size: 16px;
      color: var(--qm-text-secondary);
      margin: 0;
      max-width: 500px;
    }

    .hero-orb {
      position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    /* ── Filters ── */
    .filters-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
      padding: 16px 20px;
      background: rgba(22,27,46,0.6);
      border: 1px solid var(--qm-border);
      border-radius: var(--qm-radius-lg);
      backdrop-filter: blur(12px);
    }

    .search-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 220px;
      padding: 8px 14px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(148,163,184,0.1);
      border-radius: var(--qm-radius-md);
      transition: var(--qm-transition);
      mat-icon { color: var(--qm-text-muted); font-size: 18px; width: 18px; height: 18px; }
      &.focused {
        border-color: var(--qm-primary-500);
        box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        mat-icon { color: var(--qm-primary-300); }
      }
    }

    .search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: var(--qm-text-primary);
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      &::placeholder { color: var(--qm-text-muted); }
    }

    .clear-search {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--qm-text-muted);
      display: flex;
      align-items: center;
      padding: 0;
      &:hover { color: var(--qm-text-secondary); }
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    .filter-chips, .diff-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .chip {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid rgba(148,163,184,0.12);
      background: rgba(255,255,255,0.03);
      color: var(--qm-text-secondary);
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: var(--qm-transition);
      &:hover { border-color: rgba(139,92,246,0.3); color: var(--qm-text-primary); }
      &--active {
        background: rgba(139,92,246,0.15);
        border-color: rgba(139,92,246,0.4);
        color: var(--qm-primary-300);
        font-weight: 600;
      }
    }

    .diff-chip {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 5px 12px;
      border-radius: 20px;
      border: 1px solid rgba(148,163,184,0.12);
      background: rgba(255,255,255,0.03);
      color: var(--qm-text-secondary);
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: var(--qm-transition);
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
      &.diff--active { font-weight: 700; }
    }
    .diff-easy.diff--active  { background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.4);  color: #34d399; }
    .diff-medium.diff--active { background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.4); color: #fbbf24; }
    .diff-hard.diff--active   { background: rgba(239,68,68,0.15);  border-color: rgba(239,68,68,0.4);  color: #f87171; }

    /* ── Loading ── */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 80px 0;
      color: var(--qm-text-secondary);
    }
    .spinner-wrap { position: relative; }

    /* ── Grid ── */
    .quiz-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    /* ── Card ── */
    .quiz-card {
      display: flex;
      flex-direction: column;
      background: rgba(22,27,46,0.8);
      border: 1px solid rgba(148,163,184,0.08);
      border-radius: var(--qm-radius-xl);
      overflow: hidden;
      text-decoration: none;
      transition: var(--qm-transition-slow);
      cursor: pointer;
      animation: qm-slide-in-up 0.4s ease both;
      backdrop-filter: blur(12px);

      &:hover {
        transform: translateY(-6px);
        border-color: rgba(139,92,246,0.3);
        box-shadow: 0 20px 60px rgba(0,0,0,0.4), var(--qm-glow-primary);
        .play-btn {
          background: var(--qm-gradient-brand);
          transform: scale(1.1);
          box-shadow: var(--qm-glow-primary);
        }
        .card-strip .card-glow { opacity: 1; }
      }
    }

    /* Card top strip */
    .card-strip {
      position: relative;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .strip-violet { background: linear-gradient(135deg, #4c1d95, #7c3aed); }
    .strip-cyan   { background: linear-gradient(135deg, #164e63, #06b6d4); }
    .strip-gold   { background: linear-gradient(135deg, #78350f, #f59e0b); }
    .strip-green  { background: linear-gradient(135deg, #064e3b, #10b981); }
    .strip-pink   { background: linear-gradient(135deg, #831843, #ec4899); }
    .strip-blue   { background: linear-gradient(135deg, #1e3a8a, #3b82f6); }

    .card-category-icon {
      width: 48px; height: 48px;
      border-radius: 14px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon { font-size: 24px; color: white; }
    }

    .card-glow {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.05);
      opacity: 0;
      transition: var(--qm-transition);
    }

    /* Card body */
    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .diff-badge {
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .diff-badge.diff-easy   { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
    .diff-badge.diff-medium { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
    .diff-badge.diff-hard   { background: rgba(239,68,68,0.15);  color: #f87171; border: 1px solid rgba(239,68,68,0.3); }

    .card-category {
      font-size: 12px;
      color: var(--qm-text-muted);
      font-weight: 500;
    }

    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: var(--qm-text-primary);
      margin: 0;
      line-height: 1.3;
    }

    .card-desc {
      font-size: 13px;
      color: var(--qm-text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    .card-meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--qm-text-muted);
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--qm-border);
      margin-top: auto;
    }

    .avg-score {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      span { font-size: 11px; color: var(--qm-text-muted); }
    }

    .score-bar-track {
      height: 4px;
      background: rgba(255,255,255,0.06);
      border-radius: 2px;
      overflow: hidden;
    }

    .score-bar-fill {
      height: 100%;
      background: var(--qm-gradient-brand);
      border-radius: 2px;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .play-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--qm-transition);
      color: var(--qm-primary-300);
      mat-icon { font-size: 18px; }
    }

    /* ── Empty state ── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 80px 20px;
      text-align: center;
    }

    .empty-icon {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: rgba(139,92,246,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon { font-size: 36px; color: var(--qm-primary-500); }
    }

    .empty-state h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--qm-text-primary);
      margin: 0;
    }

    .empty-state p {
      font-size: 14px;
      color: var(--qm-text-secondary);
      margin: 0;
    }

    .reset-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      border-radius: var(--qm-radius-md);
      border: 1px solid rgba(139,92,246,0.3);
      background: rgba(139,92,246,0.08);
      color: var(--qm-primary-300);
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--qm-transition);
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { background: rgba(139,92,246,0.15); }
    }

    @media (max-width: 600px) {
      .quiz-grid { grid-template-columns: 1fr; }
      .filters-bar { flex-direction: column; align-items: stretch; }
    }
  `]
})
export class QuizList implements OnInit {
  quizzes: Quiz[] = [];
  categories: string[] = [];
  search = '';
  category = '';
  difficulty = '';
  loading = false;
  searchFocused = false;

  private categoryColors: Record<string, string> = {};
  private colorList = ['violet', 'cyan', 'gold', 'green', 'pink', 'blue'];
  private colorIndex = 0;

  private categoryIcons: Record<string, string> = {
    default: 'quiz',
    science: 'science',
    histoire: 'history_edu',
    géographie: 'public',
    culture: 'theater_comedy',
    sport: 'sports_soccer',
    tech: 'computer',
    musique: 'music_note',
    cinema: 'movie',
    littérature: 'menu_book',
    math: 'calculate',
  };

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadQuizzes();
    this.quizService.adminGetCategories().subscribe(cats => this.categories = cats);
  }

  loadQuizzes(): void {
    this.loading = true;
    const params: any = {};
    if (this.search) params.search = this.search;
    if (this.category) params.category = this.category;
    if (this.difficulty) params.difficulty = this.difficulty;
    this.quizService.getQuizzes(params).subscribe({
      next: (res) => { this.quizzes = res.results || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  resetFilters(): void {
    this.search = '';
    this.category = '';
    this.difficulty = '';
    this.loadQuizzes();
  }

  getCategoryColor(cat: string): string {
    if (!this.categoryColors[cat]) {
      this.categoryColors[cat] = this.colorList[this.colorIndex % this.colorList.length];
      this.colorIndex++;
    }
    return this.categoryColors[cat];
  }

  getCategoryIcon(cat: string): string {
    const key = cat?.toLowerCase();
    return this.categoryIcons[key] || this.categoryIcons['default'];
  }

  getDiffLabel(d: string): string {
    return d === 'easy' ? 'Facile' : d === 'medium' ? 'Moyen' : 'Difficile';
  }
}
