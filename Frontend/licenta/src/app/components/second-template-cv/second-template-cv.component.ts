import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResumeDataService } from 'src/app/services/resume-data.service';

@Component({
  selector: 'app-second-template-cv',
  templateUrl: './second-template-cv.component.html',
  styleUrls: ['./second-template-cv.component.scss']
})
export class SecondTemplateCvComponent implements  OnInit, OnDestroy {

  resume: any;
  private subscription!: Subscription;

  constructor(private resumeDataService: ResumeDataService) {}

  ngOnInit() {
    this.subscription = this.resumeDataService.currentResume.subscribe(data => {
      this.resume = data;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}


