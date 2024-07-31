import { TestBed } from '@angular/core/testing';

import { PedidoStateService } from './pedido-state.service';

describe('PedidoStateService', () => {
  let service: PedidoStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
