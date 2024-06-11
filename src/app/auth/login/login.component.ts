import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  authForm: FormGroup;
  #authService = inject(AuthService);
  #router = inject(Router);
  #fb = inject(FormBuilder);

  constructor() {
    this.authForm = this.#fb.group({
      correo: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', Validators.required ]
    })
  }

  logIn() {
    if (!this.authForm.valid) { return; }

    Swal.fire({
      title: "Espere por favor!",
      didOpen: () => {
        Swal.showLoading();
      }
    })

    const { correo, password } = this.authForm.value;
    this.#authService.logInUser(correo, password)
      .then( credentials => {
        console.log(credentials);
        Swal.close();
        this.#router.navigate(['/']);
      })
      .catch( err => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message
        });
      });
  }
}
