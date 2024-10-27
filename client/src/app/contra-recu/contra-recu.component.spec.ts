import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraRecuComponent } from './contra-recu.component';

describe('ContraRecuComponent', () => {
  let component: ContraRecuComponent;
  let fixture: ComponentFixture<ContraRecuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContraRecuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContraRecuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
