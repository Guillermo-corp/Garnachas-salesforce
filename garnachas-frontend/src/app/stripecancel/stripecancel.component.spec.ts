import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripecancelComponent } from './stripecancel.component';

describe('StripecancelComponent', () => {
  let component: StripecancelComponent;
  let fixture: ComponentFixture<StripecancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripecancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripecancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
