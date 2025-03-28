import { Component, OnInit } from '@angular/core';
import { BarberServiceService } from '../../services/barber-service/barber-service.service';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../models/service.model';

@Component({
  selector: 'app-barber-services',
  standalone: false,

  templateUrl: './barber-services.component.html',
  styleUrls: ['./barber-services.component.scss'],
})

export class BarberServicesComponent implements OnInit {
  services: Service[] = [];
  selectedCurrency: string = 'EUR';
  currencies: string[] = ['EUR', 'BAM', 'RSD', 'CHF', 'USD'];
  exchangeRates: Record<string, number> = {};
  convertedPrices: Record<string, string> = {};

  constructor(
    private barberService: BarberServiceService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadServices(), this.loadExchangeRates()]);
    this.convertPrices();
  }

  loadServices(): Promise<void> {
    return new Promise((resolve) => {
      this.barberService.getServices().subscribe((response) => {
        if (response.success) {
          this.services = response.data;
        }
        resolve();
      });
    });
  }

  loadExchangeRates(): Promise<void> {
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/EUR';
    return this.http.get<any>(apiUrl).toPromise().then((data) => {
      this.exchangeRates = data.rates;
      this.exchangeRates['EUR'] = 1;
    }).catch((error) => {
      console.error('Error loading exchange rates:', error);
    });
  }

  convertPrices(): void {
    const rate = this.exchangeRates[this.selectedCurrency] || 1;
    this.services.forEach((service) => {
      this.convertedPrices[service._id] = (service.price * rate).toFixed(2);
    });
  }
}