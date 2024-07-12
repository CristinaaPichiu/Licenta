import { Component, OnInit,  OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SelectTemplateCvService } from 'src/app/services/select-template-cv.service';
import { ResumeService } from 'src/app/services/save-resume.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobSearchManuallyService } from 'src/app/services/job-search-manually.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { JobRecommendation } from 'src/app/models/job_recommendation.model';
import { MatDialog } from '@angular/material/dialog';
import { JobDialogComponent } from '../job-dialog/job-dialog.component';



@Component({
  selector: 'app-job-recommendation',
  templateUrl: './job-recommendation.component.html',
  styleUrls: ['./job-recommendation.component.scss']
})
export class JobRecommendationComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    public jobSearchService: JobSearchManuallyService,
    private sanitizer: DomSanitizer,
    private templateService: SelectTemplateCvService,
    private resumeService: ResumeService,
    public dialog: MatDialog
  ) {}

  keywords!: string;
  location!: string;
  resumes: any[] = []; 
  jobSearchForm!: FormGroup;
  jobs: any[] = [];
  jobsByResume: any[] = [];
  private subscriptions: Subscription = new Subscription();

  currentIndex = 0;
  currentPage: number = 1;
  pageSize: number = 10;  // Numărul de joburi pe pagină
  totalJobs: number = 0;  // Totalul joburilor disponibile (opțional, depinde de API)



  ngOnInit(): void {
    this.jobSearchService.jobs = [];
    this.jobSearchService.jobsByResume = [];   
    this.jobSearchForm = this.fb.group({
      keywords: [''],
      location: [ '']
    });

    

  this.clearJobsFromLocalStorage();
  this.loadResumes();

  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.jobSearchService.jobs = [];
    this.jobSearchService.jobsByResume = [];
  }

  loadResumes() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.resumeService.getAllUserResumes(token).subscribe({
        next: (resumes) => {
          console.log('Resumes loaded:', resumes); 
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
    if (!token) {
        console.error('User not authenticated');
        return;
    }
    
    const { keywords, location } = this.jobSearchForm.value;
    this.jobSearchService.searchJobs(keywords, location, this.currentPage, this.pageSize, token).subscribe({
        next: (response) => {
            this.totalJobs = response.totalCount;
            console.log('Jobs:', this.jobSearchService.jobs); // Verifică dacă jobs conține date
        },
        error: (error) => {
            console.error('Failed to search jobs', error);
        }
    });
  }

  
  

trackByJobId(index: number, job: any): any {
  return job.id; // presupunem că fiecare job are un ID unic
}




  goToNextPage(): void {
    if (this.currentPage * this.pageSize < this.totalJobs) {
      this.currentPage++;
      this.searchJobsManually();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchJobsManually();
    }
  }
  
  sanitizeSnippet(snippet: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(snippet); 
  }
  

  navigateToCreateResume(resume: any) {
    console.log('Resume:', resume);
  
    const experience = resume.experienceSections.map((section: any) => {
        console.log('Experience Section:', section);
        return `${section.jobTitle || 'undefined'}, ${section.employer || 'undefined'}`;
    }).join(', ');
  
    const keywords = `${experience}`;
    console.log('Keywords:', keywords);
  
    this.searchJobsManuallyForResume('Italy', ''); // Utilizează location din CV dacă există
  }
  

searchJobsManuallyForResume(keywords: string, location: string): void {
  const token = localStorage.getItem('auth_token');
  if (!token) {
      console.error('User not authenticated');
      return;
  }

  console.log('Searching jobs for resume with keywords:', keywords, 'and location:', location);
  
  this.jobSearchService.searchJobsByResume(keywords, location, this.currentPage, this.pageSize, token).subscribe({
      next: (response) => {
          this.totalJobs = response.totalCount;
          console.log('Jobs by resume:', this.jobSearchService.jobsByResume); // Verifică dacă jobsByResume conține date
          this.jobsByResume = this.jobSearchService.jobsByResume; // Asigură-te că jobsByResume este actualizat și în componentă
      },
      error: (error) => {
          console.error('Failed to search jobs by resume', error);
      }
  });
}



  

  addKeyword(keyword: string): void {
    const currentKeywords = this.jobSearchForm.get('keywords')?.value;
    this.jobSearchForm.patchValue({ keywords: currentKeywords ? `${currentKeywords}, ${keyword}` : keyword });
  }

  onTabChange(event: any): void {
    if (event.index === 1) { // Indexul tab-ului pentru "Search Jobs by Resumes"
      this.jobSearchService.jobsByResume = [];
    } else {
      this.jobSearchService.jobs = [];
    }
  }
  openDialog(job: any): void {
    this.dialog.open(JobDialogComponent, {
      width: '50%', // Lățimea ca procent din lățimea viewport-ului
      height: '60%', // Înălțimea ca procent din înălțimea viewport-ului
      data: job
    });
  }
  
  
  

}

