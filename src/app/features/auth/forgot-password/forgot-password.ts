import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="relative min-h-screen flex items-center justify-center bg-qm-bg-base overflow-hidden p-5 w-full">
      <!-- Animated background -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute rounded-full blur-[80px] w-[500px] h-[500px] bg-radial-violet top-[-150px] left-[-100px] animate-orb-1"></div>
        <div class="absolute rounded-full blur-[80px] w-[400px] h-[400px] bg-radial-cyan bottom-[-100px] right-[-80px] animate-orb-2"></div>
        <div class="absolute inset-0 bg-grid-lines bg-[size:40px_40px]"></div>
      </div>

      <!-- Stars -->
      <div class="absolute inset-0 pointer-events-none">
        <div *ngFor="let s of stars" 
             class="absolute rounded-full bg-white animate-twinkle" 
             [style.left]="s.x+'%'" 
             [style.top]="s.y+'%'" 
             [style.animationDelay]="s.delay+'s'" 
             [style.width]="s.size+'px'" 
             [style.height]="s.size+'px'">
        </div>
      </div>

      <!-- Card -->
      <div class="relative z-10 w-full max-w-[450px] bg-qm-bg-surface/80 backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.05)] animate-slide-up">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-2">
          <div class="w-12 h-12 rounded-[14px] bg-gradient-to-br from-qm-primary-600 to-qm-accent-500 flex items-center justify-center shadow-glow-primary">
            <span class="font-outfit text-base font-black text-white">QM</span>
          </div>
          <h1 class="font-outfit text-2xl md:text-3xl font-normal text-white m-0">
            Quiz<strong class="font-black bg-gradient-to-r from-qm-primary-600 to-qm-accent-500 bg-clip-text text-transparent">Master</strong>
          </h1>
        </div>

        <p class="text-sm text-qm-text-secondary mb-6">Récupérez l'accès à votre compte</p>

        <!-- Message banner success -->
        <div *ngIf="success" class="flex items-center gap-2.5 p-3 mb-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
          <mat-icon class="text-lg w-[18px] h-[18px] shrink-0">check_circle</mat-icon>
          <span>{{ success }}</span>
        </div>

        <!-- Error banner -->
        <div *ngIf="error" class="flex items-center gap-2.5 p-3 mb-5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <mat-icon class="text-lg w-[18px] h-[18px] shrink-0">error_outline</mat-icon>
          <span>{{ error }}</span>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" *ngIf="!success" class="flex flex-col gap-4">
          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label class="font-outfit text-[13px] font-semibold text-qm-text-secondary tracking-wide">Adresse e-mail</label>
            <div class="flex items-center gap-2.5 px-4 h-12 bg-white/[0.04] border border-white/10 rounded-xl transition-all duration-200" [class.border-qm-primary-500]="emailFocused" [class.bg-qm-primary-500/5]="emailFocused">
              <mat-icon class="text-lg w-[18px] h-[18px] text-qm-text-muted transition-colors duration-200" [class.text-qm-primary-300]="emailFocused">email</mat-icon>
              <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-sm" 
                     type="email" 
                     [(ngModel)]="email" 
                     name="email" 
                     placeholder="vous@exemple.com" 
                     required 
                     (focus)="emailFocused=true" 
                     (blur)="emailFocused=false" />
            </div>
          </div>

          <button type="submit" 
                  class="w-full h-[50px] border-none rounded-xl bg-gradient-to-r from-qm-primary-600 to-qm-accent-500 text-white font-outfit text-sm font-bold cursor-pointer transition-all duration-200 shadow-glow-primary flex items-center justify-center gap-2 mt-2 hover:translate-y-[-2px] hover:shadow-[0_0_36px_rgba(139,92,246,0.6)] disabled:opacity-75 disabled:cursor-not-allowed" 
                  [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="18"></mat-spinner>
            <span *ngIf="!loading" class="flex items-center gap-2">
              <mat-icon class="text-lg w-[18px] h-[18px]">send</mat-icon>
              Envoyer les instructions
            </span>
          </button>
        </form>

        <p class="text-center text-sm text-qm-text-secondary mt-5 m-0">
          <a routerLink="/auth/login" class="text-qm-primary-300 font-semibold no-underline hover:text-qm-primary-500 hover:underline inline-flex items-center gap-1">
            <mat-icon class="text-base w-4 h-4">arrow_back</mat-icon>
            Retour à la connexion
          </a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .bg-radial-violet {
      background: radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%);
    }
    .bg-radial-cyan {
      background: radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%);
    }
    .bg-grid-lines {
      background-image:
        linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px);
    }
  `]
})
export class ForgotPassword {
  email = ''; success = ''; error = '';
  loading = false;
  emailFocused = false;

  stars = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    size: Math.random() * 2 + 1
  }));

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (!this.email) return;
    this.loading = true;
    this.error = '';
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.success = res.detail || 'Un e-mail de réinitialisation vous a été envoyé.';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Erreur lors de l\'envoi du mail de récupération.';
        this.loading = false;
      }
    });
  }
}
