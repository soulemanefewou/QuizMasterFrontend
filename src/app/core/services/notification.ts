import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Notification } from '../models';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<{ results: Notification[] }> {
    return this.http.get<{ results: Notification[] }>(`${API_URL}/notifications/`);
  }

  getUnreadCount(): Observable<{ unread_count: number }> {
    return this.http.get<{ unread_count: number }>(`${API_URL}/notifications/unread-count/`).pipe(
      tap((data) => this.unreadCountSubject.next(data.unread_count))
    );
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(`${API_URL}/notifications/${id}/read/`, {}).pipe(
      tap(() => this.unreadCountSubject.next(Math.max(0, this.unreadCountSubject.value - 1)))
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${API_URL}/notifications/mark-all-read/`, {}).pipe(
      tap(() => this.unreadCountSubject.next(0))
    );
  }

  // Admin
  sendGlobalNotification(title: string, message: string): Observable<Notification> {
    return this.http.post<Notification>(`${API_URL}/notifications/admin/send/`, {
      title,
      message,
      notification_type: 'admin_announcement',
      is_global: true,
    });
  }

  refreshUnreadCount(): void {
    this.getUnreadCount().subscribe();
  }
}
