import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResumeDataService } from 'src/app/services/resume-data.service';

@Component({
  selector: 'app-template-cv',
  templateUrl: './template-cv.component.html',
  styleUrls: ['./template-cv.component.scss']
})
export class TemplateCVComponent  {
  resume = {
    header: {
      name: 'Jhon Doe',
      title: 'Accountant'
    },
    contact: {
      phone: '777 777 77',
      email: 'lorem@ipsum',
      address: 'New York, USA',
      linkedin: 'in/loremipsum',
      skype: 'loremipsum'
    },
    skills: [
      { name: 'Accounting', years: '4 years' },
      { name: 'Word', years: '3 years'},
      { name: 'PowePoint', years: '3 years'},
      { name: 'Marketing', years: '3 years'},
      { name: 'Photoshop', years: '2 years'},
      { name: 'French', years: '2 years'},
      { name: 'English', years: '5 years'},
      { name: 'Management', years: '1 years'},





      
      // Add other skills...
    ],
    education: {
      degree: 'Bachelor of Economics',
      school: 'The University of Sydney',
      period: '2010 - 2014'
    },
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat velit quis auctor facilisis. Mauris egestas nibh a ultricies tincidunt. Suspendisse malesuada eros non fermentum facilisis. Maecenas efficitur mollis justo, eu facilisis risus condimentum ut. Nullam nec sem vitae dolor porta volutpat. Maecenas a nisi finibus, gravida ligula ut, dignissim turpis.',
    experience: [
      {
        position: 'Accountant',
        period: 'Jun 2014 - Sept 2015',
        companyName: 'Accounting project name | Company name',
        description: 'Quisque rutrum mollis ornare. In pharetra diam libero, non interdum dui imperdiet quis. Quisque aliquam sapien in libero finibus sodales. Mauris id commodo metus. In in laoreet dolor.',
        bullets: [
          'Integer commodo ullamcorper mauris, id condimentum lorem elementum sed.'
        ],
        skills: ['Accounting', 'Word', 'Powerpoint']
      },
      {
        position: 'Digital Marketing Expert',
        period: 'Nov 2020 - Sept 2021',
        companyName: 'Project name | Company name',
        description: 'Morbi rhoncus, tortor vel luctus tincidunt, sapien lacus vehicula augue, vitae ultrices eros diam eget mauris. Aliquam dictum nulla vel augue tristique bibendum.',
        bullets: [
          'Phasellus ac accumsan ligula. Morbi quam massa, pellentesque nec nunc nec, consectetur gravida dolor.',
          'Mauris vulputate sagittis pellentesque. Donec luctus lorem luctus purus condimentum, id ultrices lacus aliquam.'
        ],
        skills: ['Writing', 'Photoshop']
      }
    ]
  };
}
