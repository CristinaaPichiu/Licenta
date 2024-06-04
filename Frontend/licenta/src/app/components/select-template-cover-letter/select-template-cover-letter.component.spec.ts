import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTemplateCoverLetterComponent } from './select-template-cover-letter.component';

describe('SelectTemplateCoverLetterComponent', () => {
  let component: SelectTemplateCoverLetterComponent;
  let fixture: ComponentFixture<SelectTemplateCoverLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTemplateCoverLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTemplateCoverLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
