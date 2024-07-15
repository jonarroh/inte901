import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDireccionComponent } from './add-direccion.component';

describe('AddDireccionComponent', () => {
  let component: AddDireccionComponent;
  let fixture: ComponentFixture<AddDireccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDireccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
