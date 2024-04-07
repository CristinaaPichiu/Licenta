import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  imagePreview: SafeUrl | null = null;
  // Your form group and other properties go here

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Initialize your form here
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files[0]) {
      const file = element.files[0];
      // Generate a preview of the image
      const url = URL.createObjectURL(file);
      // Use the sanitizer to allow the image URL to be safe to use
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(url);
    }
  }


  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  

  onSubmit(): void {
    // Implement the submission of the form data
    console.log('Form Submitted');
  }
}
