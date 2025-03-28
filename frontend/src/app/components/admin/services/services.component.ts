import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberServiceService } from '../../../services/barber-service/barber-service.service';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-services',
  standalone: false,
  
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  serviceForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  selectedService: Service | null = null;
  showModal = false;

  constructor(
    private serviceService: BarberServiceService, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe((response) => {
      if (response.success) this.services = response.data;
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedService = null;
    this.serviceForm.reset();
    this.showModal = true;
  }

  openEditModal(service: Service): void {
    this.isEditMode = true;
    this.selectedService = service;
    this.serviceForm.patchValue(service);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.serviceForm.reset();
    this.submitted = false;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.serviceForm.invalid) {
      return;
    }

    const serviceData: Service = this.serviceForm.value;

    if (this.isEditMode && this.selectedService) {
      this.updateService(this.selectedService._id, serviceData);
    } else {
      this.addService(serviceData);
    }
  }

  private addService(serviceData: Service): void {
    this.serviceService.addService(serviceData).subscribe((response) => {
      if (response.success) {
        alert(response.message);
        this.loadServices();
        this.closeModal();
      }
    });
  }

  private updateService(serviceId: string, serviceData: Service): void {
    this.serviceService.editService(serviceId, serviceData).subscribe((response) => {
      if (response.success) {
        alert(response.message);
        this.loadServices();
        this.closeModal();
      }
    });
  }

  deleteService(serviceId: string): void {
    this.serviceService.deleteService(serviceId).subscribe((response) => {
      if (response.success) {
        alert(response.message);
        this.loadServices();
      }
    });
  }

  initializeForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  get f() {
    return this.serviceForm.controls;
  }

}
