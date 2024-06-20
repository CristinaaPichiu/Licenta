import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadResumeService {

  private baseUrl = 'http://localhost:8080/api/v1/jobs'; // URL-ul pentru backend
  public bucketName = 'bucket_documents_1';

  constructor(private http: HttpClient) { }

  uploadFile(jobId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.baseUrl}/${jobId}/upload`, formData, {
      headers: new HttpHeaders({
        'Accept': 'text/plain'
      }),
      responseType: 'text' // Specifică tipul de răspuns ca text
    });
  }
  getFileName(jobId: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/${jobId}/file`, { responseType: 'text' });
  }

  getDownloadUrl(fileName: string): string {
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }


  deleteFile(jobId: number, token: string): Observable<any> {
    console.log(`Deleting file for job ID: ${jobId} with token: ${token}`);
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.delete(`${this.baseUrl}/${jobId}/file`, { headers, responseType: 'text' });
  }
}
