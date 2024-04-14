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
  updateUserProfile(token: string, userProfile: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}/update_profile`, userProfile, { headers });
  }
  
   // Actualizează detaliile utilizatorului
   updateUserDetails(token: string, userDetails: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}/my_details`, userDetails, { headers });
  }
  getUserDetailsFromServer(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get(`${this.baseUrl}/my_details`, { headers });
  }

  

}
