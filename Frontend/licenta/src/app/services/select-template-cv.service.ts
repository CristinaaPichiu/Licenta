import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectTemplateCvService {

  private templateSource = new BehaviorSubject<number>(0); // Schimbă default la un ID de template implicit, de exemplu 0 sau oricare ar fi ID-ul default
  currentTemplate = this.templateSource.asObservable();

  constructor() {}

  changeTemplate(templateId: number) {
    console.log(`Changing template ID to: ${templateId}`);
    this.templateSource.next(templateId);
  }
  
}
