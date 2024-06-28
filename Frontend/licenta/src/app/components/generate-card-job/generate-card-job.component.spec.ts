import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCardJobComponent } from './generate-card-job.component';

describe('GenerateCardJobComponent', () => {
  let component: GenerateCardJobComponent;
  let fixture: ComponentFixture<GenerateCardJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateCardJobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateCardJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
