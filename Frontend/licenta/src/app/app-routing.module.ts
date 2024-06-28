import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ResumeComponent } from './components/resume/resume.component';
import { CreateResumeComponent } from './components/create-resume/create-resume.component';
import { CreateCoverletterComponent } from './components/create-coverletter/create-coverletter.component';
import { CoverLetterFormComponent } from './components/cover-letter-form/cover-letter-form.component';
import { SelectTemplateResumeComponent } from './components/select-template-resume/select-template-resume.component';
import { SelectTemplateCoverLetterComponent } from './components/select-template-cover-letter/select-template-cover-letter.component';
import { UploadResumeComponent } from './components/upload-resume/upload-resume.component';
import { JobBoardComponent } from './components/job-board/job-board.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobRecommendationComponent } from './components/job-recommendation/job-recommendation.component';

const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'signup',
    component: SignupComponent
  },
  {
    path:'dashboard',
    component: DashboardComponent
  },
  {
    path:'welcome',
    component: WelcomeComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'profile-card',
    component: ProfileCardComponent
  }, 
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'resume',
    component: ResumeComponent
  },
  {
    path: 'create-resume',
    component: CreateResumeComponent
  },
  {
    path: 'create-coverletter',
    component: CreateCoverletterComponent
  },
  {
    path: 'cover-letter-form',
    component: CoverLetterFormComponent
  },

  {
    path: 'select-template-resume',
    component: SelectTemplateResumeComponent
  },
  
  {
    path: 'select-template-cover-letter',
    component: SelectTemplateCoverLetterComponent
  },
  {
    path: 'upload-resume',
    component: UploadResumeComponent
  },
  {
    path: 'job-board',
    component: JobBoardComponent
  },
  {
    path: 'job-details',
    component: JobDetailsComponent
  }
  ,
  {
    path: 'job-recommendations',
    component: JobRecommendationComponent
  }






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
