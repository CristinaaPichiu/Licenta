import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { SelectTemplateCvService } from 'src/app/services/select-template-cv.service';

@Component({
  selector: 'app-select-template-resume',
  templateUrl: './select-template-resume.component.html',
  styleUrls: ['./select-template-resume.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('left', style({ transform: 'translateX(-100%)' })),
      state('right', style({ transform: 'translateX(100%)' })),
      state('center', style({ transform: 'translateX(0)' })),
      transition('* => *', animate('500ms ease'))
    ])
  ]
})
export class SelectTemplateResumeComponent {


  constructor(private router: Router, private templateService: SelectTemplateCvService) {}

  selectedTemplate: string = 'default';  // Un template default sau null

  images = [
    { url: '/assets/template10.png', description: 'Image 1', template: 'app-third-template' },
    { url: '/assets/template6.png', description: 'Image 2', template: 'app-template-cv' },
    { url: '/assets/template4.png', description: 'Image 3' ,  template: 'app-second-template-cv'},
    // Add more images as needed
  ];
  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  selectTemplate(template: string) {
    this.selectedTemplate = template;
  }

  selectAndNavigate(template: string) {
    this.templateService.changeTemplate(template); // actualizează template-ul folosind serviciul
    this.router.navigate(['/create-resume']); // navighează programatic
  }
  
}
