import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterFormComponent } from './cover-letter-form.component';

describe('CoverLetterFormComponent', () => {
  let component: CoverLetterFormComponent;
  let fixture: ComponentFixture<CoverLetterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverLetterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverLetterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
