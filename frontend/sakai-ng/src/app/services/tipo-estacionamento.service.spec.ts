import { TestBed } from '@angular/core/testing';

import { TipoEstacionamentoService } from './tipo-estacionamento.service';

describe('TipoEstacionamentoService', () => {
  let service: TipoEstacionamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoEstacionamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
