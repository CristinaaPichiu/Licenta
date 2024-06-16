import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobService } from 'src/app/services/job-tracker.service';
import { Job } from 'src/app/models/job.model';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  jobDetailsForm: FormGroup;
  currentView: string = 'general'; // Default view
  currentImage: string = '/assets/job.png'; // Initial image

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JobDetailsComponent>,
    private jobService: JobService, // Inject the JobService
    @Inject(MAT_DIALOG_DATA) public data: { job: Job, column: any }
  ) {
    this.jobDetailsForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      date: ['', Validators.required],
      location: [''],
      salary: [''],
      jobType: [''],
      link: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // Populează formularul dacă există date transmise prin dialog
    if (this.data && this.data.job) {
      this.jobDetailsForm.patchValue({
        title: this.data.job.title || '',
        company: this.data.job.company || '',
        date: this.data.job.date || '',
        location: this.data.job.location || '',
        salary: this.data.job.salary || '',
        jobType: this.data.job.jobType || '',
        link: this.data.job.link || '',
        notes: this.data.job.notes || ''
      });
    }
  }

  onSubmit(): void {
    if (this.jobDetailsForm.valid) {
      const jobData = {
        ...this.jobDetailsForm.value,
        columnName: this.data.column.name  // Include numele coloanei din obiectul Column
      };
      

      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

      console.log(this.data.column.name);
      
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

  
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.jobService.saveJob(token, jobData).subscribe({
          next: (response: any) => {
            console.log('Job saved successfully', response);
            alert('Job saved successfully!');
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Failed to save job', error);
            alert('Failed to save job: ' + error.message);
          }
        });
      } else {
        console.error('Authentication token not found. Please log in.');
        alert('Please log in to save your job.');
      }
    }
  }
  
  
  
  close() {
    this.dialogRef.close();
  }

  changeView(view: string): void {
    this.currentView = view;
    this.updateImage();
  }

  updateImage(): void {
    switch (this.currentView) {
      case 'general':
        this.currentImage = '/assets/job.png';
        break;
      case 'timeline':
        this.currentImage = '/assets/task.png';
        break;
      case 'documents':
        this.currentImage = '/assets/documents.png';
        break;
      default:
        this.currentImage = '/assets/job.png';
    }
  }

  private generateId(): string {
    // Implement ID generation logic or use a service/library
    return Math.random().toString(36).substring(2, 9);
  }
}
