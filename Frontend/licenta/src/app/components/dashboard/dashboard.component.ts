import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService } from 'src/app/services/save-resume.service';
import { SaveCoverLetterService } from 'src/app/services/save-cover-letter.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  resumes: any[] = []; // Aici stocăm CV-urile
  letters: any[] = [];
  loading = true; // Stare pentru încărcare
  constructor(private router: Router, private resumeService: ResumeService, private coverLetterService:SaveCoverLetterService) { }

  ngOnInit() {
    this.loadLetters(),
    this.loadResumes()

  }



  loadResumes() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.resumeService.getAllUserResumes(token).subscribe({
        next: (resumes) => {
          console.log('Resumes loaded:', resumes); // Afișează în consolă CV-urile încărcate
          this.resumes = resumes;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading resumes:', error);
          this.loading = false;
        }
      });
    }
  }

  loadLetters() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.coverLetterService.getAllCoverLetters(token).subscribe({
        next: (letters) => {
          console.log('Resumes loaded:', letters); // Afișează în consolă CV-urile încărcate
          this.letters = letters;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading resumes:', error);
          this.loading = false;
        }
      });
    }
  }
  

}
