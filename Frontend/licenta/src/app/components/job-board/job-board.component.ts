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

showJobDetails = false;

constructor(
private router: Router,
private fb: FormBuilder,
private jobService: JobService,
private dialog: MatDialog,

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
        this.generateId(),      // Ensure this method exists to generate unique IDs
        this.newTask,           // Assuming this string is the job title
        'Unknown Company',      // Default company name
        new Date(),             // Use current date or a default
        'Unknown Location',     // Default location
        0,                      // Default salary as 0
        'Not specified',        // Default job type
        '',                     // No link
        ''                      // No notes
      );
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
    }
  }
  
showJobDetailsForm() {
this.showJobDetails = true;
}

closeJobDetailsForm() {
this.showJobDetails = false;
}

}