import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz, QuizStartResponse } from '../models';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private http: HttpClient) {}

  getQuizzes(params?: any): Observable<{ results: Quiz[] }> {
    return this.http.get<{ results: Quiz[] }>(`${API_URL}/quizzes/`, { params });
  }

  getQuiz(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${API_URL}/quizzes/${id}/`);
  }

  startQuiz(id: number): Observable<QuizStartResponse> {
    return this.http.post<QuizStartResponse>(`${API_URL}/quizzes/${id}/start/`, {});
  }

  getCorrection(id: number): Observable<any> {
    return this.http.get(`${API_URL}/quizzes/${id}/correction/`);
  }

  // Admin endpoints
  adminGetQuizzes(params?: any): Observable<{ results: Quiz[] }> {
    return this.http.get<{ results: Quiz[] }>(`${API_URL}/quizzes/admin/`, { params });
  }

  adminGetQuiz(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${API_URL}/quizzes/admin/${id}/`);
  }

  adminCreateQuiz(data: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<Quiz>(`${API_URL}/quizzes/admin/`, data);
  }

  adminUpdateQuiz(id: number, data: Partial<Quiz>): Observable<Quiz> {
    return this.http.patch<Quiz>(`${API_URL}/quizzes/admin/${id}/`, data);
  }

  adminDeleteQuiz(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/quizzes/admin/${id}/`);
  }

  adminImportQuiz(jsonData: any): Observable<Quiz> {
    return this.http.post<Quiz>(`${API_URL}/quizzes/admin/import/`, { json_data: jsonData });
  }

  adminImportQuizFile(file: File): Observable<Quiz> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Quiz>(`${API_URL}/quizzes/admin/import/`, formData);
  }

  adminPublishQuiz(id: number): Observable<any> {
    return this.http.post(`${API_URL}/quizzes/admin/${id}/publish/`, {});
  }

  adminArchiveQuiz(id: number): Observable<any> {
    return this.http.post(`${API_URL}/quizzes/admin/${id}/archive/`, {});
  }

  adminGetCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/quizzes/admin/categories/`);
  }
}
