import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
imports: [RouterOutlet];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'licenta';
  
}
