import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSecondTemplateComponent } from './dashboard-second-template.component';

describe('DashboardSecondTemplateComponent', () => {
  let component: DashboardSecondTemplateComponent;
  let fixture: ComponentFixture<DashboardSecondTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSecondTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSecondTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
