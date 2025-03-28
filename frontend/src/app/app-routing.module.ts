import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BookingComponent } from './components/booking/booking.component';
import { BarbersComponent } from './components/admin/barbers/barbers.component';
import { ServicesComponent } from './components/admin/services/services.component';
import { AppointmentsComponent } from './components/admin/appointments/appointments.component';
import { UsersComponent } from './components/admin/users/users.component';
import { UserHistoryComponent } from './components/user-history/user-history.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { authGuard } from './guards/auth/auth.guard';
import { adminGuard } from './guards/admin/admin.guard';
import { BarberServicesComponent } from './components/barber-services/barber-services.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'booking', component: BookingComponent, canActivate: [authGuard] },
  { path: 'admin/barbers', component: BarbersComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/services', component: ServicesComponent, canActivate: [authGuard, adminGuard]},
  { path: 'admin/appointments', component: AppointmentsComponent, canActivate: [authGuard, adminGuard]},
  { path: 'admin/users', component: UsersComponent, canActivate: [authGuard, adminGuard]},
  { path: 'users/:id/history', component: UserHistoryComponent, canActivate: [authGuard]},
  { path: 'services', component: BarberServicesComponent },
  { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
