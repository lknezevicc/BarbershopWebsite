import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    this.submitted = true;
    this.serverError = null;

    if (this.loginForm.invalid) {
      return;
    }

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.success) {
          alert(response.message);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.serverError = error.error.message;
      }
    });
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }
  
}
