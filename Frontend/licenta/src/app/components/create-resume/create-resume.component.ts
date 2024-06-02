import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResumeDataService } from 'src/app/services/resume-data.service';
import { ResumeService } from 'src/app/services/save-resume.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as html2pdf from 'html2pdf.js';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { GenerateSummaryService } from 'src/app/services/generate-summary.service';
import { SelectTemplateCvService } from 'src/app/services/select-template-cv.service';







@Component({
  selector: 'app-create-resume',
  templateUrl: './create-resume.component.html',
  styleUrls: ['./create-resume.component.scss']
})
export class CreateResumeComponent implements OnInit {

  steps = ['Contact', 'Experience', 'Education', 'Skills', 'About', 'Finish it', 'Save'];
  skillLevels = ['Novice', 'Beginner', 'Skillful', 'Experienced', 'Expert'];
  skillLevelDescriptions: string[] = [];
  currentStepIndex = 0; 
  resumeForm!: FormGroup;
  experienceForm!: FormGroup;
  educationForm!: FormGroup;
  skillsForm!: FormGroup;
  aboutForm!: FormGroup;
  finishForm!: FormGroup;
  volunteeringForm!: FormGroup;
  projectsForm!: FormGroup;
  linksForm!: FormGroup;
  customSectionForm!: FormGroup;
  activeEducationPanel: number | null = null;
  selectedSection: string | null = null;
  resumeData: any = {}; // Acesta va stoca toate datele CV-ului
  isPreviewMode = false;
  isEmailModalOpen = false;
  emailForm!: FormGroup;
  chatResponse!: string;
  isHovering: boolean = false;
  selectedTemplate!: string; // Declară proprietatea aici





  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService,
    private resumeService: ResumeService,
    public dialog: MatDialog,
    private summaryService: GenerateSummaryService,
    private templateService: SelectTemplateCvService

  ) {}


  onSuggestionClick(text: string): void {
    // Access the summary control and set its value to the provided text
    const summaryControl = this.aboutForm.get('summary');
    if (summaryControl) {
      summaryControl.setValue(text);
    } else {
      console.error('Summary control does not exist.');
    }
  }
  
  

  onMouseEnter(): void {
    this.isHovering = true;
  }

  onMouseLeave(): void {
    this.isHovering = false;
  }

  openDialog(): void {
    const summaryData = this.getSummaryData();
    console.log('Summary Data:', summaryData);
  
    // Deschidem dialogul de încărcare
    const loadingDialogRef = this.dialog.open(LoadingDialogComponent, {
      panelClass: 'custom-dialog-overlay-pane',
      position: { top: '10vh', right: '18vw' },
      width: '400px',
      height: '400px',
      disableClose: true  // opțional, dezactivează închiderea dialogului de încărcare
    });
  
    // Trimiterea datelor la server și așteptarea răspunsului
    this.summaryService.sendSummaryData(summaryData).subscribe(
      response => {
        console.log('Summary data sent successfully', response);
        this.displayChatResponse(response); // Afișează răspunsul în interfața utilizatorului
        loadingDialogRef.close(); // Închide dialogul de încărcare după primirea răspunsului
      },
      error => {
        console.error('Failed to send summary data', error);
        loadingDialogRef.close(); // Închide dialogul de încărcare chiar și în caz de eroare
      }
    );
  }
  
  
  displayChatResponse(chatResponse: any): void {
    this.chatResponse = chatResponse.content; // asigură-te că accesezi .content dacă răspunsul este un obiect
  }

  // Adaugă această metodă în clasa componentei tale Angular

