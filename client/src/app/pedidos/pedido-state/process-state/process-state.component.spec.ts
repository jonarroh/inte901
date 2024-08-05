import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessStateComponent } from './process-state.component';

describe('ProcessStateComponent', () => {
  let component: ProcessStateComponent;
  let fixture: ComponentFixture<ProcessStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
