import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripesuccessComponent } from './stripesuccess.component';

describe('StripesuccessComponent', () => {
  let component: StripesuccessComponent;
  let fixture: ComponentFixture<StripesuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripesuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripesuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
