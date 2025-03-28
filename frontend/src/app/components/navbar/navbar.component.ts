import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUserId(): string | null {
    return this.authService.getUserId();
  }

  logout(): void {
    const result = confirm('Are you sure you want to logout?');
    if (result) {
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }
}
