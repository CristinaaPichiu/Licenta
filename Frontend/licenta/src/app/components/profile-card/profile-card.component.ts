import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  // Use the non-null assertion operator to tell TypeScript that the form will be initialized
  personalInfoForm!: FormGroup; // Adding '!' tells TypeScript that you're sure it will be initialized.

  // Use ViewChild to get a reference to the file input element
  @ViewChild('fileInput') fileInput!: ElementRef; // Adding '!' as above.

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.personalInfoForm = this.fb.group({
      profileImage: [''],
      accountType: ['User'],
      name: [''],
      email: [''],
      lifeGoals: ['']
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    if (file) {
      this.personalInfoForm.patchValue({ profileImage: file.name });
      // Handle file preview or upload here
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    if (this.personalInfoForm.valid) {
      console.log(this.personalInfoForm.value);
      // Submit your data
    } else {
      console.error('Form is not valid');
    }
  }
}
