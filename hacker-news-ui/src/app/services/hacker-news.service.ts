import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StoryDto {
  id: number;
  title: string;
  url: string | null;
}

@Injectable({ providedIn: 'root' })
export class HackerNewsService {
  private apiBaseUrl = (window as any)['env']?.apiBaseUrl || 'http://localhost:5037/api/stories';

  constructor(private http: HttpClient) { }

  getNewestStories(page: number = 1, pageSize: number = 20, search: string = ''): Observable<StoryDto[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<StoryDto[]>(`${this.apiBaseUrl}/newest`, { params });
  }
} 