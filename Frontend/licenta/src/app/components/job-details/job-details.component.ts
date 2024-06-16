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
    @Inject(MAT_DIALOG_DATA) public data: { column: any } // Adjust the type if needed based on the application structure
  ) {
    this.jobDetailsForm = this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      date: ['', Validators.required],
      location: [''],
      salary: [''],
      jobType: [''],
      link: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.jobDetailsForm.valid) {
      const jobData = {
        jobTitle: this.jobDetailsForm.value.jobTitle,
        company: this.jobDetailsForm.value.company,
        date: this.jobDetailsForm.value.date,
        location: this.jobDetailsForm.value.location,
        salary: this.jobDetailsForm.value.salary,
        jobType: this.jobDetailsForm.value.jobType,
        link: this.jobDetailsForm.value.link,
        notes: this.jobDetailsForm.value.notes
      };
      
      console.log('Job Data:', jobData);
      const token = localStorage.getItem('auth_token');
      console.log('Token:', token); // Log the JWT token retrieved from localStorage
  
      if (token) {
        this.jobService.saveJob(token, jobData).subscribe({
          next: (response: any) => {
            console.log('Job saved successfully', response);
            alert('Job saved successfully!');
            this.dialogRef.close(response); // Close the dialog and pass the response
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
