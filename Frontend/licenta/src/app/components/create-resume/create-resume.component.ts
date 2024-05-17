import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResumeDataService } from 'src/app/services/resume-data.service';
import { ResumeService } from 'src/app/services/save-resume.service';



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



  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService,
    private resumeService: ResumeService  

  ) {}

  ngOnInit() {
    this.initializeForms();
    this.addSkillLevelDescriptions();

    
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




}
