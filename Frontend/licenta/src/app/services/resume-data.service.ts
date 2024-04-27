import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ResumeDataService {
  private resumeFormSubject = new BehaviorSubject<FormGroup | null>(null);
  resumeForm$ = this.resumeFormSubject.asObservable();

  updateResumeForm(form: FormGroup) {
    console.log('Updating form data', form.value);
    this.resumeFormSubject.next(form);
  }
}