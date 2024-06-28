import { TestBed } from '@angular/core/testing';

import { JobSearchManuallyService } from './job-search-manually.service';

describe('JobSearchManuallyService', () => {
  let service: JobSearchManuallyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobSearchManuallyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
