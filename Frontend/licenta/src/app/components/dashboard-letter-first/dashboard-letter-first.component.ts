import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoverLetterDataService } from 'src/app/services/cover-letter-data.service';

@Component({
  selector: 'app-dashboard-letter-first',
  templateUrl: './dashboard-letter-first.component.html',
  styleUrls: ['./dashboard-letter-first.component.scss']
})
export class DashboardLetterFirstComponent implements OnInit {

  @Input() letter: any;

  constructor() {}

  ngOnInit(): void {
    console.log('Resume data for viewing:', this.letter);
  }
}
