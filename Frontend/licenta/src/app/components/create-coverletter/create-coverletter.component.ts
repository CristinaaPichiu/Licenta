import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-coverletter',
  templateUrl: './create-coverletter.component.html',
  styleUrls: ['./create-coverletter.component.scss']
})
export class CreateCoverletterComponent implements OnInit {
  currentImageIndex = 0;
  images = [
    'assets/cvl1.png',
    'assets/cvl2.png',
    'assets/cvl3.png'
  ];

  ngOnInit() {
    this.startImageSlider();
  }

  startImageSlider() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 2000); 
  }

  loading: boolean = false; 

  constructor(private router: Router) {}

  navigateToCreate() {
    this.loading = true; 
    
    setTimeout(() => {
      this.loading = false; 
      this.router.navigate(['/select-template-cover-letter']); 
    }, 1000);
  }
  

}
