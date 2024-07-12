import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private http: HttpClient) { }

  uploadFile(file: File, token: string): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<{ id: string }>('http://localhost:8080/api/upload', formData, {
      headers: headers,
      reportProgress: true,
      observe: 'response'
    }).pipe(
      map(response => {
        if (response.body && response.body.id) {
          return response.body.id;
        } else {
          throw new Error('ID not found in response');
        }
      })
    );
  }
  
  
  getProcessedResumeData(id: string, token: string): Observable<any> { 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`http://localhost:8080/api/resume-data/${id}`, {
      headers: headers
    });
  }
}
