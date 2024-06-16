import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type JobListKeys = 'toApply' | 'applied' | 'interview' | 'underReview' | 'rejected' | 'offer';

export interface JobColumn {
    jobs: Job[]; // Array to hold jobs of type Job
    message: string; // Message to show for actions
    showMessage: boolean; // Flag to control message display
}

export interface Job {
    id?: string; 
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

    constructor(private http: HttpClient) {}

    
      addJobToList(job: Job, listName: JobListKeys) {
        const column = this.jobLists[listName];
        if (column) {
          column.jobs.push(job);
          this.jobListSource.next(this.jobLists);
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



    private baseUrl = 'http://localhost:8080/api/v1/jobs'; // URL-ul API-ului tău

    saveJob(token: string, jobData: Job): Observable<Job> {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
    
        return this.http.post<Job>(this.baseUrl, jobData, { headers });
      }
    
      // Obținerea joburilor după ID-ul utilizatorului
      getJobsByUser(token: string, userId: number): Observable<Job[]> {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        return this.http.get<Job[]>(`${this.baseUrl}/user/${userId}`, { headers });
      }

      clearJobs() {
        Object.keys(this.jobLists).forEach(key => this.jobLists[key as JobListKeys].jobs = []);
      }
      
     
      
}
