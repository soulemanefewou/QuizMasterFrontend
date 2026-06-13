import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Tokens,
} from '../models';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'access_token';
  private refreshKey = 'refresh_token';
  private userKey = 'current_user';

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const stored = localStorage.getItem(this.userKey);
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login/`, data).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register/`, data).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  logout(): void {
    const refresh = localStorage.getItem(this.refreshKey);
    if (refresh) {
      this.http.post(`${API_URL}/auth/logout/`, { refresh }).subscribe();
    }
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<Tokens> {
    const refresh = localStorage.getItem(this.refreshKey);
    return this.http.post<Tokens>(`${API_URL}/auth/token/refresh/`, { refresh }).pipe(
      tap((tokens) => {
        localStorage.setItem(this.tokenKey, tokens.access);
        if (tokens.refresh) {
          localStorage.setItem(this.refreshKey, tokens.refresh);
        }
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${API_URL}/auth/profile/`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.userKey, JSON.stringify(user));
      })
    );
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${API_URL}/auth/profile/`, data).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.userKey, JSON.stringify(user));
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${API_URL}/auth/change-password/`, {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${API_URL}/auth/forgot-password/`, { email });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'super_admin';
  }

  isSuperAdmin(): boolean {
    return this.getCurrentUser()?.role === 'super_admin';
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.tokens.access);
    localStorage.setItem(this.refreshKey, response.tokens.refresh);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }
}
