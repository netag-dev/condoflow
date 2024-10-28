import { TestBed } from '@angular/core/testing';

import { EstacionamentosService } from './estacionamentos.service';

describe('EstacionamentosService', () => {
  let service: EstacionamentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstacionamentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
