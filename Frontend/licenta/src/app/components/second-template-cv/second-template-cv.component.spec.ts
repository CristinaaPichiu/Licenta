import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondTemplateCvComponent } from './second-template-cv.component';

describe('SecondTemplateCvComponent', () => {
  let component: SecondTemplateCvComponent;
  let fixture: ComponentFixture<SecondTemplateCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondTemplateCvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondTemplateCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
