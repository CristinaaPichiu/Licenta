import { TestBed } from '@angular/core/testing';

import { GenerateSummaryService } from './generate-summary.service';

describe('GenerateSummaryService', () => {
  let service: GenerateSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
