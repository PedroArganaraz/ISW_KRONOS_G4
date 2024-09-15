import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShippingRequestPage } from './shipping-request.page';

describe('ShippingRequestPage', () => {
  let component: ShippingRequestPage;
  let fixture: ComponentFixture<ShippingRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
