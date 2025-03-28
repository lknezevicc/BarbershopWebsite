import { Component, OnInit } from '@angular/core';
import { BarberService } from '../../services/barber/barber.service';
import { Barber } from '../../models/barber.model';
import { Service } from '../../models/service.model';
import { AppointmentService } from '../../services/appointment/appointment.service';

@Component({
  selector: 'app-booking',
  standalone: false,

  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})

export class BookingComponent implements OnInit {
  barbers: Barber[] = [];
  availableSlots: string[] = [];

  selectedBarber: Barber | null = null;
  selectedService: Service | null = null;
  selectedDate: string | null = null;
  selectedSlot: string | null = null;

  minDate: string = new Date().toISOString().split('T')[0];
  maxDate: string;

  constructor(
    private barberService: BarberService,
    private appointmentService: AppointmentService
  ) {
    const max = new Date();
    max.setMonth(max.getMonth() + 1);
    this.maxDate = max.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadBarbers();
  }

  loadBarbers(): void {
    this.barberService.getBarbers().subscribe((response) => {
      if (response.success) this.barbers = response.data;
    });
  }

  onBarberChange(): void {
    this.selectedService = null;
    this.selectedDate = null;
    this.availableSlots = [];
  }

  onServiceChange(): void {
    this.selectedDate = null;
    this.availableSlots = [];
  }

  loadAvailability(): void {
    if (this.selectedDate && this.selectedBarber) {
      this.appointmentService
        .getAvailabilityForBarberAndDate(this.selectedBarber._id, this.selectedDate)
        .subscribe({
          next: (response) => {
            if (response.success) {
              const now = new Date();
              const selectedDate = new Date(this.selectedDate!);
              this.availableSlots = response.data.filter((slot) => {
                const [hour, minute] = slot.split(':').map(Number);
                const slotDate = new Date(selectedDate);
                slotDate.setHours(hour, minute, 0, 0);

                return slotDate > now && slotDate.getTime() - now.getTime() >= 3600000;
              });
            }
          },
          error: () => {
            alert('Error fetching availability');
          },
        });
    }
  }

  confirmReservation(): void {
    if (this.selectedBarber && this.selectedService && this.selectedDate && this.selectedSlot) {
      
      const reservation = {
        barber: this.selectedBarber._id,
        service: this.selectedService._id,
        date: this.selectedDate,
        slot: this.selectedSlot,
      };

      this.appointmentService.createReservation(reservation).subscribe({
        next: (response) => {
          if (response.success) {
            alert(response.message);
            this.resetForm();
          }
        },
        error: (error) => alert(error.error.message)
      });
    }
  }

  get hasServices(): boolean {
    return this.selectedBarber !== null && this.selectedBarber.services.length > 0;
  }

  resetForm(): void {
    this.selectedBarber = null;
    this.selectedService = null;
    this.selectedDate = null;
    this.selectedSlot = null;
    this.availableSlots = [];
  }
}