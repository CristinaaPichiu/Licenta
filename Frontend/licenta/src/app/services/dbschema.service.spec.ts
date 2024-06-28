import { TestBed } from '@angular/core/testing';

import { DBSchemaService } from './dbschema.service';

describe('DBSchemaService', () => {
  let service: DBSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBSchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
