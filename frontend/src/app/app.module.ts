import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { AppointmentsComponent } from './components/admin/appointments/appointments.component';
import { BarbersComponent } from './components/admin/barbers/barbers.component';
import { ServicesComponent } from './components/admin/services/services.component';
import { UserHistoryComponent } from './components/user-history/user-history.component';
import { UsersComponent } from './components/admin/users/users.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BookingComponent } from './components/booking/booking.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { BarberServicesComponent } from './components/barber-services/barber-services.component';
import { SortPipe } from './pipes/sort/sort.pipe';
import { FilterPipe } from './pipes/filter/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    BookingComponent,
    BarbersComponent,
    ServicesComponent,
    AppointmentsComponent,
    UsersComponent,
    UserHistoryComponent,
    UserProfileComponent,
    BarberServicesComponent,
    SortPipe,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
