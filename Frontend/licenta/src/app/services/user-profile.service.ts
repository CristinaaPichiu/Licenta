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
   
 // UserProfileService
 getUserEmail(token: string): Observable<string> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<string>(`${this.baseUrl}/email`, { headers, responseType: 'text' as 'json' });
}

  
changePassword(token: string, passwords: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json', // Adaugă acest header dacă lipsește
  });
  return this.http.post(`${this.baseUrl}/change-password`, passwords, { headers, responseType: 'text' });
}

getUserId(token: string): Observable<number> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  // Se presupune că endpoint-ul /id returnează direct un număr (ID-ul utilizatorului)
  return this.http.get<number>(`${this.baseUrl}/id`, { headers });
}


}
