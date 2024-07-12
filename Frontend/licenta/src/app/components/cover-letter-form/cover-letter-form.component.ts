import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { CoverLetterDataService } from 'src/app/services/cover-letter-data.service';
import { SaveCoverLetterService } from 'src/app/services/save-cover-letter.service';
import * as html2pdf from 'html2pdf.js';
import { SelectTemplateCvService } from 'src/app/services/select-template-cv.service';
import { Router } from '@angular/router';
import { PdfEmailService } from 'src/app/services/pdf-email-service.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

enum FormMode {
  DASHBOARD = 'dashboard',
  CREATE = 'create'
}

@Component({
  selector: 'app-cover-letter-form',
  templateUrl: './cover-letter-form.component.html',
  styleUrls: ['./cover-letter-form.component.scss']
})
export class CoverLetterFormComponent implements OnInit, AfterViewInit {
  selectedSection: string | null = 'contact';

  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;

  contactForm!: FormGroup;
  informationForm!: FormGroup;
  linksForm!: FormGroup;
  bodyForm!: FormGroup;
  emailForm!: FormGroup;

  coverLetterData: any = {};
  isPreviewMode = false;
  isEmailModalOpen = false;
  selectedTemplate!: number;
  selectedTemplateLetter!: number;
  formMode: FormMode = FormMode.CREATE;


  

  constructor(private fb: FormBuilder,
              private coverLetterDataService: CoverLetterDataService,
              private saveCoverLetterService: SaveCoverLetterService,
              private templateService: SelectTemplateCvService,
              private router: Router,
              private pdfEmailService: PdfEmailService,
              private snackBar: MatSnackBar

            ) {}

