import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobSearchManuallyService {

  private baseUrl = 'http://localhost:8080/api/v1/jooble';

  constructor(private http: HttpClient) { }

  searchJobs(keywords: string, location: string, token: string): Observable<any> {
    const body = { keywords, location };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/search`, body, { headers });
  }
}
