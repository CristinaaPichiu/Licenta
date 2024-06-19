import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoitemService {

  private baseUrl = 'http://localhost:8080/api/v1/todoItems'; // URL-ul pentru API-ul de ToDoItems

  constructor(private http: HttpClient) { }

  // Metoda pentru crearea unui ToDoItem
  createTodoItem(token: string, todoItemData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/saveItem`, todoItemData, { headers });
  }

  // În serviciul tău, de exemplu TodoItemService
getActivitiesByJobId(jobId: number, token: string): Observable<any[]> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  return this.http.get<any[]>(`${this.baseUrl}/byJob/${jobId}`, { headers });
}

}
