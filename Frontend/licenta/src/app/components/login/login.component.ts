import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor() { }

  // Adăugați această metodă în clasa LoginComponent
  onLogin(form: NgForm) {
    if (form.valid) {
      // Implementați logica de autentificare aici
      console.log(form.value); // Afișați valorile formularului în consolă pentru testare
      // De exemplu, trimiteți datele formularului către un serviciu de autentificare
    }
  }

}