  ngOnInit() {
    this.initializeForms();
    this.determineFormMode();
    this.templateService.currentTemplate.subscribe(template => {
      this.selectedTemplate = template;
      console.log('Current template ID set:', this.selectedTemplate);
    });

    this.loadSelectedTemplate();


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

  ngAfterViewInit() {
    if (this.canvasElement) {
      this.signaturePad = new SignaturePad(this.canvasElement.nativeElement);
      this.signaturePad.addEventListener('endStroke', () => this.onSignature());
    }
  }

  ngAfterViewChecked() {
    if (!this.signaturePad && this.canvasElement) {
      this.signaturePad = new SignaturePad(this.canvasElement.nativeElement);
      this.signaturePad.addEventListener('endStroke', () => this.onSignature());
    }
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
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  showSection(section: string) {
    this.selectedSection = section;
  }

  updateContactData() {
    if (this.contactForm.valid) {
      this.coverLetterData.contact = this.contactForm.value;
      this.showSection('information');
    } else {
      alert('Please fill all required fields.');
    }
  }

  updateInformationData() {
    if (this.informationForm.valid) {
      this.coverLetterData.information = this.informationForm.value;
      this.showSection('body');
    } else {
      alert('Please fill all required fields.');
    }
  }

  updateBodyData() {
    if (this.bodyForm.valid) {
      this.coverLetterData.body = this.bodyForm.value.body;
      this.showSection('finish');
    } else {
      alert('Please write your cover letter.');
    }
  }

  buildCoverLetterObject(): any {
    return {
      contactUser: this.contactForm.value,
      contactEmployer: this.informationForm.value,
      body: this.bodyForm.value,
    };
  }

  onSaveCoverLetter(): void {
    const coverLetterData = {
      ...this.buildCoverLetterObject(),
      templateId: this.selectedTemplate  
    };
  
    console.log('Cover Letter Data:', coverLetterData);  
  
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.saveCoverLetterService.saveCoverLetter(token, coverLetterData).subscribe({
        next: (response: any) => {
          console.log('Cover letter saved successfully', response);
          this.snackBar.open('Cover letter saved successfully!', 'Close', { duration: 3000 });
          if (response && response.id) {
            localStorage.setItem('currentCoverLetterId', response.id);
          }
        },
        error: (error: any) => {
          console.error('Failed to save cover letter', error);
          alert('Failed to save cover letter: ' + error.message);
        }
      });
    } else {
      alert('Please log in to save your cover letter.');
    }
  }
  

  private determineFormMode() {
    const mode = localStorage.getItem('letterCreationMode');
  
    if (mode === 'dashboard') {
      this.formMode = FormMode.DASHBOARD;
      this.loadCoverLetterData();
    } else {
      this.formMode = FormMode.CREATE; 
      this.initializeFormsForCreate(); 
    }
  }

  
loadSelectedTemplate() {
  const templateId = localStorage.getItem('selectedTemplateLetter');
  if (templateId) {
    this.selectedTemplateLetter = +templateId;
    this.templateService.changeTemplate(this.selectedTemplateLetter);
  }
}
private initializeFormsForCreate() {

  this.contactForm.reset();
  this.informationForm.reset();
  this.bodyForm.reset();
  this.linksForm.setControl('linkEntries', this.fb.array([]));
}

loadCoverLetterData() {
  const coverLetterId = this.router.getCurrentNavigation()?.extras.state?.['currentLetterId']
                        || localStorage.getItem('currentLetterId');
  const token = localStorage.getItem('auth_token');

  if (coverLetterId && token) {
    this.saveCoverLetterService.getCoverLetterById(coverLetterId, token).subscribe({
      next: (coverLetter: any) => {
        console.log('Loaded cover letter data for ID:', coverLetterId, coverLetter);
        this.populateForms(coverLetter); 
      },
      error: (error) => {
        console.error(`Failed to load cover letter with ID ${coverLetterId}`, error);
      }
    });
  } else {
    console.log('Cover letter ID or token not found, cannot load cover letter data');
  }
}


  populateForms(coverLetter: any) {
    if (coverLetter.coverLetterContactUser) {
      this.contactForm.patchValue(coverLetter.coverLetterContactUser);
    }
    if (coverLetter.coverLetterContactEmployer) {
      this.informationForm.patchValue(coverLetter.coverLetterContactEmployer);
    }
    if (coverLetter.coverLetterBody) {
      this.bodyForm.patchValue(coverLetter.coverLetterBody);
    }
    if (coverLetter.links) {
      this.linksForm.setControl('linkEntries', this.fb.array(
        coverLetter.links.map((link: any) => this.fb.group({
          label: [link.label, Validators.required],
          url: [link.url, [Validators.required, Validators.pattern('https?://.+')]]
        }))
      ));
    }
  }

  onUpdateCoverLetter(): void {
    const coverLetterData = this.buildCoverLetterObject();
    const coverLetterId = this.getCurrentCoverLetterId();
    const token = localStorage.getItem('auth_token');

    if (coverLetterId && token) {
      this.saveCoverLetterService.updateCoverLetter(coverLetterId, token, coverLetterData).subscribe({
        next: (response) => {
          console.log('Cover letter updated successfully', response);
          alert('Cover letter updated successfully!');
        },
        error: (error) => {
          console.error('Failed to update cover letter', error);
          alert('Failed to update cover letter: ' + error.message);
        }
      });
    } else {
      if (!coverLetterId) {
        console.error('No cover letter ID found. Please select a cover letter to update.');
        alert('No cover letter ID found. Please select a cover letter to update.');
      }
      if (!token) {
        console.error('Authentication token not found. Please log in.');
        alert('Please log in to update your cover letter.');
      }
    }
  }

  getCurrentCoverLetterId(): string | null {
    return localStorage.getItem('currentLetterId');
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

  clearSignature() {
    this.signaturePad.clear();
    this.coverLetterDataService.updateSignature('');
  }

  onSignature() {
    const signatureData = this.signaturePad.toDataURL();
    this.coverLetterDataService.updateSignature(signatureData);
    // Asigură-te că starea este actualizată pentru a include semnătura în PDF
    this.coverLetterData.signature = signatureData;
  }

  downloadCoverLetter() {
    const element = document.getElementById('letter');

    const options = {
      margin: 1,
      filename: 'CoverLetter.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save();
  }


  previewCoverLetter() {
    this.isPreviewMode = true;
    document.body.classList.add('preview-active');
  }

  closePreview() {
    this.isPreviewMode = false;
    document.body.classList.remove('preview-active');
  }




openEmailModal() {
  this.isEmailModalOpen = true;
  document.body.classList.add('no-scroll'); 
}

closeEmailModal() {
  this.isEmailModalOpen = false;
  document.body.classList.remove('no-scroll'); 
}

sendEmail() {
  if (this.emailForm.valid) {
    const emailData = this.emailForm.value;
    const token = localStorage.getItem('auth_token'); 

    if (!token) {
      alert('No authentication token found. Please log in.');
      return; 
    }

    this.generatePdf().then(pdfBlob => {
      const formData = new FormData();
      formData.append('file', pdfBlob, 'resume.pdf');
      formData.append('recipient', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('body', emailData.body);

      this.pdfEmailService.sendPdfEmail(formData, token).subscribe(
        response => console.log('Email sent successfully', response),
        error => console.error('Failed to send email', error)
      );
    }).catch(error => {
      console.error('Error generating PDF', error);
      alert('Failed to generate PDF. Please try again.');
    });

    this.closeEmailModal();
  } else {
    alert('Please fill all required fields.');
  }
}

async generatePdf(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const element = document.getElementById('letter');
    if (!element) {
      reject('PDF content element not available.');
      return;
    }

    const options = {
      margin: 1,
      filename: 'CoverLetter.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf(element, options)
      .output('blob')  // Aceasta generează blob-ul, fără a descărca PDF-ul
      .then((blob: Blob) => {
        resolve(blob);
      })
      .catch((err: any) => {
        console.error('Error generating PDF:', err);
        reject(err);
      });
  });
}
}
