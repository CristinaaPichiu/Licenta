import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateCVComponent } from './template-cv.component';

describe('TemplateCVComponent', () => {
  let component: TemplateCVComponent;
  let fixture: ComponentFixture<TemplateCVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateCVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
