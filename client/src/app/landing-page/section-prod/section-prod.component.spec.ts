import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionProdComponent } from './section-prod.component';

describe('SectionProdComponent', () => {
  let component: SectionProdComponent;
  let fixture: ComponentFixture<SectionProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionProdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
