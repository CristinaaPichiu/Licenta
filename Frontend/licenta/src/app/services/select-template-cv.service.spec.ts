import { TestBed } from '@angular/core/testing';

import { SelectTemplateCvService } from './select-template-cv.service';

describe('SelectTemplateCvService', () => {
  let service: SelectTemplateCvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectTemplateCvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
