import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-first-template',
  templateUrl: './dashboard-first-template.component.html',
  styleUrls: ['./dashboard-first-template.component.scss']
})
export class DashboardFirstTemplateComponent implements OnInit {

  @Input() resume: any;

  constructor() {}

  ngOnInit(): void {
    console.log('Resume data for viewing:', this.resume);
  }

}
