import { TestBed } from '@angular/core/testing';

import { SaveCoverLetterService } from './save-cover-letter.service';

describe('SaveCoverLetterService', () => {
  let service: SaveCoverLetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveCoverLetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
