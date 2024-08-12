import { TestBed } from '@angular/core/testing';

import { PedidosUserServiceService } from './pedidos-user-service.service';

describe('PedidosUserServiceService', () => {
  let service: PedidosUserServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidosUserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
