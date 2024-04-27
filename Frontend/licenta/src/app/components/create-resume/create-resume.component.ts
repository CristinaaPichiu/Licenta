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

    this.initializeForms();

    this.resumeForm.valueChanges.subscribe(values => {
      this.resumeDataService.updateResumeForm(this.resumeForm);
    });

  }

  initializeForms() {
    this.resumeForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      address: [''],
      city: [''],
      postalCode: [''],
      phone: [''], // exemplu de pattern pentru telefon
      email: ['']
    });
    this.experienceForm = this.fb.group({
      experiences: this.fb.array([])
    });
    this.educationForm = this.fb.group({
      educations: this.fb.array([])
    });
    // Adaugă o educație inițială pentru a începe
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
      this.skillLevelDescriptions[index] = this.skillLevels[0]; // Default to 'Novice'
    });
  }

  // This function will be called when a skill level is clicked
  selectSkillLevel(skillIndex: number, levelIndex: number): void {
    const levelControl = this.skills.at(skillIndex).get('level');
    if (levelControl) {
      levelControl.setValue(levelIndex + 1); // Set the level based on the index (1-5)
      this.skillLevelDescriptions[skillIndex] = this.skillLevels[levelIndex];
    }
  }


  createSkillFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      level: [0, Validators.required] // Adjust the form control according to your skill level input
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
      this.resumeDataService.updateResumeForm(currentFormGroup); // actualizarea datelor în serviciu
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
      jobTitle: [''],
      employer: [''],
      startDate: [''],
      endDate: [''],
      city: [''],
      description: ['']
    });
    this.experiences.push(experienceGroup);
  }
  
  removeExperience(index: number): void {
    this.experiences.removeAt(index);
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
