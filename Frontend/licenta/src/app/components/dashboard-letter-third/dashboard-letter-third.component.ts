import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-letter-third',
  templateUrl: './dashboard-letter-third.component.html',
  styleUrls: ['./dashboard-letter-third.component.scss']
})
export class DashboardLetterThirdComponent implements OnInit {

  @Input() letter: any;

  constructor() {}

  ngOnInit(): void {
    console.log('Resume data for viewing:', this.letter);
  }


}
