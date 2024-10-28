import { TestBed } from '@angular/core/testing';

import { MoradoresService } from './moradores.service';

describe('MoradoresService', () => {
  let service: MoradoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoradoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
