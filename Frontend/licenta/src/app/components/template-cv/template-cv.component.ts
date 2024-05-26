import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResumeDataService } from 'src/app/services/resume-data.service';

@Component({
  selector: 'app-template-cv',
  templateUrl: './template-cv.component.html',
  styleUrls: ['./template-cv.component.scss']
})
export class TemplateCVComponent implements OnInit, OnDestroy {
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
