import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenTableComponent } from './orden-table.component';

describe('OrdenTableComponent', () => {
  let component: OrdenTableComponent;
  let fixture: ComponentFixture<OrdenTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdenTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
