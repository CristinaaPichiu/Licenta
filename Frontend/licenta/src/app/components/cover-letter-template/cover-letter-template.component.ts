// src/app/cover-letter-template/cover-letter-template.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoverLetterDataService } from 'src/app/services/cover-letter-data.service';

@Component({
  selector: 'app-cover-letter-template',
  templateUrl: './cover-letter-template.component.html',
  styleUrls: ['./cover-letter-template.component.scss']
})
export class CoverLetterTemplateComponent implements OnInit, OnDestroy {

  resume: any;
  private subscription!: Subscription;

  constructor(private coverLetterDataService: CoverLetterDataService) {}

  ngOnInit() {
    this.subscription = this.coverLetterDataService.currentCoverLetter.subscribe(data => {
      this.resume = data;
      if (this.resume.smtg && this.resume.smtg.body) {
        this.resume.smtg.body = this.convertNewlinesToBreaks(this.resume.smtg.body);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private convertNewlinesToBreaks(text: string): string {
    return text ? text.replace(/\n/g, '<br>') : '';
  }
}
