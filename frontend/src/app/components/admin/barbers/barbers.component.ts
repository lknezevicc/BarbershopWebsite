import { Component, OnInit } from '@angular/core';
import { BarberService } from '../../../services/barber/barber.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberServiceService } from '../../../services/barber-service/barber-service.service';
import { Barber, WorkingHours } from '../../../models/barber.model';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-barbers',
  standalone: false,

  templateUrl: './barbers.component.html',
  styleUrls: ['./barbers.component.scss']
})

export class BarbersComponent implements OnInit {
  barbers: Barber[] = [];
  servicesList: Service[] = [];
  barberForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  showModal = false;
  selectedBarber: Barber | null = null;
  availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(
    private barberService: BarberService,
    private barberServiceService: BarberServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBarbers();
    this.loadServices();
  }

  loadBarbers(): void {
    this.barberService.getBarbers().subscribe((response) => {
      if (response.success) this.barbers = response.data;
    });
  }

  loadServices(): void {
    this.barberServiceService.getServices().subscribe((response) => {
      if (response.success) this.servicesList = response.data;
    });
  }

  openModal(isEdit: boolean, barber?: Barber): void {
    this.isEditMode = isEdit;
    this.showModal = true;
    this.submitted = false;
  
    if (this.isEditMode && barber) {
      this.selectedBarber = barber;
      this.resetForm();
  
      this.barberForm.patchValue({
        name: barber.name,
        about: barber.about
      });
  
      barber.workingHours.forEach((wh: WorkingHours) => {
        this.workingHours.push(this.fb.group({
          day: [wh.day, Validators.required],
          start: [wh.start, Validators.required],
          end: [wh.end, Validators.required]
        }));
      });
  
      barber.services.forEach((service: Service) => {
        this.services.push(this.fb.control(service._id));
      });
    } else {
      this.resetForm();
    }
  }

  addWorkingHour(): void {
    const workingHourGroup = this.fb.group({
      day: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
    this.workingHours.push(workingHourGroup);
  }

  resetForm(): void {
    this.barberForm.reset();
    this.workingHours.clear();
    this.services.clear();
    this.submitted = false;
  }

  removeWorkingHour(index: number): void {
    this.workingHours.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.barberForm.invalid || this.workingHours.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }

    const barberData = this.barberForm.value;
    barberData.services = this.services.value;
    if (barberData.about === null) barberData.about = '';

    if (this.isEditMode && this.selectedBarber) {
      this.editBarber(this.selectedBarber._id, barberData);
    } else {
      this.addBarber(barberData);
    }

    this.closeModal();
  }

  editBarber(barberId: string, barber: Barber): void {
    this.barberService.editBarber(barberId, barber).subscribe((response) => {
      if (response.success) {
        this.loadBarbers();
        alert(response.message);
      }
    });
  }

  addBarber(barber: Barber): void {
    this.barberService.addBarber(barber).subscribe((response) => {
      if (response.success) {
        alert(response.message);
        this.loadBarbers();
      }
    });
  }

  deleteBarber(barberId: string): void {
    this.barberService.deleteBarber(barberId).subscribe((response) => {
      if (response.success) this.loadBarbers();
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  toggleService(service: Service): void {
    const servicesArray = this.barberForm.get('services') as FormArray;
    const index = servicesArray.value.indexOf(service._id);
  
    if (index > -1) {
      servicesArray.removeAt(index);
    } else {
      servicesArray.push(this.fb.control(service._id));
    }
  }
  
  isServiceSelected(service: Service): boolean {
    const servicesArray = this.barberForm.get('services') as FormArray;
    return servicesArray.value.includes(service._id);
  }

  initializeForm(): void {
    this.barberForm = this.fb.group({
      name: ['', Validators.required],
      about: [''],
      workingHours: this.fb.array([], Validators.required),
      services: this.fb.array([], Validators.required)
    });
  }

  get f() { return this.barberForm.controls; }

  get workingHours(): FormArray {
    return this.barberForm.get('workingHours') as FormArray;
  }

  get services(): FormArray {
    return this.barberForm.get('services') as FormArray;
  }
  
}