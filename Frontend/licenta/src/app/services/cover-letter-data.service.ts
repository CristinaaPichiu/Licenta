import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoverLetterDataService {
  private coverLetter = new BehaviorSubject<any>({}); // Inițializează cu un obiect gol

  currentCoverLetter = this.coverLetter.asObservable(); // Observable pentru a urmări schimbările

  constructor() {}

  updateCoverLetterForm(data: any) {
    this.coverLetter.next(data);
  }

  getCurrentCoverLetterSnapshot(): any {
    return this.coverLetter.getValue();
  }
}
