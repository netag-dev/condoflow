import { TestBed } from '@angular/core/testing';

import { StatusCondoService } from './status-condo.service';

describe('StatusCondoService', () => {
  let service: StatusCondoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusCondoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
