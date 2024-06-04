import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardThirdTemplateComponent } from './dashboard-third-template.component';

describe('DashboardThirdTemplateComponent', () => {
  let component: DashboardThirdTemplateComponent;
  let fixture: ComponentFixture<DashboardThirdTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardThirdTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardThirdTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
