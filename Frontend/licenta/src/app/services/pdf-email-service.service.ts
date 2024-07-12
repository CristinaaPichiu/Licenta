import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfEmailService {
  private apiUrl = 'http://localhost:8080/api/v1/email/sendPdfEmail';

  constructor(private http: HttpClient) { }

  sendPdfEmail(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }
}
