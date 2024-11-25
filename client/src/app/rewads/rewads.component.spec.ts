import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewadsComponent } from './rewads.component';

describe('RewadsComponent', () => {
  let component: RewadsComponent;
  let fixture: ComponentFixture<RewadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
