import { Component, OnInit } from '@angular/core';
import { BarberService } from '../../services/barber/barber.service';
import { Barber } from '../../models/barber.model';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  barbers: Barber[] = [];

  constructor(
    private barberService: BarberService
  ) {}

  ngOnInit(): void {
    this.loadBarbers();
  }

  loadBarbers(): void {
    this.barberService.getBarbers().subscribe((response) => {
      if (response.success) this.barbers = response.data;
    });
  }

}
