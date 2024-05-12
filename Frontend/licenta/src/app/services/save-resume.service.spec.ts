import { TestBed } from '@angular/core/testing';

import { SaveResumeService } from './save-resume.service';

describe('SaveResumeService', () => {
  let service: SaveResumeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveResumeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
