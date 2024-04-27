import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './components/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SettingsComponent } from './components/settings/settings.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TemplateCVComponent } from './components/template-cv/template-cv.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ResumeComponent } from './components/resume/resume.component';
import { CreateResumeComponent } from './components/create-resume/create-resume.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ResumeDataService } from './services/resume-data.service';








@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    WelcomeComponent,
    SidebarComponent,
    SettingsComponent,
    ProfileCardComponent,
    TemplateCVComponent,
    ProjectsComponent,
    ResumeComponent,
    CreateResumeComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule, BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    MatInputModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatSelectModule, 
    MatSliderModule

    
  ],
  providers: [ResumeDataService],
  bootstrap: [AppComponent],

})
export class AppModule { }
