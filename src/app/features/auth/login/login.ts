import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="auth-page">

      <!-- Animated background -->
      <div class="auth-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="grid-overlay"></div>
      </div>

      <!-- Stars -->
      <div class="stars">
        <div class="star" *ngFor="let s of stars" [style.left]="s.x+'%'" [style.top]="s.y+'%'" [style.animationDelay]="s.delay+'s'" [style.width]="s.size+'px'" [style.height]="s.size+'px'"></div>
      </div>

      <!-- Card -->
      <div class="auth-card">

        <!-- Logo -->
        <div class="auth-logo">
          <div class="auth-logo-icon">
            <span>QM</span>
          </div>
          <h1 class="auth-brand">Quiz<strong>Master</strong></h1>
        </div>

        <p class="auth-subtitle">Connectez-vous pour continuer votre aventure</p>

        <!-- Error -->
        <div class="error-banner" *ngIf="error">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error }}</span>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="auth-form">

          <div class="field-group">
            <label class="field-label">Adresse e-mail</label>
            <div class="input-wrap" [class.focused]="emailFocused">
              <mat-icon class="input-icon">email</mat-icon>
              <input class="qm-input"
                     type="email"
                     [(ngModel)]="email"
                     name="email"
                     placeholder="vous@exemple.com"
                     required
                     (focus)="emailFocused=true"
                     (blur)="emailFocused=false" />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Mot de passe</label>
            <div class="input-wrap" [class.focused]="passFocused">
              <mat-icon class="input-icon">lock</mat-icon>
              <input class="qm-input"
                     [type]="hidePassword ? 'password' : 'text'"
                     [(ngModel)]="password"
                     name="password"
                     placeholder="••••••••"
                     required
                     (focus)="passFocused=true"
                     (blur)="passFocused=false" />
              <button type="button" class="toggle-pass" (click)="hidePassword=!hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </div>
          </div>

          <div class="auth-links-row">
            <a routerLink="/auth/forgot-password" class="forgot-link">Mot de passe oublié ?</a>
          </div>

          <button type="submit" class="submit-btn" [class.loading]="loading" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">
              <mat-icon>login</mat-icon>
              Se connecter
            </span>
          </button>
        </form>

        <p class="register-cta">
          Pas encore de compte ?
          <a routerLink="/auth/register" class="register-link">Créer un compte</a>
        </p>

        <!-- Divider features -->
        <div class="auth-features">
          <div class="feature">
            <mat-icon>emoji_events</mat-icon>
            <span>Badges</span>
          </div>
          <div class="feature">
            <mat-icon>leaderboard</mat-icon>
            <span>Classements</span>
          </div>
          <div class="feature">
            <mat-icon>quiz</mat-icon>
            <span>Quiz illimités</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--qm-bg-base);
      overflow: hidden;
      padding: 20px;
    }

    /* ── Animated background ── */
    .auth-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: qm-orb-move 12s ease-in-out infinite;
    }
    .orb-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%);
      top: -150px; left: -100px;
      animation-duration: 15s;
    }
    .orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%);
      bottom: -100px; right: -80px;
      animation-duration: 18s;
      animation-delay: -5s;
    }
    .orb-3 {
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      animation-duration: 20s;
      animation-delay: -10s;
    }

    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    /* ── Stars ── */
    .stars { position: absolute; inset: 0; pointer-events: none; }
    .star {
      position: absolute;
      border-radius: 50%;
      background: white;
      animation: qm-star-twinkle 3s ease-in-out infinite;
    }

    /* ── Card ── */
    .auth-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
      background: rgba(22, 27, 46, 0.85);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(148, 163, 184, 0.1);
      border-radius: var(--qm-radius-2xl);
      padding: 40px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
      animation: qm-slide-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ── Logo ── */
    .auth-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .auth-logo-icon {
      width: 48px; height: 48px;
      border-radius: 14px;
      background: var(--qm-gradient-brand);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--qm-glow-primary);
      span {
        font-family: 'Outfit', sans-serif;
        font-size: 16px;
        font-weight: 900;
        color: white;
      }
    }

    .auth-brand {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 400;
      color: var(--qm-text-primary);
      margin: 0;
      strong {
        font-weight: 900;
        background: var(--qm-gradient-brand);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .auth-subtitle {
      font-size: 14px;
      color: var(--qm-text-secondary);
      margin: 0 0 28px;
    }

    /* ── Error ── */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--qm-radius-md);
      margin-bottom: 20px;
      color: #f87171;
      font-size: 14px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    }

    /* ── Form ── */
    .auth-form { display: flex; flex-direction: column; gap: 16px; }

    .field-group { display: flex; flex-direction: column; gap: 6px; }

    .field-label {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: var(--qm-text-secondary);
      letter-spacing: 0.3px;
    }

    .input-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 16px;
      height: 48px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(148,163,184,0.12);
      border-radius: var(--qm-radius-md);
      transition: var(--qm-transition);

      &.focused {
        border-color: var(--qm-primary-500);
        background: rgba(139,92,246,0.06);
        box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
        .input-icon { color: var(--qm-primary-300); }
      }
    }

    .input-icon {
      font-size: 18px; width: 18px; height: 18px;
      color: var(--qm-text-muted);
      transition: var(--qm-transition);
      flex-shrink: 0;
    }

    .qm-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: var(--qm-text-primary);
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 400;
      &::placeholder { color: var(--qm-text-muted); }
    }

    .toggle-pass {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--qm-text-muted);
      display: flex;
      align-items: center;
      padding: 0;
      transition: var(--qm-transition);
      &:hover { color: var(--qm-text-secondary); }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    /* ── Forgot row ── */
    .auth-links-row {
      display: flex;
      justify-content: flex-end;
      margin-top: -4px;
    }

    .forgot-link {
      font-size: 13px;
      color: var(--qm-primary-300);
      text-decoration: none;
      transition: var(--qm-transition);
      &:hover { color: var(--qm-primary-500); }
    }

    /* ── Submit ── */
    .submit-btn {
      width: 100%;
      height: 50px;
      border: none;
      border-radius: var(--qm-radius-md);
      background: var(--qm-gradient-brand);
      background-size: 200% 200%;
      color: white;
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: var(--qm-transition);
      box-shadow: var(--qm-glow-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 4px;

      span { display: flex; align-items: center; gap: 8px; }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 0 36px rgba(139,92,246,0.6);
      }
      &:active:not(:disabled) { transform: translateY(0); }
      &:disabled { opacity: 0.7; cursor: not-allowed; }
      &.loading { animation: qm-pulse-glow 1.5s infinite; }
    }

    /* ── Register link ── */
    .register-cta {
      text-align: center;
      font-size: 14px;
      color: var(--qm-text-secondary);
      margin: 20px 0 0;
    }

    .register-link {
      color: var(--qm-accent-400);
      font-weight: 600;
      text-decoration: none;
      transition: var(--qm-transition);
      &:hover { color: var(--qm-accent-500); text-decoration: underline; }
    }

    /* ── Features strip ── */
    .auth-features {
      display: flex;
      justify-content: space-around;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--qm-border);
    }

    .feature {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: var(--qm-text-muted);
      font-size: 12px;
      font-weight: 500;
      transition: var(--qm-transition);
      mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--qm-primary-500); }
      &:hover { color: var(--qm-text-secondary); }
    }
  `]
})
export class Login {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  error = '';
  emailFocused = false;
  passFocused = false;

  // Generate random stars
  stars = Array.from({ length: 40 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    size: Math.random() * 2 + 1
  }));

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/quizzes']),
      error: (err) => {
        this.loading = false;
        this.error = err.error?.detail || 'Erreur de connexion. Vérifiez vos identifiants.';
      }
    });
  }
}
