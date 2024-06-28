import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectTemplateCvService } from 'src/app/services/select-template-cv.service';
import { ResumeService } from 'src/app/services/save-resume.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobSearchManuallyService } from 'src/app/services/job-search-manually.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-job-recommendation',
  templateUrl: './job-recommendation.component.html',
  styleUrls: ['./job-recommendation.component.scss']
})
export class JobRecommendationComponent implements OnInit {

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private jobSearchService: JobSearchManuallyService,
    private sanitizer: DomSanitizer,
    private templateService: SelectTemplateCvService,
    private resumeService: ResumeService
  ) {}

  keywords!: string;
  location!: string;
  resumes: any[] = []; // Initialize with your resumes data
  jobSearchForm!: FormGroup;
  jobs: any[] = [];
  currentIndex = 0;


  ngOnInit(): void {
    this.jobSearchForm = this.fb.group({
      keywords: [''],
      location: [ '']
    });

  this.clearJobsFromLocalStorage();
  this.loadResumes();

  }

  loadResumes() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.resumeService.getAllUserResumes(token).subscribe({
        next: (resumes) => {
          console.log('Resumes loaded:', resumes); // Afișează în consolă CV-urile încărcate
          this.resumes = resumes;
        },
        error: (error) => {
          console.error('Error loading resumes:', error);
        }
      });
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.resumes.length;
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.resumes.length) % this.resumes.length;
  }

  clearJobsFromLocalStorage(): void {
    localStorage.removeItem('jobs');
    localStorage.removeItem('location');
    localStorage.removeItem('keywords');
  }
  

  searchJobsManually(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const { keywords, location } = this.jobSearchForm.value;

    
   

      this.jobSearchService.searchJobs(keywords, location, token).subscribe({
        next: (response) => {
          console.log('Jobs found successfully', response);
          this.jobs = response.jobs;
          const jobsToStore = this.jobs.slice(0, 3);
         
       
        },
        error: (error) => {
          console.error('Failed to search jobs', error);
        }
      });
    } else {
      console.error('User not authenticated');
    }
  }

  sanitizeSnippet(snippet: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(snippet);
  }

  navigateToCreateResume(resume: any) {
    // Verifică datele originale ale CV-ului
  console.log('Resume:', resume);

  // Extrage informațiile relevante din CV
  const education = resume.educationSections.map((section: any) => {
    console.log('Education Section:', section);
    return `${section.degree || 'undefined'}, ${section.school || 'undefined'}`;
  }).join(', ');

  const experience = resume.experienceSections.map((section: any) => {
    console.log('Experience Section:', section);
    return `${section.jobTitle || 'undefined'}, ${section.employer || 'undefined'}`;
  }).join(', ');

  // Combină informațiile într-un string de keywords
  const keywords = `${education}, ${experience}`;
  console.log('Keywords:', keywords);

  this.jobSearchForm.patchValue({ keywords });
  this.searchJobsManually();


  }

  addKeyword(keyword: string): void {
    const currentKeywords = this.jobSearchForm.get('keywords')?.value;
    this.jobSearchForm.patchValue({ keywords: currentKeywords ? `${currentKeywords}, ${keyword}` : keyword });
  }
}
