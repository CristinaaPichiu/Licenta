import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent implements OnInit, AfterViewInit {

  constructor() { 
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
    this.createChart();
  }

  createChart() {
    console.log('createChart called');
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Targeted jobs', 'Applied jobs', 'Interviews', 'Rejections', 'Offers'],
          datasets: [{
            label: 'Progress',
            data: [4, 10, 5, 5, 2], // Dummy data
            backgroundColor: ['#ADD8E6', '#87CEEB', '#4682B4', '#5F9EA0', '#1E90FF'],
            borderColor: ['#ADD8E6', '#87CEEB', '#4682B4', '#5F9EA0', '#1E90FF'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false // Hide default legend
            },
            tooltip: {
              enabled: true,
            }
          }
        }
      });
    }
  }
}
