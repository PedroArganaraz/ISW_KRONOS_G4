import { TestBed } from '@angular/core/testing';

import { TipoDeCargaService } from './tipo-de-carga.service';

describe('TipoDeCargaService', () => {
  let service: TipoDeCargaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoDeCargaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
