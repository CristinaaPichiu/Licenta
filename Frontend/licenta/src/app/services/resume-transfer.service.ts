import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeTransferService {

  private resumeData: any;

  constructor() { }

  setResumeData(data: any) {
    this.resumeData = data;
  }

  getResumeData(): any {
    return this.resumeData;
  }

  clearResumeData(): void {
    this.resumeData = null;
  }
}
