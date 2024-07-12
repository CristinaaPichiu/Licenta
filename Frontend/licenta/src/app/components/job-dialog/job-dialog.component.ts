import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { toPercentage } from 'chart.js/dist/helpers/helpers.core';
import { Job } from 'src/app/models/job.model';
import { JobService } from 'src/app/services/job-tracker.service';


@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.scss']
})
export class JobDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<JobDialogComponent>,
  private jobService: JobService 
) { }

  htmlToPlainText(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  closeDialog(): void {
    this.dialogRef.close();  // Această linie închide dialogul
  }
  saveJobTracker(): void {


    const snippetWords = this.data.snippet.split(/\s+/); // Splits the string by any whitespace
    const firstTenWords = snippetWords.slice(0, 10).join(' ');

    const jobData: Job = {
      title: this.data.title,
      company: this.data.company,
      date: new Date(),
      location: this.data.location,
      salary: this.data.salary,
      jobType: this.data.type,
      link: this.data.link,
      notes: firstTenWords,
      columnName: 'toApply', // Assuming a default column
      color: '#ffffff' // Example color
    };

    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.error('User not authenticated');
        return;
    }
        this.jobService.saveOrUpdateJob(token, jobData).subscribe({
      next: (response) => {
        console.log('Job saved!', response);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error saving job', error);
      }
    });
  }
openLink(url: string): void {
  window.open(url, '_blank');
}



}
