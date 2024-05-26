import { TestBed } from '@angular/core/testing';

import { CoverLetterDataService } from './cover-letter-data.service';

describe('CoverLetterDataService', () => {
  let service: CoverLetterDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverLetterDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
