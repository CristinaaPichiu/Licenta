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

    // Adaugă header-ul de autorizare
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<{ id: string }>('http://localhost:8080/api/upload', formData, {
      headers: headers,
      reportProgress: true,
      observe: 'response'
    }).pipe(
      map(response => {
        // Verificăm dacă răspunsul include un corp și un id, altfel aruncăm o eroare
        if (response.body && response.body.id) {
          return response.body.id;
        } else {
          throw new Error('ID not found in response');
        }
      })
    );
  }

  getProcessedResumeData(id: string, token: string): Observable<any> { // Schimbă tipul de return la any
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`http://localhost:8080/api/resume-data/${id}`, {
      headers: headers
    });
  }
}
