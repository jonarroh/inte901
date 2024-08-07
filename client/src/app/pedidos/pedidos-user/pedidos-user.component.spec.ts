import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosUserComponent } from './pedidos-user.component';

describe('PedidosUserComponent', () => {
  let component: PedidosUserComponent;
  let fixture: ComponentFixture<PedidosUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
