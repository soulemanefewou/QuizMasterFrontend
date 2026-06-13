import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../core/services/notification';
import { Notification } from '../../../core/models';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="max-w-3xl mx-auto p-4 md:p-6 animate-fade-in">
      <div class="flex items-center justify-between gap-4 mb-6">
        <h1 class="font-outfit text-2xl md:text-3xl font-extrabold text-white m-0">Centre de Notifications</h1>
        
        <button class="flex items-center gap-1.5 px-3.5 h-9 bg-qm-primary-600/10 hover:bg-qm-primary-600/20 text-qm-primary-300 font-outfit text-xs font-bold rounded-lg border border-qm-primary-500/20 cursor-pointer transition-all duration-150" 
                (click)="markAllRead()" 
                *ngIf="notifications.length > 0">
          <mat-icon class="text-sm w-4.5 h-4.5">done_all</mat-icon>
          Tout marquer comme lu
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Notifications List -->
      <div class="flex flex-col gap-3" *ngIf="!loading && notifications.length > 0">
        <div *ngFor="let notif of notifications" 
             class="relative flex items-start gap-4 p-4 bg-qm-bg-surface/60 border border-white/5 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-qm-bg-surface/90 hover:border-white/10"
             [class.border-l-4]="!notif.is_read"
             [class.border-l-qm-primary-500]="!notif.is_read"
             [class.bg-qm-primary-600/5]="!notif.is_read"
             (click)="markRead(notif)">
          
          <!-- Icon Wrapper -->
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300"
               [class]="getNotificationIconClass(notif.notification_type)">
            <mat-icon class="text-xl w-5 h-5">{{ getTypeIcon(notif.notification_type) }}</mat-icon>
          </div>

          <!-- Text content -->
          <div class="flex-1 min-w-0 pr-4">
            <h4 class="text-sm font-bold text-white m-0 mb-1 leading-tight flex items-center gap-2">
              {{ notif.title }}
              <span *ngIf="!notif.is_read" class="w-1.5 h-1.5 rounded-full bg-qm-accent-400 shrink-0"></span>
            </h4>
            <p class="text-xs text-qm-text-secondary m-0 leading-relaxed">{{ notif.message }}</p>
          </div>

          <!-- Date -->
          <span class="text-[10px] text-qm-text-muted font-semibold tracking-wide shrink-0 self-start pt-0.5">
            {{ notif.created_at | date:'dd/MM HH:mm' }}
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div class="text-center py-20 bg-qm-bg-surface/50 border border-dashed border-white/10 rounded-2xl" 
           *ngIf="!loading && notifications.length === 0">
        <div class="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto text-qm-text-muted mb-4">
          <mat-icon class="text-3xl">notifications_off</mat-icon>
        </div>
        <h3 class="font-outfit text-lg font-bold text-white m-0">Aucune notification</h3>
        <p class="text-sm text-qm-text-secondary m-0 mt-1">Vous êtes à jour !</p>
      </div>
    </div>
  `,
  styles: []
})
export class NotificationCenter implements OnInit {
  notifications: Notification[] = [];
  loading = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (res) => { this.notifications = res.results || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  markRead(notif: Notification): void {
    if (!notif.is_read) {
      this.notificationService.markAsRead(notif.id).subscribe(() => {
        notif.is_read = true;
      });
    }
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.is_read = true);
    });
  }

  getTypeIcon(type: string): string {
    const icons: any = { new_quiz: 'quiz', badge_unlocked: 'emoji_events', ranking_lost: 'trending_down', admin_announcement: 'campaign' };
    return icons[type] || 'notifications';
  }

  getNotificationIconClass(type: string): string {
    if (type === 'new_quiz') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25';
    if (type === 'badge_unlocked') return 'bg-qm-gold-500/10 text-qm-gold-400 border-qm-gold-400/25';
    if (type === 'ranking_lost') return 'bg-red-500/10 text-red-400 border-red-500/25';
    return 'bg-purple-500/10 text-purple-400 border-purple-500/25';
  }
}
