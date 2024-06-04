import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoverLetterDataService } from 'src/app/services/cover-letter-data.service';

@Component({
  selector: 'app-cover-letter-second-template',
  templateUrl: './cover-letter-second-template.component.html',
  styleUrls: ['./cover-letter-second-template.component.scss']
})
export class CoverLetterSecondTemplateComponent implements OnInit, OnDestroy {

  resume: any;
  signature: string = '';
  private subscription!: Subscription;
  private signatureSubscription!: Subscription;

  constructor(private coverLetterDataService: CoverLetterDataService) {}

  ngOnInit() {
    this.subscription = this.coverLetterDataService.currentCoverLetter.subscribe(data => {
      this.resume = data;
      if (this.resume.smtg && this.resume.smtg.body) {
        this.resume.smtg.body = this.convertNewlinesToBreaks(this.resume.smtg.body);
      }
    });

    this.signatureSubscription = this.coverLetterDataService.currentSignature.subscribe(signature => {
      this.signature = signature;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.signatureSubscription) {
      this.signatureSubscription.unsubscribe();
    }
  }

  private convertNewlinesToBreaks(text: string): string {
    return text ? text.replace(/\n/g, '<br>') : '';
  }
}
