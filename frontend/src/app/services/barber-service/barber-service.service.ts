import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Service } from '../../models/service.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class BarberServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getServices(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(this.apiUrl);
  }

  addService(service: Service): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(this.apiUrl, service);
  }

  editService(id: string, service: Service): Observable<ApiResponse<Service>> {
    return this.http.put<ApiResponse<Service>>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

}