import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoverLetterDataService {
  private coverLetter = new BehaviorSubject<any>({}); 
  private signature = new BehaviorSubject<string>('');


  currentCoverLetter = this.coverLetter.asObservable(); 
  currentSignature = this.signature.asObservable();


  constructor() {}

  updateCoverLetterForm(data: any) {
    this.coverLetter.next(data);
  }

  getCurrentCoverLetterSnapshot(): any {
    return this.coverLetter.getValue();
  }

  updateSignature(signature: string) {
    this.signature.next(signature);
  }

  getCurrentSignatureSnapshot(): string {
    return this.signature.getValue();
  }
}
