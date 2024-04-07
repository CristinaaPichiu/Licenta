import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private baseUrl = 'http://localhost:8080/api/v1/user'; // URL-ul pentru backend

  constructor(private http: HttpClient) { }

  getUserDetails(token: string): Observable<any> {
    // Creează header-ul de autorizare
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/details`, { headers });
  }
}
