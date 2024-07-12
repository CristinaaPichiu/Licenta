import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth'; 

  constructor(private http: HttpClient) { }

  authenticate(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, { email, password }).pipe(
      tap(response => localStorage.setItem('auth_token', response.token)),
      catchError(error => {
        let message = "Login failed. Please check your credentials.";
        if (error.error instanceof ErrorEvent) {
          message = "An unexpected error occurred.";
        } else {
          if (error.status === 404) {
            message = "No user found with this email address.";
          } else if (error.error?.message) {
            message = error.error.message;
          }
        }
        return throwError(() => new Error(message));
      })
    );
  }
  
  

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, { firstName, lastName, email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }
 
}
