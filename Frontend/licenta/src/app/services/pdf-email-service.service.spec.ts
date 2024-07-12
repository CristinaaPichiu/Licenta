import { TestBed } from '@angular/core/testing';

import { PdfEmailService } from './pdf-email-service.service';

describe('PdfEmailServiceService', () => {
  let service: PdfEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
