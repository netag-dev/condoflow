import { TestBed } from '@angular/core/testing';

import { AreasReservaService } from './areas-reserva.service';

describe('AreasReservaService', () => {
  let service: AreasReservaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreasReservaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
