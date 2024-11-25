import { TestBed } from '@angular/core/testing';

import { SerRewadsService } from './ser-rewads.service';

describe('SerRewadsService', () => {
  let service: SerRewadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerRewadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
