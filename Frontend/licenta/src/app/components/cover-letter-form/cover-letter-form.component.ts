import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoverLetterDataService } from 'src/app/services/cover-letter-data.service';


@Component({
  selector: 'app-cover-letter-form',
  templateUrl: './cover-letter-form.component.html',
  styleUrls: ['./cover-letter-form.component.scss']
})
export class CoverLetterFormComponent implements OnInit {
  selectedSection: string | null = 'contact'; // Default section

  contactForm!: FormGroup;
  informationForm!: FormGroup;
  linksForm!: FormGroup;

  bodyForm!: FormGroup;
  coverLetterData: any = {};

  constructor(private fb: FormBuilder,
    private coverLetterDataService: CoverLetterDataService  ) {

  }

  ngOnInit() {
    this.initializeForms();


    this.contactForm.valueChanges.subscribe(values => {
      this.coverLetterDataService.updateCoverLetterForm({ ...this.coverLetterDataService.getCurrentCoverLetterSnapshot(), contact: values });
    });
    this.informationForm.valueChanges.subscribe(values => {
      this.coverLetterDataService.updateCoverLetterForm({ ...this.coverLetterDataService.getCurrentCoverLetterSnapshot(), information: values });
    });

    this.bodyForm.valueChanges.subscribe(values => {
      this.coverLetterDataService.updateCoverLetterForm({ ...this.coverLetterDataService.getCurrentCoverLetterSnapshot(), smtg: values });
    });

    this.linksForm.valueChanges.subscribe(values => {
      this.coverLetterDataService.updateCoverLetterForm({
        ...this.coverLetterDataService.getCurrentCoverLetterSnapshot(),
        linkEntries: values.linkEntries
      });
    });
    




  }

  initializeForms() {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      status: ['', Validators.required],
      date: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  
    this.informationForm = this.fb.group({
      title: [''],
      firstName: [''],
      lastName: [''],
      position: [''],
      organisation: [''],
      address: ['']
  });

    this.bodyForm = this.fb.group({
      body: ['', Validators.required]
    });

    this.linksForm = this.fb.group({
      linkEntries: this.fb.array([])
    });
  }

  showSection(section: string) {
    this.selectedSection = section;
  }

  updateContactData() {
    if (this.contactForm.valid) {
      this.coverLetterData.contact = this.contactForm.value;
      this.showSection('body');
    } else {
      alert('Please fill all required fields.');
    }
  }

  updateInformationData() {
    // Logic to handle form submission
}

  updateBodyData() {
    if (this.bodyForm.valid) {
      this.coverLetterData.body = this.bodyForm.value.body;
      this.showSection('finish');
    } else {
      alert('Please write your cover letter.');
    }
  }
  

  onSaveCoverLetter() {
    console.log('Cover Letter Data:', this.coverLetterData);
    alert('Cover Letter saved successfully!');
    // Implement save logic here
  }

  onUpdateCoverLetter() {
    console.log('Updated Cover Letter Data:', this.coverLetterData);
    alert('Cover Letter updated successfully!');
    // Implement update logic here
  }

  goToPreviousSection() {
    if (this.selectedSection === 'body') {
      this.showSection('contact');
    } else if (this.selectedSection === 'finish') {
      this.showSection('body');
    }
  }

  linkEntries(): FormArray {
    return this.linksForm.get('linkEntries') as FormArray;
  }
  
  newLink(): FormGroup {
    return this.fb.group({
      label: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }
  
  addLink(): void {
    this.linkEntries().push(this.newLink());
  }
  
  removeLink(index: number): void {
    this.linkEntries().removeAt(index);
  }
}
