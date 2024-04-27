import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeDataService {
  private resume = new BehaviorSubject<any>({}); // Inițializează cu un obiect gol

  currentResume = this.resume.asObservable(); // Observable pentru a urmări schimbările

  constructor() {}

  updateResumeForm(data: any) {
    this.resume.next(data); 
    console.log(data);
    
  }
  getCurrentResumeSnapshot(): any {
    return this.resume.getValue();
  }
}
