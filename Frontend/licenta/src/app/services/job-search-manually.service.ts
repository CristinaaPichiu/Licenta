import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobSearchManuallyService {
  public jobs: any[] = [];  // Array-ul jobs pentru a memora datele
  public jobsByResume: any[] = [];  // Array-ul jobs pentru a memora datele căutate pe baza CV-urilor


  private baseUrl = 'http://localhost:8080/api/v1/jooble';

  constructor(private http: HttpClient) { }

  searchJobs(keywords: string, location: string, page: number = 1, pageSize: number = 10, token: string): Observable<any> {
    const body = { keywords, location, page, pageSize };
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/search`, body, { headers }).pipe(
      map((response: any) => {


        this.jobs = response.jobs.slice(0, 5).map((job: any) => ({
          title: job.title || 'No Title Provided',
          company: job.company || 'No Company Provided',
          location: job.location || 'No Location Provided',
          snippet: job.snippet || 'No Description Provided',
          link: job.link || '#',
          updated: job.updated,
          type: job.type
        }));
        console.log('Updated jobs in service:', this.jobs); // Verifică dacă jobs conține date

        return response;
      })
      
    );
  }


  searchJobsByResume(keywords: string, location: string, page: number = 1, pageSize: number = 10, token: string): Observable<any> {
    const body = { keywords, location, page, pageSize };
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/search`, body, { headers }).pipe(
      map((response: any) => {
        console.log('API Response:', response);
        this.jobsByResume = response.jobs.slice(0, 5).map((job: any) => ({
          title: job.title || 'No Title Provided',
          company: job.company || 'No Company Provided',
          location: job.location || 'No Location Provided',
          snippet: job.snippet || 'No Description Provided',
          link: job.link || '#'
        }));
        console.log('Updated jobs in service:', this.jobsByResume); // Verifică dacă jobs conține date

        return response;
      })
      
    );
  }
}
