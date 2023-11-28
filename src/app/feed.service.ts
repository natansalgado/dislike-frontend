import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPosts(token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getPost(id: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/${id}`, { headers });
  }

  newPost(userId: string, content: string, answerTo?: string | null) {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post<any>(
        this.apiUrl,
        { userId, content, answerTo },
        { headers }
      );
    }

    return null;
  }

  likePost(userId: string, postId: string) {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post<any>(
        `${this.apiUrl}/like/${userId}/${postId}`,
        null,
        { headers }
      );
    }

    return null;
  }
}
