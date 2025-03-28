import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-user-profile',
  standalone: false,

  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent implements OnInit {
  userForm!: FormGroup;
  passwordForm!: FormGroup;
  appointments: Appointment[] = [];
  userId!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForms();
    this.loadUserProfile();
    this.loadUserHistory();
  }

  loadUserProfile(): void {
    this.userService.getUser(this.userId).subscribe((response) => {
      if (response.success) this.userForm.patchValue(response.data);
    });
  }

  loadUserHistory(): void {
    this.appointmentService.getUserAppointments(this.userId).subscribe((response) => {
      if (response.success) this.appointments = response.data;
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.userService.editUser(this.userId, this.userForm.value).subscribe((response) => {
      if (response.success) alert(response.message);
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    const { confirmPassword, ...passwordData } = this.passwordForm.value;

    this.userService.changePassword(this.userId, passwordData).subscribe({
      next: (response) => {
        if (response.success) alert(response.message);
      },
      error: (error) => alert(error.error.message)
    });
  }

  initializeForms(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+385|0)([1-9][0-9])\d{7,8}$/)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;

    return newPassword === confirmNewPassword ? null : { passwordsMismatch: true };
  }

  get f() {
    return this.userForm.controls;
  }

  get p() {
    return this.passwordForm.controls;
  }
}
