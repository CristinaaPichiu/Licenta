import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent implements OnInit, AfterViewInit {
  @Input() statistics: any; 

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
    if (ctx && this.statistics) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Targeted jobs', 'Applied jobs', 'Interviews', 'Rejections', 'Offers'],
          datasets: [{
            label: 'Job Statistics',
            data: [
              this.statistics.toApply,
              this.statistics.applied,
              this.statistics.interview,
              this.statistics.rejected,
              this.statistics.offer
            ],
            backgroundColor: ['#ADD8E6', '#87CEEB', '#4682B4', '#5F9EA0', '#1E90FF'],
            borderColor: ['#FFFFFF'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false 
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
