import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth'; // URL-ul pentru backend

  constructor(private http: HttpClient) { }

  // Autentificare
  authenticate(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate`, { email, password });
  }

  // Înregistrare
  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { firstName, lastName, email, password });
  }
}
