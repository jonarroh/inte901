import { TestBed } from '@angular/core/testing';

import { ReservaSerService } from './reserva-ser.service';

describe('ReservaSerService', () => {
  let service: ReservaSerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaSerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