closeAiResponse(chatResponse: any): void {
  this.chatResponse = ''; // Resetează răspunsul AI pentru a ascunde containerul
}

  
  
  
  
  // Metoda pentru deschiderea dialogului de loading
  private openLoadingDialog(): void {
    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      panelClass: 'custom-dialog-overlay-pane', 
      position: { top: '10vh', right: '18vw' }, 
      width: '400px', 
      height: '400px', 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.initializeForms();
    this.addSkillLevelDescriptions();
    this.loadResumeData();
    this.templateService.currentTemplate.subscribe(template => {
      this.selectedTemplate = template;
    });


    
  this.resumeForm.valueChanges.subscribe(values => {
    this.resumeDataService.updateResumeForm({ ...this.resumeDataService.getCurrentResumeSnapshot(), contact: values });
  });

  this.experienceForm.valueChanges.subscribe(values => {
    this.resumeDataService.updateResumeForm({
      ...this.resumeDataService.getCurrentResumeSnapshot(),
      experiences: values.experiences // Aici folosește 'experiences', nu 'experience'
    });
  });
  

  this.educationForm.valueChanges.subscribe(values => {
    this.resumeDataService.updateResumeForm({ ...this.resumeDataService.getCurrentResumeSnapshot(), education: values.educations });
  });

  this.skillsForm.valueChanges.subscribe(values => {
    this.resumeDataService.updateResumeForm({ ...this.resumeDataService.getCurrentResumeSnapshot(), skills: values.skills });
  });

  this.aboutForm.valueChanges.subscribe(values => {
    this.resumeDataService.updateResumeForm({ ...this.resumeDataService.getCurrentResumeSnapshot(), about: values.summary });
  });

  this.volunteeringForm.valueChanges.subscribe(values => {
    this.resumeDataService.updateResumeForm({
      ...this.resumeDataService.getCurrentResumeSnapshot(),
      volunteerExperiences: values.volunteerExperiences
    });
  });
  this.projectsForm.valueChanges.subscribe(values => {
    this.resumeDataService.updateResumeForm({
      ...this.resumeDataService.getCurrentResumeSnapshot(),
      projectExperiences: values.projectExperiences
    });
  });

  this.linksForm.valueChanges.subscribe(values => {
    this.resumeDataService.updateResumeForm({
      ...this.resumeDataService.getCurrentResumeSnapshot(),
      linkEntries: values.linkEntries
    });
  });

  this. customSectionForm.valueChanges.subscribe(values => {
    this.resumeDataService.updateResumeForm({
      ...this.resumeDataService.getCurrentResumeSnapshot(),
      customSections: values.customSections
    });
  });
  }


  

  initializeForms() {
    this.resumeForm = this.fb.group({
      name: [''],
      status: [''],
      address: [''],
      city: [''],
      postalCode: [''],
      phone: [''],
      email: ['']
    });

    this.experienceForm = this.fb.group({
      experiences: this.fb.array([])
    });
    this.educationForm = this.fb.group({
      educations: this.fb.array([])
    });

    this.addEducation();

    this.skillsForm = this.fb.group({
      skills: this.fb.array([this.createSkillFormGroup()])
    });

    this.aboutForm = this.fb.group({
      summary: ['', [Validators.required, Validators.maxLength(1000)]] 
    });

    this.addExperience();

    this.volunteeringForm = this.fb.group({
      volunteerExperiences: this.fb.array([])
    });
    this.projectsForm = this.fb.group({
      projectExperiences: this.fb.array([])
    });
    this.linksForm = this.fb.group({
      linkEntries: this.fb.array([])
    });
    this.customSectionForm = this.fb.group({
      customSections: this.fb.array([])
  });
  this.emailForm = this.fb.group({
    to: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    body: ['', Validators.required]
  });
  }

  addSkillLevelDescriptions() {
    this.skills.controls.forEach((skillControl, index) => {
      this.skillLevelDescriptions[index] = this.skillLevels[0]; 
    });
  }

  selectSkillLevel(skillIndex: number, levelIndex: number): void {
    const levelControl = this.skills.at(skillIndex).get('level');
    if (levelControl) {
      levelControl.setValue(levelIndex + 1); 
      this.skillLevelDescriptions[skillIndex] = this.skillLevels[levelIndex];
    }
  }

  createSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
    });
  }

  get skills(): FormArray {
    return this.skillsForm.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.createSkillFormGroup());
  }
  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  get currentStep() {
    return this.steps[this.currentStepIndex]; // Returnează etapa curentă pe baza indexului
  }

  setCurrentStep(step: string) {
    const stepIndex = this.steps.findIndex(s => s === step);
    if (stepIndex >= 0) {
      this.currentStepIndex = stepIndex;
    }
  }
  goToPreviousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }
  
  
  goToNextStep() {
    console.log('Attempting to go to next step');
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      console.log('Current step index after increment:', this.currentStepIndex);
    }
  }


  get experiences(): FormArray {
    return this.experienceForm.get('experiences') as FormArray;
  }
  
  
  
  activeExperiencePanel: number | null = null;

setActivePanel(index: number | null) {
  if (this.activeExperiencePanel !== index) {
    if (this.activeExperiencePanel !== null && this.experiences.at(this.activeExperiencePanel)) {
      // Ascundem panoul anterior
      this.experiences.at(this.activeExperiencePanel)!.get('isHidden')!.setValue(true);
    }
    if (index !== null && this.experiences.at(index)) {
      // Arătăm panoul curent
      this.experiences.at(index)!.get('isHidden')!.setValue(false);
    }
    this.activeExperiencePanel = index;
  }
}


