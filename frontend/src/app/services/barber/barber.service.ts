import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Barber } from '../../models/barber.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class BarberService {
  private apiUrl = `${environment.apiUrl}/barbers`;

  constructor(private http: HttpClient) {}

  getBarbers(): Observable<ApiResponse<Barber[]>> {
    return this.http.get<ApiResponse<Barber[]>>(this.apiUrl);
  }

  getBarberById(id: string): Observable<ApiResponse<Barber>> {
    return this.http.get<ApiResponse<Barber>>(`${this.apiUrl}/${id}`);
  }

  addBarber(barber: Barber): Observable<ApiResponse<Barber>> {
    return this.http.post<ApiResponse<Barber>>(this.apiUrl, barber);
  }

  editBarber(id: string, barber: Barber): Observable<ApiResponse<Barber>> {
    return this.http.put<ApiResponse<Barber>>(`${this.apiUrl}/${id}`, barber);
  }

  deleteBarber(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

}
