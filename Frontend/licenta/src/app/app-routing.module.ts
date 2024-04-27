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
  }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
