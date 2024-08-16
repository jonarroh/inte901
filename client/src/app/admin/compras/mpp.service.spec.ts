import { TestBed } from '@angular/core/testing';

import { MppService } from './mpp.service';

describe('MppService', () => {
  let service: MppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
