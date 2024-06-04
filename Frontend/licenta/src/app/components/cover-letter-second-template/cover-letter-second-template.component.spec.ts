import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterSecondTemplateComponent } from './cover-letter-second-template.component';

describe('CoverLetterSecondTemplateComponent', () => {
  let component: CoverLetterSecondTemplateComponent;
  let fixture: ComponentFixture<CoverLetterSecondTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverLetterSecondTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverLetterSecondTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
