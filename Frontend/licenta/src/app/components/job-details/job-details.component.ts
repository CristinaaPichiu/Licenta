import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobService } from 'src/app/services/job-tracker.service';
import { Job } from 'src/app/models/job.model';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  jobDetailsForm: FormGroup;
  timelineForm!: FormGroup;

  currentView: string = 'general'; // Default view
  currentImage: string = '/assets/job.png'; // Initial image
  selectedColor: string = '#7cdfc3'; // Culoare inițială, poate fi schimbată
  colors: string[] = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff', '#000000'];


  constructor(
    private dialog: MatDialog,
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
      notes: [''],
      color: [this.selectedColor]
      
    });
  }

  openColorPicker(): void {
    const dialogRef = this.dialog.open(ColorPickerComponent, {
      width: '300px',
      data: { selectedColor: this.selectedColor }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedColor = result;
        this.jobDetailsForm.get('color')!.setValue(this.selectedColor); // Utilizare operator non-null assertion
      }
    });
    
  }
  
  ngOnInit(): void {
    // Populează formularul dacă există date transmise prin dialog
    if (this.data && this.data.job) {
      this.jobDetailsForm.patchValue({
        id: this.data.job.id || '',
        title: this.data.job.title || '',
        company: this.data.job.company || '',
        date: this.data.job.date || '',
        location: this.data.job.location || '',
        salary: this.data.job.salary || '',
        jobType: this.data.job.jobType || '',
        link: this.data.job.link || '',
        notes: this.data.job.notes || '',
        color: this.data.job.color || this.selectedColor
      });
    }
  }

  onSubmit(): void {
    if (this.jobDetailsForm.valid) {
      const jobData = {
        ...this.jobDetailsForm.value,
        id: this.data.job?.id, // Include ID-ul dacă este disponibil
        columnName: this.data.column.name  // Include numele coloanei
      };
  
      console.log("Attempting to save or update job:", jobData);
  
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.jobService.saveOrUpdateJob(token, jobData).subscribe({
          next: (response: any) => {
            console.log('Job saved or updated successfully', response);
            alert('Job saved or updated successfully!');
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Failed to save or update job', error);
            alert('Failed to save or update job: ' + error.message);
          }
        });
      } else {
        console.error('Authentication token not found. Please log in.');
        alert('Please log in to save or update your job.');
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
