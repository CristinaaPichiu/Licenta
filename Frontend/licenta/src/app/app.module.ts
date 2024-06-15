import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { ProgressChartComponent } from './components/progress-chart/progress-chart.component';
import { CreateCoverletterComponent } from './components/create-coverletter/create-coverletter.component';
import { CoverLetterTemplateComponent } from './components/cover-letter-template/cover-letter-template.component';
import { CoverLetterFormComponent } from './components/cover-letter-form/cover-letter-form.component';
import { CoverLetterDataService } from './services/cover-letter-data.service'; // Asigură-te că calea este corectă
import { SignatureModule } from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { SecondTemplateCvComponent } from './components/second-template-cv/second-template-cv.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThirdTemplateComponent } from './components/third-template/third-template.component';
import { SelectTemplateResumeComponent } from './components/select-template-resume/select-template-resume.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DashboardFirstTemplateComponent } from './components/dashboard-first-template/dashboard-first-template.component';
import { DashboardSecondTemplateComponent } from './components/dashboard-second-template/dashboard-second-template.component';
import { DashboardThirdTemplateComponent } from './components/dashboard-third-template/dashboard-third-template.component';
import { CoverLetterSecondTemplateComponent } from './components/cover-letter-second-template/cover-letter-second-template.component';
import { CoverLetterThirdTemplateComponent } from './components/cover-letter-third-template/cover-letter-third-template.component';
import { SelectTemplateCoverLetterComponent } from './components/select-template-cover-letter/select-template-cover-letter.component';
import { DashboardLetterFirstComponent } from './components/dashboard-letter-first/dashboard-letter-first.component';
import { DashboardLetterSecondComponent } from './components/dashboard-letter-second/dashboard-letter-second.component';
import { DashboardLetterThirdComponent } from './components/dashboard-letter-third/dashboard-letter-third.component';
import { UploadResumeComponent } from './components/upload-resume/upload-resume.component';
import { JobBoardComponent } from './components/job-board/job-board.component';
import { JobColumnComponent } from './components/job-column/job-column.component';
import { JobCardComponent } from './components/job-card/job-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { JobDetailsComponent } from './components/job-details/job-details.component';







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
    CreateResumeComponent,
    ProgressChartComponent,
    CreateCoverletterComponent,
    CoverLetterTemplateComponent,
    CoverLetterFormComponent,
    SecondTemplateCvComponent,
    LoadingDialogComponent,
    ThirdTemplateComponent,
    SelectTemplateResumeComponent,
    DashboardFirstTemplateComponent,
    DashboardSecondTemplateComponent,
    DashboardThirdTemplateComponent,
    CoverLetterSecondTemplateComponent,
    CoverLetterThirdTemplateComponent,
    SelectTemplateCoverLetterComponent,
    DashboardLetterFirstComponent,
    DashboardLetterSecondComponent,
    DashboardLetterThirdComponent,
    UploadResumeComponent,
    JobBoardComponent,
    JobColumnComponent,
    JobCardComponent,
    JobDetailsComponent    
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
    MatSliderModule,
    MatExpansionModule,
    SignatureModule,
    ToolbarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    DragDropModule
  ],
  providers: [ResumeDataService],
  bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]


})
export class AppModule { }
