import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="relative min-h-screen flex items-center justify-center bg-qm-bg-base overflow-hidden p-5">
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
      <div class="relative z-10 w-full max-w-[500px] bg-qm-bg-surface/80 backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.05)] animate-slide-up">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-2">
          <div class="w-12 h-12 rounded-[14px] bg-gradient-to-br from-qm-primary-600 to-qm-accent-500 flex items-center justify-center shadow-glow-primary">
            <span class="font-outfit text-base font-black text-white">QM</span>
          </div>
          <h1 class="font-outfit text-2xl md:text-3xl font-normal text-white m-0">
            Quiz<strong class="font-black bg-gradient-to-r from-qm-primary-600 to-qm-accent-500 bg-clip-text text-transparent">Master</strong>
          </h1>
        </div>

        <p class="text-sm text-qm-text-secondary mb-6">Rejoignez l'aventure et commencez à grimper au classement !</p>

        <!-- Error banner -->
        <div *ngIf="error" class="flex items-center gap-2.5 p-3 mb-5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <mat-icon class="text-lg w-[18px] h-[18px] shrink-0">error_outline</mat-icon>
          <span>{{ error }}</span>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <!-- First / Last Name Row -->
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="font-outfit text-[13px] font-semibold text-qm-text-secondary tracking-wide">Prénom</label>
              <div class="flex items-center gap-2.5 px-4 h-12 bg-white/[0.04] border border-white/10 rounded-xl transition-all duration-200" [class.border-qm-primary-500]="fnFocused" [class.bg-qm-primary-500/5]="fnFocused">
                <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-sm" 
                       [(ngModel)]="firstName" 
                       name="firstName" 
                       placeholder="Jean" 
                       (focus)="fnFocused=true" 
                       (blur)="fnFocused=false" />
              </div>
            </div>
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="font-outfit text-[13px] font-semibold text-qm-text-secondary tracking-wide">Nom</label>
              <div class="flex items-center gap-2.5 px-4 h-12 bg-white/[0.04] border border-white/10 rounded-xl transition-all duration-200" [class.border-qm-primary-500]="lnFocused" [class.bg-qm-primary-500/5]="lnFocused">
                <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-sm" 
                       [(ngModel)]="lastName" 
                       name="lastName" 
                       placeholder="Dupont" 
                       (focus)="lnFocused=true" 
                       (blur)="lnFocused=false" />
              </div>
            </div>
          </div>

          <!-- Username -->
          <div class="flex flex-col gap-1.5">
            <label class="font-outfit text-[13px] font-semibold text-qm-text-secondary tracking-wide">Nom d'utilisateur</label>
            <div class="flex items-center gap-2.5 px-4 h-12 bg-white/[0.04] border border-white/10 rounded-xl transition-all duration-200" [class.border-qm-primary-500]="userFocused" [class.bg-qm-primary-500/5]="userFocused">
              <mat-icon class="text-lg w-[18px] h-[18px] text-qm-text-muted transition-colors duration-200" [class.text-qm-primary-300]="userFocused">person</mat-icon>
              <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-sm" 
                     [(ngModel)]="username" 
                     name="username" 
                     placeholder="jeandupont" 
                     required 
                     (focus)="userFocused=true" 
                     (blur)="userFocused=false" />
            </div>
          </div>

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

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <label class="font-outfit text-[13px] font-semibold text-qm-text-secondary tracking-wide">Mot de passe</label>
            <div class="flex items-center gap-2.5 px-4 h-12 bg-white/[0.04] border border-white/10 rounded-xl transition-all duration-200" [class.border-qm-primary-500]="passFocused" [class.bg-qm-primary-500/5]="passFocused">
              <mat-icon class="text-lg w-[18px] h-[18px] text-qm-text-muted transition-colors duration-200" [class.text-qm-primary-300]="passFocused">lock</mat-icon>
              <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-sm" 
                     [type]="hidePassword ? 'password' : 'text'" 
                     [(ngModel)]="password" 
                     name="password" 
                     placeholder="••••••••" 
                     required 
                     (focus)="passFocused=true" 
                     (blur)="passFocused=false" />
              <button type="button" class="bg-none border-none cursor-pointer text-qm-text-muted flex items-center p-0 transition-colors duration-200 hover:text-white" (click)="hidePassword=!hidePassword">
                <mat-icon class="text-lg w-[18px] h-[18px]">{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="flex flex-col gap-1.5">
            <label class="font-outfit text-[13px] font-semibold text-qm-text-secondary tracking-wide">Confirmer le mot de passe</label>
            <div class="flex items-center gap-2.5 px-4 h-12 bg-white/[0.04] border border-white/10 rounded-xl transition-all duration-200" [class.border-qm-primary-500]="confirmFocused" [class.bg-qm-primary-500/5]="confirmFocused">
              <mat-icon class="text-lg w-[18px] h-[18px] text-qm-text-muted transition-colors duration-200" [class.text-qm-primary-300]="confirmFocused">lock_outline</mat-icon>
              <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-sm" 
                     [type]="hideConfirm ? 'password' : 'text'" 
                     [(ngModel)]="passwordConfirm" 
                     name="passwordConfirm" 
                     placeholder="••••••••" 
                     required 
                     (focus)="confirmFocused=true" 
                     (blur)="confirmFocused=false" />
              <button type="button" class="bg-none border-none cursor-pointer text-qm-text-muted flex items-center p-0 transition-colors duration-200 hover:text-white" (click)="hideConfirm=!hideConfirm">
                <mat-icon class="text-lg w-[18px] h-[18px]">{{ hideConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </div>
          </div>

          <button type="submit" 
                  class="w-full h-[50px] border-none rounded-xl bg-gradient-to-r from-qm-primary-600 to-qm-accent-500 text-white font-outfit text-sm font-bold cursor-pointer transition-all duration-200 shadow-glow-primary flex items-center justify-center gap-2 mt-2 hover:translate-y-[-2px] hover:shadow-[0_0_36px_rgba(139,92,246,0.6)] disabled:opacity-75 disabled:cursor-not-allowed" 
                  [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading" class="flex items-center gap-2">
              <mat-icon class="text-lg w-[18px] h-[18px]">person_add</mat-icon>
              S'inscrire
            </span>
          </button>
        </form>

        <p class="text-center text-sm text-qm-text-secondary mt-5 m-0">
          Déjà un compte ? 
          <a routerLink="/auth/login" class="text-qm-accent-400 font-semibold no-underline hover:text-qm-accent-500 hover:underline">Se connecter</a>
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
export class Register {
  email = ''; username = ''; firstName = ''; lastName = '';
  password = ''; passwordConfirm = '';
  loading = false; error = '';
  hidePassword = true; hideConfirm = true;
  fnFocused = false; lnFocused = false; userFocused = false; emailFocused = false; passFocused = false; confirmFocused = false;

  stars = Array.from({ length: 40 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    size: Math.random() * 2 + 1
  }));

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.password !== this.passwordConfirm) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.register({
      email: this.email, username: this.username,
      first_name: this.firstName, last_name: this.lastName,
      password: this.password, password_confirm: this.passwordConfirm
    }).subscribe({
      next: () => this.router.navigate(['/quizzes']),
      error: (err) => {
        this.loading = false;
        const errors = err.error;
        if (errors) {
          this.error = Object.values(errors).flat().join(' ');
        } else {
          this.error = 'Erreur lors de l\'inscription.';
        }
      }
    });
  }
}
