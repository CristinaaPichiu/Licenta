import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobService } from 'src/app/services/job-tracker.service';
import { Job } from 'src/app/models/job.model';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { AddActivityDialogComponent } from '../add-activity-dialog/add-activity-dialog.component';
import { TodoitemService } from 'src/app/services/todoitem.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { UploadResumeService } from 'src/app/services/upload-resume.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  jobDetailsForm: FormGroup;
  timelineForm!: FormGroup;

  currentView: string = 'general'; 
  currentImage: string = '/assets/job.png'; 
  selectedColor: string = '#7cdfc3'; 
  colors: string[] = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff', '#000000'];
  hovering: boolean = true;
  uploadedFileName: string | null = null; 

  activities: any[] = [];
  openAddActivityDialog(activity?: any): void {
    const dialogRef = this.dialog.open(AddActivityDialogComponent, {
      width: '800px',
      data: { activity: activity, jobId: this.data.job.id } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshActivities(); 
      }
    });
  }
  deleteActivity(id: number): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.todoItemService.deleteTodoItem(id, token).subscribe({
        next: () => {
          console.log('Activity deleted successfully');
          this.refreshActivities(); 
        },
        error: (error) => {
          console.error('Failed to delete activity', error);
        }
      });
    } else {
      console.error('Authentication token not found. Please log in.');
    }
  }
  toggleChecked(activity: any): void {
    activity.isChecked = !activity.isChecked;
  
    const activityData = {
      ...activity,
      jobId: this.data.job.id
    };
  
    const token = localStorage.getItem('auth_token');
    if (token) {
      console.log('Updating activity:', activityData);
      this.todoItemService.saveOrUpdateTodoItem(token, activityData).subscribe({
        next: () => this.refreshActivities(),
        error: err => console.error('Failed to update the activity', err)
      });
    }
  }
  

  
  
  
refreshActivities(): void {
  const token = localStorage.getItem('auth_token');
  if (token && this.data && this.data.job && this.data.job.id) {
    this.todoItemService.getActivitiesByJobId(Number(this.data.job.id), token).subscribe({
      next: (activities) => {
        this.activities = activities.map(activity => ({
          ...activity,
          isChecked: activity.isChecked
        }));
        console.log('Activities refreshed successfully', this.activities);
      },
      error: (err) => {
        console.error('Error loading activities', err);
      }
    });
  }
}

  

  constructor(
    private todoItemService: TodoitemService,
    private uploadService: UploadResumeService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JobDetailsComponent>,
    private jobService: JobService, 
    private snackBar: MatSnackBar,
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
    this.timelineForm = this.fb.group({
      events: this.fb.array([])
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
        this.jobDetailsForm.get('color')!.setValue(this.selectedColor); 
      }
    });
    
  }
  
  ngOnInit(): void {
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
      this.loadFileName(Number(this.data.job.id)); 

    }
    this.loadActivities(Number(this.data.job.id));

  }

  loadFileName(jobId: number): void {

    this.uploadService.getFileName(jobId).subscribe(fileName => {
        this.uploadedFileName = fileName;
        console.log('File loaded:', this.uploadedFileName);

    }, error => {
        console.error('Failed to load file name', error);
    });
}
  
downloadFile(fileName: string | null): void {
  if (fileName) {
    const url = this.uploadService.getDownloadUrl(fileName);
    window.open(url, '_blank');
  }
}


  loadActivities(jobId: number): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
        this.todoItemService.getActivitiesByJobId(jobId, token).subscribe({
            next: (activities) => {
                this.activities = activities.map(activity => ({
                    ...activity,
                    isChecked: activity.checked || false  
                }));
                console.log('Activities loaded:', this.activities); 
            },
            error: (err) => console.error('Error loading activities', err)
        });
    }
}


  

  onSubmit(): void {
    if (this.jobDetailsForm.valid) {
      const jobData = {
        ...this.jobDetailsForm.value,
        id: this.data.job?.id, 
        columnName: this.data.column.name  
      };
  
      console.log("Attempting to save or update job:", jobData);
  
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.jobService.saveOrUpdateJob(token, jobData).subscribe({
          next: (response: any) => {
            console.log('Job saved or updated successfully', response);
            this.snackBar.open('Job saved or updated succesfully!', 'Close', { duration: 3000 });

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
    return Math.random().toString(36).substring(2, 9);
  }


  fileToUpload: File | null = null;
  uploadDate: Date | null = null;
  loading: boolean = false;


  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.fileToUpload = files[0];
      this.uploadedFileName = files[0].name;  // Setează numele fișierului imediat după selecție
      this.uploadDate = new Date();  // Setează data curentă imediat după selecție
    }
  }
  
  uploadPDF(): void {
    if (this.fileToUpload && this.data.job.id) {  // Verifică dacă fileToUpload nu este null
      this.uploadService.uploadFile(Number(this.data.job.id), this.fileToUpload).subscribe(
        response => {
          console.log('File uploaded successfully', response);
          // Asigură-te că fileToUpload nu este null înainte de a accesa .name
          if (this.fileToUpload) {
            this.uploadedFileName = this.fileToUpload.name; // Setează numele fișierului după încărcare
          }
          this.uploadDate = new Date(); 
          alert('File uploaded successfully: ' + response);
        },
        error => {
          console.error('Error uploading file', error);
          alert('Error uploading file: ' + error.message);
        }
      );
    } else {
      console.error('No file selected or job ID is missing');
      alert('No file selected or job ID is missing');
    }
  }
  
  deleteFile(): void {
    const jobId = this.data.job.id;
    console.log(`Attempting to delete file for job ID: ${jobId}`);
    
    const token = localStorage.getItem('auth_token'); 
    if (token) {
      console.log('Authentication token found:', token);
      
      this.uploadService.deleteFile(Number(jobId), token).subscribe(response => {
        console.log('File deleted successfully', response);
        this.uploadedFileName = null;
        this.uploadDate = null;
        alert('File deleted successfully');
      }, error => {
        console.error('Error deleting file:', error);
        alert('Error deleting file: ' + error.message);
      });
    } else {
      console.error('Authentication token not found. Please log in.');
      alert('Authentication token not found. Please log in.');
    }
  }
  
  

  removeFile(): void {
    this.fileToUpload = null;
    this.uploadDate = null;
    this.deleteFile(); 
  }
  


  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length) {
      this.fileToUpload = event.dataTransfer.files[0];
      this.uploadDate = new Date();
    }
  }

  onDragOver(event: Event): void {
    event.preventDefault();
  }

  onDragLeave(event: Event): void {
    event.preventDefault();
  }

 


  
}