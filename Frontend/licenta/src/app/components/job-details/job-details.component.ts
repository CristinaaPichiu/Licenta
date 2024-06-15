import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column } from 'src/app/models/column.model';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  jobDetailsForm: FormGroup;
  currentView: string = 'general'; // Default view
  currentImage: string = '/assets/job.png'; // Imaginea inițială

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JobDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { column: Column }
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

  onSubmit() {
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
      this.dialogRef.close(jobData);
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
}