addExperience(): void {
  this.experiences.push(this.fb.group({
    jobTitle: ['', Validators.required],
    employer: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    city: ['', Validators.required],
    description: ['', Validators.required],
    isHidden: [false] // Noul panou va fi vizibil
  }));
  
  // Setăm panoul recent adăugat ca activ
  this.setActivePanel(this.experiences.length - 1);
}

removeExperience(index: number): void {
  this.experiences.removeAt(index);
  // Dacă panoul activ este șters, resetăm activePanel la null
  if (this.activeExperiencePanel === index) {
    this.setActivePanel(null);
  }
}

get educations(): FormArray {
  return this.educationForm.get('educations') as FormArray;
}

addEducation(): void {
  const educationGroup = this.fb.group({
    school: ['', Validators.required],
    degree: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    isHidden: [false] // Folosit pentru a controla vizibilitatea panoului
  });
  this.educations.push(educationGroup);
  // Opțional: Setează noul panou ca fiind cel activ
  this.setActiveEducationPanel(this.educations.length - 1);
}

removeEducation(index: number): void {
  this.educations.removeAt(index);
  // Dacă panoul activ este șters, resetează activeEducationPanel la null
  if (this.activeEducationPanel === index) {
    this.activeEducationPanel = null;
  }
}

// Ajustează metoda setActiveEducationPanel pentru a verifica că indexul nu este null
// înainte de a încerca să accesezi form group-ul din form array.
setActiveEducationPanel(index: number | null): void {
  // Close any previously open expansion panels
  if (this.activeEducationPanel !== null && this.activeEducationPanel !== index) {
    const currentActive = this.educations.at(this.activeEducationPanel);
    // Ensure that currentActive is not null
    if (currentActive) {
      const isHiddenControl = currentActive.get('isHidden');
      if (isHiddenControl) {
        isHiddenControl.setValue(true);
      }
    }
  }

  // Open the new expansion panel
  if (index !== null) {
    const activePanel = this.educations.at(index);
    // Ensure that activePanel is not null
    if (activePanel) {
      const isHiddenControl = activePanel.get('isHidden');
      if (isHiddenControl) {
        isHiddenControl.setValue(false);
      }
    }
  }
  
  this.activeEducationPanel = index;
}

addVolunteerExperience(): void {
  const group = this.fb.group({
    role: ['', Validators.required],
    organization: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    city: ['', Validators.required],
    description: ['', Validators.required]
  });
  this.volunteerExperiences.push(group);
}

removeVolunteerExperience(index: number): void {
  this.volunteerExperiences.removeAt(index);
}



get volunteerExperiences(): FormArray {
  return this.volunteeringForm.get('volunteerExperiences') as FormArray;
}

showSection(section: string): void {
  this.selectedSection = section;
  
}
addProjectExperience(): void {
  const projectGroup = this.fb.group({
      projectName: ['', Validators.required],
      technologiesUsed: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required]
  });
  this.projectExperiences.push(projectGroup);
}

removeProjectExperience(index: number): void {
  this.projectExperiences.removeAt(index);
}

get projectExperiences(): FormArray {
  return this.projectsForm.get('projectExperiences') as FormArray;
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


addCustomSection(): void {
  const customGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
  });
  this.customSections.push(customGroup);
}


removeCustomSection(index: number): void {
  this.customSections.removeAt(index);
}

get customSections(): FormArray {
  return this.customSectionForm.get('customSections') as FormArray;
}

buildResumeObject(): any {
  return {
    contactSection: this.resumeForm.value,
    customSections: this.customSections.value,
    educationSections: this.educationForm.value.educations,
    experienceSections: this.experienceForm.value.experiences,
    linkSections: this.linksForm.value.linkEntries,
    projectSections: this.projectsForm.value.projectExperiences,
    skillsSections: this.skillsForm.value.skills,
    volunteeringSections: this.volunteeringForm.value.volunteerExperiences,
    aboutSection: this.aboutForm.value
  };
}




selectResume(resumeId: string): void {
  this.saveCurrentResumeId(resumeId);
}

loadResumeData() {
  const token = localStorage.getItem('auth_token');
  if (token) {
    this.resumeService.getCurrentUserResume(token).subscribe({
      next: (resume: any) => {
        console.log('Loaded current user resume data:', resume); // Log pentru datele încărcate ale CV-ului
        this.populateForms(resume);
      },
      error: (error) => {
        console.error('Failed to load current user resume', error);
      }
    });
  }
}


