import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectTemplateCvService {

  private templateSource = new BehaviorSubject<string>('default');
  currentTemplate = this.templateSource.asObservable();

  constructor() {}

  changeTemplate(template: string) {
    this.templateSource.next(template);
  }
}
