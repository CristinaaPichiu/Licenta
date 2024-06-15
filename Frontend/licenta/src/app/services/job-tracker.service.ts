import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type JobListKeys = 'toApply' | 'applied' | 'interview' | 'underReview' | 'rejected' | 'offer';

export interface JobColumn {
jobs: any[]; // Array to hold jobs
message: string; // Message to show for actions
showMessage: boolean; // Flag to control message display
}

export interface Job {
id: string;
title: string;
company: string;
date: Date;
location: string;
salary: number;
jobType: string;
link: string;
notes: string;
}

@Injectable({
providedIn: 'root'
})
export class JobService {
private jobLists: Record<JobListKeys, JobColumn> = {
toApply: { jobs: [], message: '', showMessage: false },
applied: { jobs: [], message: '', showMessage: false },
interview: { jobs: [], message: '', showMessage: false },
underReview: { jobs: [], message: '', showMessage: false },
rejected: { jobs: [], message: '', showMessage: false },
offer: { jobs: [], message: '', showMessage: false }
};

private jobListSource = new BehaviorSubject<Record<JobListKeys, JobColumn>>(this.jobLists);
currentJobLists = this.jobListSource.asObservable();

constructor() { }

addJobToList(job: any, listName: JobListKeys): void {
const column = this.jobLists[listName];
column.jobs.push(job);
column.message = 'Job added to ${listName} successfully!';
column.showMessage = true;
setTimeout(() => {
column.showMessage = false;
this.jobListSource.next(this.jobLists);
}, 3000);
}

transferJob(job: any, from: JobListKeys, to: JobListKeys): void {
this.moveJobBetweenColumns(job, from, to);
}

moveJobBetweenColumns(job: any, from: JobListKeys, to: JobListKeys): void {
let fromJobs = this.jobLists[from].jobs;
let toJobs = this.jobLists[to].jobs;


fromJobs = fromJobs.filter(j => j !== job);
toJobs.push(job);

this.jobLists[from].jobs = fromJobs;
this.jobLists[to].jobs = toJobs;

this.jobListSource.next(this.jobLists);
}
// In JobService
updateJobLists(): void {
// Emit the current state of jobLists to update subscribers
this.jobListSource.next(this.jobLists);
}

private jobsSource = new BehaviorSubject<Job[]>([]);
jobs$ = this.jobsSource.asObservable();

addJob(job: Job) {
const currentJobs = this.jobsSource.value;
this.jobsSource.next([...currentJobs, job]);
}
}