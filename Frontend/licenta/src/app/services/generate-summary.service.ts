import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateSummaryService {
  private apiUrl = 'http://localhost:8080/api/v1/chat/first';  // URL-ul corect al endpoint-ului tău

  constructor(private http: HttpClient) { }

  // Trimite datele de rezumat către server
  sendSummaryData(data: any): Observable<any> {
    return this.http.post(this.apiUrl, {summaryData: data});
  }

  // Metoda pentru a obține un răspuns de la chat, dacă este necesar
  getChatResponse(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
