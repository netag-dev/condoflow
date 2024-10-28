import { TestBed } from '@angular/core/testing';

import { SindicosService } from './sindicos.service';

describe('SindicosService', () => {
  let service: SindicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SindicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
