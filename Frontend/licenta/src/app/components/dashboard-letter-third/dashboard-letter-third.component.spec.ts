import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLetterThirdComponent } from './dashboard-letter-third.component';

describe('DashboardLetterThirdComponent', () => {
  let component: DashboardLetterThirdComponent;
  let fixture: ComponentFixture<DashboardLetterThirdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLetterThirdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLetterThirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
