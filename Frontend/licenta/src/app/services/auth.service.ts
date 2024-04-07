import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth'; // URL-ul pentru backend

  constructor(private http: HttpClient) { }

  // Autentificare
  authenticate(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, { email, password }).pipe(
      tap(response => localStorage.setItem('auth_token', response.token)) // Presupunem că backend-ul returnează un obiect cu un token
    );
  }

  // Înregistrare
  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, { firstName, lastName, email, password }).pipe(
      tap(response => {
        // Similar cu autentificarea, presupunând că un token este furnizat în răspunsul de înregistrare
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }
}
