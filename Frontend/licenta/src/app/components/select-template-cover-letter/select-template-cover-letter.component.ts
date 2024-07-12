import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { SelectTemplateCvService } from 'src/app/services/select-template-cv.service';
@Component({
  selector: 'app-select-template-cover-letter',
  templateUrl: './select-template-cover-letter.component.html',
  styleUrls: ['./select-template-cover-letter.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('left', style({ transform: 'translateX(-100%)' })),
      state('right', style({ transform: 'translateX(100%)' })),
      state('center', style({ transform: 'translateX(0)' })),
      transition('* => *', animate('500ms ease'))
    ])
  ]
})
export class SelectTemplateCoverLetterComponent {

  
  constructor(private router: Router, private templateService: SelectTemplateCvService) {}

  selectedTemplateLetter: string = 'default';  
  images = [
    { url: '/assets/template14.png', description: 'Image 1', templateId: 3 },
    { url: '/assets/template15.png', description: 'Image 2', templateId: 1 },
    { url: '/assets/template13.png', description: 'Image 3', templateId: 2 },
  ];
  
  
  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  selectTemplate(template: string) {
    this.selectedTemplateLetter = template;
  }

  selectAndNavigate(templateId: number) {
    this.templateService.changeTemplate(templateId); 
    localStorage.setItem('selectedTemplateLetter', templateId.toString()); 
    localStorage.setItem('letterCreationMode', 'create');

    this.router.navigate(['/cover-letter-form']); 
  }
  
  

}