populateForms(resume: any) {
  if (resume.contactSection) {
    this.resumeForm.patchValue(resume.contactSection);
  }
  if (resume.aboutSection) {
    this.aboutForm.patchValue(resume.aboutSection);
  }
  if (resume.educationSections) {
    this.educationForm.setControl('educations', this.fb.array(
      resume.educationSections.map((education: any) => this.fb.group({
        school: [education.school, Validators.required],
        degree: [education.degree, Validators.required],
        startDate: [education.startDate, Validators.required],
        endDate: [education.endDate, Validators.required]
      }))
    ));
  }
  if (resume.experienceSection) {
    this.experienceForm.setControl('experiences', this.fb.array(
      resume.experienceSection.map((experience: any) => this.fb.group({
        jobTitle: [experience.jobTitle, Validators.required],
        employer: [experience.employer, Validators.required],
        startDate: [experience.startDate, Validators.required],
        endDate: [experience.endDate, Validators.required],
        city: [experience.city, Validators.required],
        description: [experience.description, Validators.required]
      }))
    ));
  }
  if (resume.skillSection) {
    this.skillsForm.setControl('skills', this.fb.array(
      resume.skillSection.map((skill: any) => this.fb.group({
        skillName: [skill.skillName, Validators.required]
      }))
    ));
  }
  if (resume.volunteeringSection) {
    this.volunteeringForm.setControl('volunteerExperiences', this.fb.array(
      resume.volunteeringSection.map((volunteer: any) => this.fb.group({
        role: [volunteer.role, Validators.required],
        organization: [volunteer.organization, Validators.required],
        startDate: [volunteer.startDate, Validators.required],
        endDate: [volunteer.endDate, Validators.required],
        city: [volunteer.city, Validators.required],
        description: [volunteer.description, Validators.required]
      }))
    ));
  }
  if (resume.projectSection) {
    this.projectsForm.setControl('projectExperiences', this.fb.array(
      resume.projectSection.map((project: any) => this.fb.group({
        projectName: [project.projectName, Validators.required],
        technologiesUsed: [project.technologiesUsed, Validators.required],
        startDate: [project.startDate, Validators.required],
        endDate: [project.endDate, Validators.required],
        description: [project.description, Validators.required]
      }))
    ));
  }
  if (resume.linkSection) {
    this.linksForm.setControl('linkEntries', this.fb.array(
      resume.linkSection.map((link: any) => this.fb.group({
        label: [link.label, Validators.required],
        url: [link.url, [Validators.required, Validators.pattern('https?://.+')]]
      }))
    ));
  }
  if (resume.customSection) {
    this.customSectionForm.setControl('customSections', this.fb.array(
      resume.customSection.map((custom: any) => this.fb.group({
        title: [custom.title, Validators.required],
        description: [custom.description, Validators.required]
      }))
    ));
  }
}


onSaveResume(): void {
  const resumeData = this.buildResumeObject();
  console.log('Resume Data:', resumeData);
  const token = localStorage.getItem('auth_token');
  console.log(token); // Retrieve the JWT token from localStorage

  if (token) {
    this.resumeService.saveResume(token, resumeData).subscribe({
      next: (response: any) => {
        console.log('Resume saved successfully', response);
        alert('Resume saved successfully!');
        // Presupunem că backend-ul tău returnează obiectul salvat cu un ID.
        // Acest ID este salvat în localStorage pentru referințe viitoare.
        if (response && response.id) {
          localStorage.setItem('currentResumeId', response.id);
          console.log('Current resume ID saved:', response.id);
        }
      },
      error: (error: any) => {
        console.error('Failed to save resume', error);
        alert('Failed to save resume: ' + error.message);
      }
    });
  } else {
    console.error('Authentication token not found. Please log in.');
    alert('Please log in to save your resume.');
  }
}

onUpdateResume(): void {
  const resumeData = this.buildResumeObject(); // Construiește obiectul de date al CV-ului din formulare
  const resumeId = this.getCurrentResumeId(); // Preluarea ID-ului CV-ului din localStorage
  const token = localStorage.getItem('auth_token'); // Preluarea tokenului JWT din localStorage

  if (resumeId && token) {
    this.resumeService.updateResume(resumeId, token, resumeData).subscribe({
      next: (response) => {
        console.log('Resume updated successfully', response);
        alert('Resume updated successfully!');
      },
      error: (error) => {
        console.error('Failed to update resume', error);
        alert('Failed to update resume: ' + error.message);
      }
    });
  } else {
    if (!resumeId) {
      console.error('No resume ID found. Please select a resume to update.');
      alert('No resume ID found. Please select a resume to update.');
    }
    if (!token) {
      console.error('Authentication token not found. Please log in.');
      alert('Please log in to update your resume.');
    }
  }
}





