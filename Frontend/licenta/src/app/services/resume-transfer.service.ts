import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeTransferService {

  private resumeData: any;

  constructor() { }

  // Metoda pentru a seta datele CV-ului
  setResumeData(data: any) {
    this.resumeData = data;
  }

  // Metoda pentru a prelua datele CV-ului
  getResumeData(): any {
    return this.resumeData;
  }

  // Metoda pentru a șterge datele CV-ului
  clearResumeData(): void {
    this.resumeData = null;
  }
}
