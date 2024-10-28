import { TestBed } from '@angular/core/testing';

import { TipoCondominService } from './tipo-condomin.service';

describe('TipoCondominService', () => {
  let service: TipoCondominService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoCondominService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
