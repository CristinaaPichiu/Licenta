import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeDataService } from 'src/app/services/resume-data.service';


@Component({
  selector: 'app-create-resume',
  templateUrl: './create-resume.component.html',
  styleUrls: ['./create-resume.component.scss']
})
export class CreateResumeComponent implements OnInit {

  steps = ['Contact', 'Experience', 'Education', 'Skills', 'About', 'Finish it'];
  skillLevels = ['Novice', 'Beginner', 'Skillful', 'Experienced', 'Expert'];
  skillLevelDescriptions: string[] = [];

  currentStepIndex = 0; // Păstrează indexul etapei curente
  resumeForm!: FormGroup;
  experienceForm!: FormGroup;
  educationForm!: FormGroup;
  skillsForm!: FormGroup;
  aboutForm!: FormGroup;



  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService
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

  }

  initializeForms() {
    this.resumeForm = this.fb.group({
      firstName: [''],
      lastName: [''],
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
      name: ['', Validators.required],
      level: [0, Validators.required] 
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
  
  onSubmit() {
    const currentFormGroup = this.getCurrentFormGroup();
    if (currentFormGroup.valid) {
      this.goToNextStep();
    } else {
      console.log('Form is not valid.');
    }
  }
  
  goToNextStep() {
    // Mărește indexul pentru a trece la următoarea secțiune
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
  }
  
  // Funcție utilitară pentru a obține FormGroup-ul curent pe baza etapei
  getCurrentFormGroup(): FormGroup {
    switch (this.currentStep) {
      case 'Contact':
        return this.resumeForm;
      case 'Experience':
        return this.experienceForm;
      // adaugă cazuri pentru celelalte secțiuni...
      default:
        return this.resumeForm; // sau aruncă o eroare dacă etapa nu este cunoscută
    }
  }

  get experiences(): FormArray {
    return this.experienceForm.get('experiences') as FormArray;
  }
  
  addExperience(): void {
    const experienceGroup = this.fb.group({
      jobTitle: ['', Validators.required],
      employer: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      city: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.experiences.push(experienceGroup);
    this.emitResumeData();
  }
  
  removeExperience(index: number): void {
    this.experiences.removeAt(index);
    this.emitResumeData();
  }
  private emitResumeData() {
    this.resumeDataService.updateResumeForm({
      ...this.resumeDataService.getCurrentResumeSnapshot(),
      experiences: this.experiences.value // Asigură-te că folosești valoarea corectă aici
    });
  }

  get educations(): FormArray {
    return this.educationForm.get('educations') as FormArray;
  }
  
  addEducation(): void {
    const educationGroup = this.fb.group({
      school: [''],
      degree: [''],
      graduationDate: [''],
      city: [''],
      description: ['']
    });
    this.educations.push(educationGroup);
  }
  
  removeEducation(index: number): void {
    this.educations.removeAt(index);
  }
}
