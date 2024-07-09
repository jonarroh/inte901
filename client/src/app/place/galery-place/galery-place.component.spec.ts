import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleryPlaceComponent } from './galery-place.component';

describe('GaleryPlaceComponent', () => {
  let component: GaleryPlaceComponent;
  let fixture: ComponentFixture<GaleryPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleryPlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleryPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
