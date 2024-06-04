import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLetterFirstComponent } from './dashboard-letter-first.component';

describe('DashboardLetterFirstComponent', () => {
  let component: DashboardLetterFirstComponent;
  let fixture: ComponentFixture<DashboardLetterFirstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLetterFirstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLetterFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