// Other methods and logic for handling form data

updateContactData() {
  if (this.resumeForm.valid) {
    this.resumeData.contact = this.resumeForm.value;
    this.goToNextStep(); // Metodă pentru a naviga la următorul pas
  } else {
    alert('Please fill all required fields.');
  }
}
updateExperienceData() {
  if (this.experienceForm.valid) {
    this.resumeData.experience = this.experienceForm.value.experiences;
    this.goToNextStep();
  } else {
    alert('Please complete the experience details.');
  }
}
updateEducationData() {
  if (this.educationForm.valid) {
    this.resumeData.education = this.educationForm.value.educations;
    this.goToNextStep();
  } else {
    alert('Please complete the education details.');
  }
}
updateSkillsData() {
  if (this.skillsForm.valid) {
    this.resumeData.skills = this.skillsForm.value.skills;
    this.goToNextStep();
  } else {
    alert('Please add at least one skill.');
  }
}
updateAboutData() {
  if (this.aboutForm.valid) {
    this.resumeData.about = this.aboutForm.value.summary;
    this.goToNextStep();
  } else {
    alert('Please provide your professional summary.');
  }
}

updateVolunteeringData() {
  if (this.volunteeringForm.valid) {
    this.resumeData.volunteering = this.volunteeringForm.value.volunteerExperiences;
    this.goToNextStep();
  } else {
    alert('Please complete the volunteering section.');
  }
}
updateProjectsData() {
  if (this.projectsForm.valid) {
    this.resumeData.projects = this.projectsForm.value.projectExperiences;
    this.goToNextStep();
  } else {
    alert('Please complete the projects section.');
  }
}
updateLinksData() {
  if (this.linksForm.valid) {
    this.resumeData.links = this.linksForm.value.linkEntries;
    this.goToNextStep();
  } else {
    alert('Please add at least one link.');
  }
}

updateCustomSectionsData() {
  if (this.customSectionForm.valid) {
    this.resumeData.customSections = this.customSectionForm.value.customSections;
    this.goToNextStep();
  } else {
    alert('Please complete the custom sections.');
  }
}



// Salvarea ID-ului CV-ului în localStorage
saveCurrentResumeId(resumeId: string): void {
  localStorage.setItem('currentResumeId', resumeId);
}

// Recuperarea ID-ului CV-ului din localStorage
getCurrentResumeId(): string | null {
  return localStorage.getItem('currentResumeId');
}

downloadCV() {
    const element = document.getElementById('cv-template');

    const options = {
      margin: 1,
      filename: 'CV.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save();
  }


  previewCV() {
    this.isPreviewMode = true;
    document.body.classList.add('preview-active');
  }

  closePreview() {
    this.isPreviewMode = false;
    document.body.classList.remove('preview-active');
  }




openEmailModal() {
  this.isEmailModalOpen = true;
  document.body.classList.add('no-scroll'); // Adaugă clasa pentru a dezactiva derularea
}

closeEmailModal() {
  this.isEmailModalOpen = false;
  document.body.classList.remove('no-scroll'); // Elimină clasa pentru a reactiva derularea
}

sendEmail() {
  if (this.emailForm.valid) {
    const emailData = this.emailForm.value;
    // trimite emailul folosind un serviciu
    this.closeEmailModal();
  } else {
    alert('Please fill all required fields.');
  }
}

getSummaryData() {
  const status = this.resumeForm.get('status')?.value || '';
  const jobTitles = this.experienceForm.value.experiences.map((experience: { jobTitle: string }) => experience.jobTitle);
  const schools = this.educationForm.value.educations.map((education: { school: string }) => education.school);
  const skills = this.skillsForm.value.skills.map((skill: { skillName: string }) => skill.skillName);

  const summaryData = { status, jobTitles, schools, skills };
  return summaryData;
}

sendSummaryData() {
  const data = this.getSummaryData();
  this.summaryService.sendSummaryData(data).subscribe(
    response => console.log('Summary data sent successfully', response),
    error => console.error('Failed to send summary data', error)
  );
}






}
