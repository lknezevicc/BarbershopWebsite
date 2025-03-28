import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../models/appointment.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointmentsForBarberAndDate(barberId: string, date: string): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/barber-appointments?barberId=${barberId}&date=${date}`);
  }

  cancelAppointment(appointmentId: string): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/${appointmentId}/cancel`, {});
  }

  completeAppointment(appointmentId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${appointmentId}/complete`, {});
  }

  getUserAppointments(userId: string): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/user/${userId}`);
  }

  getAvailabilityForBarberAndDate(barberId: string, date: string): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/${barberId}/slots?date=${date}`);
  }

  createReservation(reservation: any): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(`${this.apiUrl}`, reservation);
  }
  
}
