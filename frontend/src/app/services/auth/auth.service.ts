import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<ApiResponse<{ token: string }>> {
    return this.http.post<ApiResponse<{ token: string }>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.success) {
          localStorage.setItem('token', response.data.token);
        }
      })
    );
  }

  register(registerData: 
    { firstName: string; lastName: string; email: string; phone: string; password: string }
  ): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/register`, registerData);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role;
    }
    return null;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id;
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  
}
