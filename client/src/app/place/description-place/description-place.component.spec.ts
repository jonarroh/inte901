import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionPlaceComponent } from './description-place.component';

describe('DescriptionPlaceComponent', () => {
  let component: DescriptionPlaceComponent;
  let fixture: ComponentFixture<DescriptionPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionPlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
