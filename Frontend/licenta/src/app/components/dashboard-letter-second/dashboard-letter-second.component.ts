import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-letter-second',
  templateUrl: './dashboard-letter-second.component.html',
  styleUrls: ['./dashboard-letter-second.component.scss']
})
export class DashboardLetterSecondComponent {

  @Input() letter: any;

  constructor() {}

  ngOnInit(): void {
    console.log('Resume data for viewing:', this.letter);
  }

}
