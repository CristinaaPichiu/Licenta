import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type JobListKeys = 'toApply' | 'applied' | 'interview' | 'underReview' | 'rejected' | 'offer';

export interface JobColumn {
    jobs: Job[]; // Array to hold jobs of type Job
    message: string; // Message to show for actions
    showMessage: boolean; // Flag to control message display
}

export interface Job {
    id: string;
    jobTitle: string;
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

    addJobToList(job: Job, listName: JobListKeys): void {
        const column = this.jobLists[listName];
        if (column) {
            console.log(`Adding job to column: ${listName}`);
            column.jobs.push(job);
            this.jobListSource.next(this.jobLists);
        } else {
            console.error("Column not found: ", listName);
        }
    }
    
    
    

    transferJob(job: Job, from: JobListKeys, to: JobListKeys): void {
        this.moveJobBetweenColumns(job, from, to);
    }

    private moveJobBetweenColumns(job: Job, from: JobListKeys, to: JobListKeys): void {
        let fromJobs = this.jobLists[from].jobs;
        let toJobs = this.jobLists[to].jobs;

        fromJobs = fromJobs.filter(j => j.id !== job.id); // Updated to compare job IDs
        toJobs.push(job);

        this.jobLists[from].jobs = fromJobs;
        this.jobLists[to].jobs = toJobs;

        this.jobListSource.next(this.jobLists);
    }

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
