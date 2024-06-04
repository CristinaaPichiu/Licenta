import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterThirdTemplateComponent } from './cover-letter-third-template.component';

describe('CoverLetterThirdTemplateComponent', () => {
  let component: CoverLetterThirdTemplateComponent;
  let fixture: ComponentFixture<CoverLetterThirdTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverLetterThirdTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverLetterThirdTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
