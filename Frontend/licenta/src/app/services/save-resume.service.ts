import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private baseUrl = 'http://localhost:8080/api/v1/resume'; 

  constructor(private http: HttpClient) { }

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

  uploadResumePicture(resumeId: string, file: File, token: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post(`${this.baseUrl}/${resumeId}/upload_picture`, formData, { headers });
  }

  getProfilePictureUrl(resumeId: string, token: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<string>(`${this.baseUrl}/${resumeId}/picture_url`, {
      headers: headers,
      responseType: 'text' as 'json'
    });
  }
  

  deleteResume(resumeId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete(`${this.baseUrl}/${resumeId}`, {
      headers: headers,
      responseType: 'text' 
    });
  }
  
  
  
  
  
}