import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.apiUrl);
  }

  getUser(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  addUser(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, user);
  }

  editUser(id: string, user: User): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  changeRole(id: string, role: string): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/${id}/change-role`, { role });
  }

  changePassword(id: string, passwordData: any): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/${id}/change-password`, passwordData);
  }
  
}
