import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveCoverLetterService {

  private baseUrl = 'http://localhost:8080/api/v1/letter'; 

  constructor(private http: HttpClient) { }

  saveCoverLetter(token: string, coverLetterData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/datas`, coverLetterData, { headers });
}


   getCoverLetterById(coverLetterId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.baseUrl}/${coverLetterId}`, { headers });
  }

  getCurrentUserCoverLetter(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.baseUrl}/last`, { headers });
  }

  updateCoverLetter(coverLetterId: string, token: string, coverLetterData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.baseUrl}/update/${coverLetterId}`, coverLetterData, { headers });
  }

  getAllCoverLetters(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.baseUrl}/coverletters`, { headers });
  }
}
