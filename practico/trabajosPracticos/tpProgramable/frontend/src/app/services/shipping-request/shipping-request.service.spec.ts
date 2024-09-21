import { TestBed } from '@angular/core/testing';

import { ShippingRequestService } from './shipping-request.service';

describe('ShippingRequestService', () => {
  let service: ShippingRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
