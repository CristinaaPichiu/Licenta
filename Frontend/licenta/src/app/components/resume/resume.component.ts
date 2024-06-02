import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent {
  loading: boolean = false; 

  constructor(private router: Router) {}

  navigateToCreateResume() {
    this.loading = true; 
    
    setTimeout(() => {
      this.loading = false; 
      this.router.navigate(['/select-template-resume']); 
    }, 1000);
  }
  
  
}
