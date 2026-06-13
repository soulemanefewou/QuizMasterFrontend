import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../core/models';
import { environment } from '../../../../environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="font-outfit text-2xl md:text-3xl font-extrabold text-white m-0">Gestion des Utilisateurs</h1>
          <p class="text-sm text-qm-text-secondary m-0 mt-1">Gérez les comptes, rôles et statuts d'accès</p>
        </div>
        
        <!-- Search bar -->
        <div class="flex items-center gap-2.5 px-4 h-11 bg-white/[0.04] border border-white/10 rounded-xl transition-all duration-200 min-w-[280px]" 
             [class.border-qm-primary-500]="searchFocused" 
             [class.bg-qm-primary-500/5]="searchFocused">
          <mat-icon class="text-lg w-[18px] h-[18px] text-qm-text-muted transition-colors duration-200" [class.text-qm-primary-300]="searchFocused">search</mat-icon>
          <input class="flex-1 bg-transparent border-none outline-none text-white font-outfit text-sm" 
                 [(ngModel)]="searchTerm" 
                 (ngModelChange)="filterUsers()" 
                 placeholder="Rechercher par nom, e-mail..." 
                 (focus)="searchFocused=true" 
                 (blur)="searchFocused=false" />
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Users Table Card -->
      <div class="bg-qm-bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden" 
           *ngIf="!loading && filteredUsers.length > 0">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02] border-b border-white/5">
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider w-16">ID</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Nom d'utilisateur</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Adresse Email</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Rôle</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Accès</th>
                <th class="px-6 py-4 text-xs font-bold text-qm-text-secondary uppercase tracking-wider">Quiz Complétés</th>
                <th class="px-6 py-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of filteredUsers" class="border-b border-white/5 hover:bg-white/[0.015] transition-colors duration-150">
                <td class="px-6 py-4 text-sm font-semibold text-qm-text-muted">#{{ u.id }}</td>
                <td class="px-6 py-4 text-sm font-bold text-white flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-qm-primary-600/20 text-qm-primary-300 flex items-center justify-center text-xs font-extrabold">
                    {{ u.username.charAt(0).toUpperCase() }}
                  </div>
                  <span>{{ u.username }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-qm-text-secondary">{{ u.email }}</td>
                <td class="px-6 py-4 text-sm">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" 
                        [class]="getRoleClass(u.role)">
                    {{ u.role }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex items-center gap-1.5" [class.text-emerald-400]="u.is_active" [class.text-red-400]="!u.is_active">
                    <mat-icon class="text-sm w-4 h-4">{{ u.is_active ? 'check_circle' : 'cancel' }}</mat-icon>
                    <span class="font-semibold text-xs">{{ u.is_active ? 'Actif' : 'Bloqué' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-qm-text-secondary font-semibold">{{ u.total_quizzes_taken }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Change Role -->
                    <button class="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-qm-primary-600/20 hover:text-qm-primary-300 border border-white/5 text-qm-text-secondary flex items-center justify-center cursor-pointer transition-all duration-150" 
                            (click)="changeRole(u)" 
                            title="Changer le rôle">
                      <mat-icon class="text-base w-4.5 h-4.5">admin_panel_settings</mat-icon>
                    </button>
                    <!-- Toggle Active -->
                    <button class="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center cursor-pointer transition-all duration-150" 
                            [class]="u.is_active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'"
                            (click)="toggleActive(u)" 
                            [title]="u.is_active ? 'Bloquer' : 'Activer'">
                      <mat-icon class="text-base w-4.5 h-4.5">{{ u.is_active ? 'block' : 'check' }}</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div class="text-center py-20 bg-qm-bg-surface/50 border border-dashed border-white/10 rounded-2xl" 
           *ngIf="!loading && filteredUsers.length === 0">
        <div class="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto text-qm-text-muted mb-4">
          <mat-icon class="text-3xl">people_mute</mat-icon>
        </div>
        <h3 class="font-outfit text-lg font-bold text-white m-0">Aucun utilisateur trouvé</h3>
        <p class="text-sm text-qm-text-secondary m-0 mt-1">Aucun compte ne correspond à votre recherche.</p>
      </div>
    </div>
  `,
  styles: []
})
export class UserManagement implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm = '';
  loading = true;
  searchFocused = false;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any>(`${API_URL}/auth/admin/users/`).subscribe({
      next: (res) => {
        this.users = res.results || [];
        this.filteredUsers = this.users;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  changeRole(user: any): void {
    const roles = ['user', 'admin', 'super_admin'];
    const currentIdx = roles.indexOf(user.role);
    const newRole = roles[(currentIdx + 1) % roles.length];
    this.http.patch(`${API_URL}/auth/admin/users/${user.id}/`, { role: newRole }).subscribe({
      next: () => {
        user.role = newRole;
        this.snackBar.open(`Rôle changé: ${newRole}`, 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erreur lors du changement de rôle', 'OK', { duration: 3000 })
    });
  }

  toggleActive(user: any): void {
    const newState = !user.is_active;
    this.http.patch(`${API_URL}/auth/admin/users/${user.id}/`, { is_active: newState }).subscribe({
      next: () => {
        user.is_active = newState;
        this.snackBar.open(`Utilisateur ${newState ? 'activé' : 'désactivé'}`, 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erreur', 'OK', { duration: 3000 })
    });
  }

  getRoleClass(role: string): string {
    const key = role?.toLowerCase();
    if (key === 'admin') return 'bg-qm-gold-500/15 text-qm-gold-400 border border-qm-gold-400/30';
    if (key === 'super_admin') return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
    return 'bg-qm-primary-600/15 text-qm-primary-300 border border-qm-primary-500/30';
  }
}
