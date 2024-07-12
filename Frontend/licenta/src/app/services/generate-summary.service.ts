import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateSummaryService {
  private apiUrl = 'http://localhost:8080/api/v1/chat/first';  

  constructor(private http: HttpClient) { }

  sendSummaryData(data: any): Observable<any> {
    return this.http.post(this.apiUrl, {summaryData: data});
  }

  getChatResponse(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
