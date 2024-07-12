import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResumeDataService } from 'src/app/services/resume-data.service';

@Component({
  selector: 'app-third-template',
  templateUrl: './third-template.component.html',
  styleUrls: ['./third-template.component.scss']
})
export class ThirdTemplateComponent implements OnInit, OnDestroy {

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
