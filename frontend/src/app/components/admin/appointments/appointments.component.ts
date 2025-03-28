import { Component, OnInit } from '@angular/core';
import { BarberService } from '../../../services/barber/barber.service';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { formatDate } from '@angular/common';
import { Barber } from '../../../models/barber.model';
import { Appointment } from '../../../models/appointment.model';

@Component({
  selector: 'app-appointments',
  standalone: false,

  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})

export class AppointmentsComponent implements OnInit {
  barbers: Barber[] = [];
  currentBarberIndex = 0;
  currentBarber: Barber | null = null;
  selectedDate = new Date();
  appointments: Appointment[] = [];
  timeSlots: string[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private barberService: BarberService
  ) {}

  ngOnInit(): void {
    this.loadBarbers();
  }

  loadBarbers(): void {
    this.barberService.getBarbers().subscribe((response) => {
      if (response.success) {
        this.barbers = response.data;
        this.currentBarber = this.barbers[this.currentBarberIndex];
        this.loadAppointments();
      }
    });
  }

  loadAppointments(): void {
    const formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
    if (this.currentBarber) {
      this.appointmentService
        .getAppointmentsForBarberAndDate(this.currentBarber._id, formattedDate)
        .subscribe((response) => {
          if (response.success) {
            this.appointments = response.data.filter(
              (appointment) => appointment.status !== 'cancelled'
            );
            this.generateTimeSlots();
          }
        });
    }
  }

  generateTimeSlots(): void {
    this.timeSlots = [];
    if (!this.currentBarber) return;

    const workingHours = this.currentBarber.workingHours;
    const dayOfWeek = this.selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });

    const dayWorkingHours = workingHours.find((wh) => wh.day === dayOfWeek);

    if (!dayWorkingHours) {
      this.timeSlots.push('This day is off');
      return;
    }

    const startHour = parseInt(dayWorkingHours.start.split(':')[0]);
    const endHour = parseInt(dayWorkingHours.end.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const hourString = hour.toString().padStart(2, '0');
      this.timeSlots.push(`${hourString}:00`);
      this.timeSlots.push(`${hourString}:30`);
    }
  }

  isSlotTaken(slot: string): boolean {
    return this.appointments.some(appointment => appointment.slot === slot);
  }

  canComplete(timeSlot: string, selectedDate: Date): boolean {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(hours, minutes, 0, 0);
  
    const currentDateTime = new Date();
    return currentDateTime >= slotDateTime;
  }
  
  getAppointment(slot: string): Appointment | undefined {
    return this.appointments.find(appointment => appointment.slot === slot);
  }

  previousBarber(): void {
    if (this.currentBarberIndex > 0) {
      this.currentBarberIndex--;
      this.currentBarber = this.barbers[this.currentBarberIndex];
      this.loadAppointments();
    }
  }

  nextBarber(): void {
    if (this.currentBarberIndex < this.barbers.length - 1) {
      this.currentBarberIndex++;
      this.currentBarber = this.barbers[this.currentBarberIndex];
      this.loadAppointments();
    }
  }

  previousDate(): void {
    this.selectedDate = new Date(
      this.selectedDate.setDate(this.selectedDate.getDate() - 1)
    );
    this.loadAppointments();
  }

  nextDate(): void {
    this.selectedDate = new Date(
      this.selectedDate.setDate(this.selectedDate.getDate() + 1)
    );
    this.loadAppointments();
  }

  cancelAppointment(appointmentId: string): void {
    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadAppointments();
          alert(response.message);
        }
      },
      error: (response) => {
        alert(response.message);
      }
    });
  }

  completeAppointment(appointmentId: string): void {
    this.appointmentService.completeAppointment(appointmentId).subscribe((response) => {
      if (response.success) {
        alert(response.message);
        this.loadAppointments();
      }
    });
  }
}