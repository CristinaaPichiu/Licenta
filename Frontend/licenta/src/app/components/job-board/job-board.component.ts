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
activeColumn: JobListKeys = 'toApply'; // Default or determined by user interaction
saveMessage: string = '';
showMessage: boolean = false;
jobStatuses: JobListKeys[] = ['toApply', 'applied', 'interview', 'underReview', 'rejected', 'offer']; // Lista de stări ale joburilor
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
this.jobLists$ = this.jobService.currentJobLists; // Asigură-te că tipurile se potrivesc
}
showAddJobForm(column: Column) {
const dialogRef = this.dialog.open(JobDetailsComponent, {
width: '1000px',
data: { column: column }
});

dialogRef.afterClosed().subscribe(result => {
console.log('Dialog output:', result); // Aici afișăm rezultatul în consola browserului
if (result) {
column.jobs.push(result); // Presupunând că 'tasks' este folosit pentru a stoca joburile
}
});
}

ngOnInit() {
 
  this.connectedDropLists = this.board.columns.map((_, index) => `cdk-drop-list-${index}`);

  this.token = localStorage.getItem('auth_token');
  if (this.token) {
    this.userService.getUserId(this.token).subscribe({
      next: (id) => {
        if (id != null && this.token) { // Ensure id and token are not null
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
      this.clearColumns(); // Curăță coloanele înainte de a le popula din nou
      jobs.forEach(job => {
        // Verifică dacă jobul are un nume de coloană valid, altfel atribuie-l la o coloană implicită
        const targetColumn = job.columnName || 'toApply'; // Alege 'toApply' dacă columnName este null
        const column = this.board.columns.find(c => c.name === targetColumn);
        if (column) {
          column.jobs.push(job);
        } else {
          // Opțional: gestionează cazul în care nu există o coloană corespunzătoare (loghează eroarea sau creează dinamic coloana)
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


// În JobBoardComponent
openDeleteDialog(event: MouseEvent, job: Job): void {
  event.stopPropagation(); // Opriți propagarea pentru a nu declanșa alte click events.
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
          this.cdr.detectChanges();  // Forțează detectarea schimbărilor
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
this.closeJobDetailsForm(); // Închide formularul și resetează vizualizarea
}
}

navigateToDashboard() {
this.loading = true;
setTimeout(() => {
this.loading = false;
this.router.navigate(['/dashboard']); // Navighează înapoi la dashboard
}, 1000);
}

handleAddClick(column: JobListKeys): void {
this.activeColumn = column; // Setează coloana activă pe baza selecției utilizatorului
this.showDetails = true; // Deschide modalul cu detalii
}

closeDetails(): void {
this.showDetails = false; // Închide detalii
}

changeView(view: string): void {
this.currentView = view; // Schimbă între General, Timeline și Documents
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
      column.jobs.push(newJob); // Pushing the new Job object, not a string
      this.newTask = '';        // Clearing the new task input
      this.currentColumnToAddTask = null; // Resetting the form visibility
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

    // Obține indexul noii coloane
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
      data: { job: job, column: column } // Trimite jobul și coloana către dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizează jobul existent cu noile valori
        Object.assign(job, result);
        // Notifică serviciul de joburi să actualizeze listele dacă este necesar
        this.jobService.updateJobLists();
      }
    });
  }

  currentTab: string = 'resumes';

  navigateTo(tab: string) {
    this.currentTab = tab;
    // Poți adăuga aici logica pentru a naviga la alte componente sau rute
  }

  

}