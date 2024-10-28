import { TestBed } from '@angular/core/testing';

import { TipoUnidadesService } from './tipo-unidades.service';

describe('TipoUnidadesService', () => {
  let service: TipoUnidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoUnidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
