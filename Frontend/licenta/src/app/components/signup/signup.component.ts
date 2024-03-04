import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  onRegister(form: NgForm) {
    if (form.valid) {
      // Implementați logica de autentificare aici
      console.log(form.value); // Afișați valorile formularului în consolă pentru testare
      // De exemplu, trimiteți datele formularului către un serviciu de autentificare
    }
  }

}
