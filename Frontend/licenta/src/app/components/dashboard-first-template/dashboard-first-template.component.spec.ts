import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFirstTemplateComponent } from './dashboard-first-template.component';

describe('DashboardFirstTemplateComponent', () => {
  let component: DashboardFirstTemplateComponent;
  let fixture: ComponentFixture<DashboardFirstTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardFirstTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardFirstTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
