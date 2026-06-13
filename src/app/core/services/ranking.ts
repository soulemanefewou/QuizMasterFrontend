import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ranking } from '../models';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class RankingService {
  constructor(private http: HttpClient) {}

  getGlobalRanking(): Observable<{ results: Ranking[] }> {
    return this.http.get<{ results: Ranking[] }>(`${API_URL}/rankings/global/`);
  }

  getWeeklyRanking(): Observable<{ results: Ranking[] }> {
    return this.http.get<{ results: Ranking[] }>(`${API_URL}/rankings/weekly/`);
  }

  getMonthlyRanking(): Observable<{ results: Ranking[] }> {
    return this.http.get<{ results: Ranking[] }>(`${API_URL}/rankings/monthly/`);
  }

  getQuizRanking(quizId: number): Observable<{ results: Ranking[] }> {
    return this.http.get<{ results: Ranking[] }>(`${API_URL}/rankings/quiz/${quizId}/`);
  }

  getMyRankings(): Observable<any> {
    return this.http.get(`${API_URL}/rankings/me/`);
  }
}
