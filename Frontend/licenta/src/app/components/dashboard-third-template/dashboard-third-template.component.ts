import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-third-template',
  templateUrl: './dashboard-third-template.component.html',
  styleUrls: ['./dashboard-third-template.component.scss']
})
export class DashboardThirdTemplateComponent implements OnInit {

  @Input() resume: any;

  constructor() {}

  ngOnInit(): void {
    console.log('Received resume data:', this.resume);
  }

}
