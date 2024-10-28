import { TestBed } from '@angular/core/testing';

import { AuthServiceServiceService } from './auth-service-service.service';

describe('AuthServiceServiceService', () => {
  let service: AuthServiceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServiceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
