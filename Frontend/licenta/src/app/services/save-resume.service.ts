import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private baseUrl = 'http://localhost:8080/api/v1/resume'; // URL-ul pentru backend

  constructor(private http: HttpClient) { }

  // Salvarea datelor resume
  saveResume(token: string, resumeData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/info`, resumeData, { headers });
  }

   getResumeById(resumeId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.baseUrl}/${resumeId}`, { headers });
  }

  getCurrentUserResume(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.baseUrl}/current`, { headers });
  }

   // Actualizarea datelor resume
   updateResume(resumeId: string, token: string, resumeData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.baseUrl}/update/${resumeId}`, resumeData, { headers });
  }

  getAllUserResumes(token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(`${this.baseUrl}/all`, { headers });
  }
  

  
}