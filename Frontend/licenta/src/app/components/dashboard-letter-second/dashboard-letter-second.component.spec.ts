import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLetterSecondComponent } from './dashboard-letter-second.component';

describe('DashboardLetterSecondComponent', () => {
  let component: DashboardLetterSecondComponent;
  let fixture: ComponentFixture<DashboardLetterSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLetterSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLetterSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
