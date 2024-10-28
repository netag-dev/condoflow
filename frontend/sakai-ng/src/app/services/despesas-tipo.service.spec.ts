import { TestBed } from '@angular/core/testing';

import { DespesasTipoService } from './despesas-tipo.service';

describe('DespesasTipoService', () => {
  let service: DespesasTipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DespesasTipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
