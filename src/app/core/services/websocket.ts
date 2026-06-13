import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { NotificationService } from './notification';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private connectedSubject = new BehaviorSubject<boolean>(false);
  connected$ = this.connectedSubject.asObservable();

  private pollSubscription: Subscription | null = null;

  constructor(private notificationService: NotificationService) {}

  connect(): void {
    // Using polling as a simpler alternative to WebSockets
    this.notificationService.refreshUnreadCount();
    this.pollSubscription = interval(30000).subscribe(() => {
      this.notificationService.refreshUnreadCount();
    });
    this.connectedSubject.next(true);
  }

  disconnect(): void {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
      this.pollSubscription = null;
    }
    this.connectedSubject.next(false);
  }
}
