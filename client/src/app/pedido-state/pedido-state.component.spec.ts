import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoStateComponent } from './pedido-state.component';

describe('PedidoStateComponent', () => {
  let component: PedidoStateComponent;
  let fixture: ComponentFixture<PedidoStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
