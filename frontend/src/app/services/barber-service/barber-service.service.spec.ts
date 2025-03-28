import { TestBed } from '@angular/core/testing';

import { BarberServiceService } from './barber-service.service';

describe('BarberServiceService', () => {
  let service: BarberServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarberServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
