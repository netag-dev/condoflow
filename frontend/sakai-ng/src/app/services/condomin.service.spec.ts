import { TestBed } from '@angular/core/testing';

import { CondominService } from './condomin.service';

describe('CondominService', () => {
  let service: CondominService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CondominService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
