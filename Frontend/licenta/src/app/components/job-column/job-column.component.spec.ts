import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobColumnComponent } from './job-column.component';

describe('JobColumnComponent', () => {
  let component: JobColumnComponent;
  let fixture: ComponentFixture<JobColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
