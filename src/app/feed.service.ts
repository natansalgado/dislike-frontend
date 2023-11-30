import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ip } from 'src/ipConfig';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private apiUrl = `http://${ip}:8080/api/posts`;

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

    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
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

  findAnswers(postId: string, offset: number, limit?: number) {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(
        `${this.apiUrl}/answers?id=${postId}&offset=${offset}&limit=${
          limit || 5
        }`,
        { headers }
      );
    }

    return null;
  }

  getPostsFromUser(id: string): Observable<any[]> | null {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http.get<any[]>(`${this.apiUrl}/user/${id}`, { headers });
    }

    return null;
  }

  getAnswersFromUser(id: string): Observable<any[]> | null {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http.get<any[]>(`${this.apiUrl}/user/answers/${id}`, { headers });
    }

    return null;
  }
}
