import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Badge, UserBadge } from '../models';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class BadgeService {
  constructor(private http: HttpClient) {}

  getCatalog(): Observable<{ results: Badge[] }> {
    return this.http.get<{ results: Badge[] }>(`${API_URL}/badges/catalog/`);
  }

  getMyBadges(): Observable<{ results: UserBadge[] }> {
    return this.http.get<{ results: UserBadge[] }>(`${API_URL}/badges/my-badges/`);
  }

  // Admin
  adminGetBadges(): Observable<{ results: Badge[] }> {
    return this.http.get<{ results: Badge[] }>(`${API_URL}/badges/admin/`);
  }

  adminCreateBadge(data: Partial<Badge>): Observable<Badge> {
    return this.http.post<Badge>(`${API_URL}/badges/admin/`, data);
  }

  adminUpdateBadge(id: number, data: Partial<Badge>): Observable<Badge> {
    return this.http.patch<Badge>(`${API_URL}/badges/admin/${id}/`, data);
  }

  adminDeleteBadge(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/badges/admin/${id}/`);
  }

  adminAwardBadge(userId: number, badgeId: number): Observable<UserBadge> {
    return this.http.post<UserBadge>(`${API_URL}/badges/admin/award/`, {
      user_id: userId,
      badge_id: badgeId,
    });
  }
}
