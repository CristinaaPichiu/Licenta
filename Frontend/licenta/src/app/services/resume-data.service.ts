import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeDataService {
  private resume = new BehaviorSubject<any>({}); 

  currentResume = this.resume.asObservable(); 

  constructor() {}

  updateResumeForm(data: any) {
    this.resume.next(data); 
    
  }
  getCurrentResumeSnapshot(): any {
    return this.resume.getValue();
  }
}
