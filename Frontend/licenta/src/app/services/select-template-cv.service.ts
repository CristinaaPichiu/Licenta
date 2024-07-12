import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectTemplateCvService {

  private templateSource = new BehaviorSubject<number>(0); 
  currentTemplate = this.templateSource.asObservable();

  constructor() {}

  changeTemplate(templateId: number) {
    console.log(`Changing template ID to: ${templateId}`);
    this.templateSource.next(templateId);
  }
  
}
