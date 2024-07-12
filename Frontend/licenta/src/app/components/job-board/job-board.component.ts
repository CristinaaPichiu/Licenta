import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JobService, JobListKeys, JobColumn } from 'src/app/services/job-tracker.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from 'src/app/models/board.model';
import { Column } from 'src/app/models/column.model';
import { MatDialog } from '@angular/material/dialog';
import { JobDetailsComponent } from '../job-details/job-details.component';
import { Job } from 'src/app/models/job.model';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { JobCardComponent } from '../job-card/job-card.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
selector: 'app-job-board',
templateUrl: './job-board.component.html',
styleUrls: ['./job-board.component.scss']
})
export class JobBoardComponent implements OnInit {
loading: boolean = false;
showDetails: boolean = false;
currentView: string = 'general';
jobLists$: Observable<Record<JobListKeys, JobColumn>>;
jobDetailsForm!: FormGroup;
activeColumn: JobListKeys = 'toApply'; 
saveMessage: string = '';
showMessage: boolean = false;
jobStatuses: JobListKeys[] = ['toApply', 'applied', 'interview', 'underReview', 'rejected', 'offer']; 
jobs: Job[] = [];
showJobDetails = false;
token: string | null = localStorage.getItem('auth_token');
connectedDropLists: string[] = [];

userId?: number;



constructor(
private router: Router,
private fb: FormBuilder,
private jobService: JobService,
private dialog: MatDialog,
private userService: UserProfileService,
private cdr: ChangeDetectorRef

) {
this.jobLists$ = this.jobService.currentJobLists; 
}
showAddJobForm(column: Column) {
const dialogRef = this.dialog.open(JobDetailsComponent, {
width: '1000px',
data: { column: column }
});

dialogRef.afterClosed().subscribe(result => {
console.log('Dialog output:', result); 
if (result) {
column.jobs.push(result); 
}
});
}

ngOnInit() {
 
  this.connectedDropLists = this.board.columns.map((_, index) => `cdk-drop-list-${index}`);

  this.token = localStorage.getItem('auth_token');
  if (this.token) {
    this.userService.getUserId(this.token).subscribe({
      next: (id) => {
        if (id != null && this.token) { 
          this.userId = id;
          this.loadJobs(id, this.token);
        } else {
          console.error('User ID not found or token is null');
        }
      },
      error: (error) => console.error('Failed to get user ID', error)
    });
  } else {
    console.error('Authentication token not found');
  }
}


loadJobs(userId: number, token: string) {
  this.jobService.getJobsByUser(token, userId).subscribe({
    next: (jobs) => {
      this.clearColumns(); 
      jobs.forEach(job => {
        const targetColumn = job.columnName || 'toApply'; 
        const column = this.board.columns.find(c => c.name === targetColumn);
        if (column) {
          column.jobs.push(job);
        } else {
          console.error('No column found for name:', targetColumn);
        }
      });
      console.log('Jobs loaded successfully', jobs);
    },
    error: (error) => {
      console.error('Failed to load jobs', error);
    }
  });
}

clearColumns() {
  this.board.columns.forEach(column => column.jobs = []);
}


openDeleteDialog(event: MouseEvent, job: Job): void {
  event.stopPropagation(); 
  const dialogRef = this.dialog.open(JobCardComponent, {
    width: '300px',
    data: { job }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.deleteJob(job);
    }
  });
}

deleteJob(job: Job): void {
  if (this.token && this.userId != null) {
    const jobId = Number(job.id);
    if (!isNaN(jobId)) {
      this.jobService.deleteJob(this.token, jobId).subscribe({
        next: () => {
          console.log('Job deleted successfully');
          this.jobs = this.jobs.filter(j => j.id !== job.id);
          this.cdr.detectChanges();  
        },
        error: error => console.error('Failed to delete job', error)
      });
    } else {
      console.error('Invalid job ID', jobId);
    }
  } else {
    console.error('Token or User ID is undefined');
  }
}






onSubmit() {
if (this.jobDetailsForm.valid) {
this.jobService.addJob(this.jobDetailsForm.value as Job);
this.closeJobDetailsForm(); 
}
}

navigateToDashboard() {
this.loading = true;
setTimeout(() => {
this.loading = false;
this.router.navigate(['/dashboard']); 
}, 1000);
}

handleAddClick(column: JobListKeys): void {
this.activeColumn = column; 
this.showDetails = true; 
}

closeDetails(): void {
this.showDetails = false; 
}

changeView(view: string): void {
this.currentView = view; 
}

currentColumnToAddTask: Column | null = null;
newTask: string = '';

showAddTaskForm(column: Column) {
this.currentColumnToAddTask = column;
}

addTaskToColumn(column: Column) {
  if (this.newTask) {
      const newJob = new Job(
          this.newTask,               // jobTitle
          'Unknown Company',          // company
          new Date(),                 // date
          'Unknown Location',         // location
          0,                          // salary
          'Not specified',            // jobType
          '',                         // link
          '',                         // notes
          '#42A5F5',                  // color 
          this.generateId()           // id
      );
      console.log(column.jobs);
      column.jobs.push(newJob); 
      this.newTask = '';        
      this.currentColumnToAddTask = null; 
  }
}
  
  generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
  

board: Board = new Board('Test Board', [
new Column('toApply', []),
new Column('applied', []),
new Column('interview', []),
new Column('rejected', []),
new Column('offer', [])
]);

drop(event: CdkDragDrop<Job[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(event.previousContainer.data,
                      event.container.data,
                      event.previousIndex,
                      event.currentIndex);

    const job = event.container.data[event.currentIndex];
    const newColumnIndex = this.board.columns.findIndex(column => column.jobs === event.container.data);
    if (newColumnIndex !== -1) {
      const newColumnName = this.board.columns[newColumnIndex].name;
      console.log('New Column Name:', newColumnName);
      this.updateJobColumn(job, newColumnName);
    } else {
      console.error('Failed to get new column index');
    }
  }
}

updateJobColumn(job: Job, newColumnName: string) {
  if (this.token && job.id) {
    job.columnName = newColumnName;
    this.jobService.saveOrUpdateJob(this.token, job).subscribe({
      next: () => console.log(`Job ${job.id} updated to column ${newColumnName}`),
      error: error => console.error('Failed to update job column', error)
    });
  }
}

  
showJobDetailsForm() {
this.showJobDetails = true;
}

closeJobDetailsForm() {
this.showJobDetails = false;
}

openJobDetails(job: Job, column: Column) {
    const dialogRef = this.dialog.open(JobDetailsComponent, {
      width: '1000px',
      data: { job: job, column: column } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(job, result);
        this.jobService.updateJobLists();
      }
    });
  }

  currentTab: string = 'resumes';

  navigateTo(tab: string) {
    this.currentTab = tab;
    this.router.navigate(['/dashboard']);

  }

  

}