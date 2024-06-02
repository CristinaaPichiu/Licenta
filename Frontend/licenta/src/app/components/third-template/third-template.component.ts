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
    // Abonează-te la currentResume pentru a actualiza datele de previzualizare ale CV-ului
    this.subscription = this.resumeDataService.currentResume.subscribe(data => {
      this.resume = data;
    });
  }

  ngOnDestroy() {
    // Dezabonează-te când componenta este distrusă pentru a preveni memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
