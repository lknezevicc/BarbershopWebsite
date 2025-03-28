import { Component, Input, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { UserService } from '../../services/user/user.service';
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-history',
  standalone: false,

  templateUrl: './user-history.component.html',
  styleUrl: './user-history.component.scss'
})

export class UserHistoryComponent implements OnInit {
  @Input() userId!: string;
  appointments: Appointment[] = [];
  user: User | null = null;
  sortField: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  filterText: string = '';

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loadUserHistory();
    this.loadUserData();
  }

  loadUserHistory(): void {
    this.appointmentService.getUserAppointments(this.userId).subscribe((response) => {
      if (response.success) this.appointments = response.data;
    });
  }

  loadUserData(): void {
    this.userService.getUser(this.userId).subscribe((response) => {
      if (response.success) this.user = response.data;
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  shouldShowCancel(appointment: Appointment): boolean {
    if (!this.isAdmin()) {
      return appointment.status === 'booked';
    }
    return appointment.status !== 'booked';
  }
  
  shouldShowComplete(appointment: Appointment): boolean {
    return this.isAdmin() && appointment.status !== 'booked' && appointment.status !== 'cancelled';
  }

  canComplete(timeSlot: string, selectedDate: Date): boolean {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(hours, minutes, 0, 0);
  
    const currentDateTime = new Date();
    return currentDateTime >= slotDateTime;
  }

  cancelAppointment(appointmentId: string): void {
    const result = confirm('Are you sure you want to cancel the appointment?');
    if (!result) return;

    this.appointmentService.cancelAppointment(appointmentId).subscribe((response) => {
      if (response.success) {
        alert(response.message);
        this.loadUserHistory();
      }
    });
  }

  completeAppointment(appointmentId: string): void {
    const result = confirm('Are you sure you want to complete the appointment?');
    if (!result) return;
    
    this.appointmentService.completeAppointment(appointmentId).subscribe((response) => {
      if (response.success) {
        alert(response.message);
        this.loadUserHistory();
      }
    });
  }

  setSortField(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
  }

}