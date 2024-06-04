import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-second-template',
  templateUrl: './dashboard-second-template.component.html',
  styleUrls: ['./dashboard-second-template.component.scss']
})
export class DashboardSecondTemplateComponent implements OnInit {

  @Input() resume: any;

  constructor() {}

  ngOnInit(): void {
    console.log('Received resume data:', this.resume);
  }

}
