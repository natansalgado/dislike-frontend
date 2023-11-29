import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ip } from 'src/ipConfig';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `http://${ip}:8080/api`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserLoggedIn() {
    const token = this.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http.get<any>(`${this.apiUrl}/users/loggedin`, { headers });
    }

    return null;
  }
}
