import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTemplateResumeComponent } from './select-template-resume.component';

describe('SelectTemplateResumeComponent', () => {
  let component: SelectTemplateResumeComponent;
  let fixture: ComponentFixture<SelectTemplateResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTemplateResumeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTemplateResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
