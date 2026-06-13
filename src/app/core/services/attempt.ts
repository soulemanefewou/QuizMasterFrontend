import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attempt, AttemptSubmit, UserStats } from '../models';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AttemptService {
  constructor(private http: HttpClient) {}

  submitAttempt(data: AttemptSubmit): Observable<Attempt> {
    return this.http.post<Attempt>(`${API_URL}/attempts/submit/`, data);
  }

  getHistory(): Observable<{ results: Attempt[] }> {
    return this.http.get<{ results: Attempt[] }>(`${API_URL}/attempts/history/`);
  }

  getAttempt(id: number): Observable<Attempt> {
    return this.http.get<Attempt>(`${API_URL}/attempts/${id}/`);
  }

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${API_URL}/attempts/stats/`);
  }
}
