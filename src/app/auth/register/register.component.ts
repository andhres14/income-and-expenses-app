import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  #authService = inject(AuthService);
  #router = inject(Router);
  #fb = inject(FormBuilder);

  constructor() {

    this.registerForm = this.#fb.group({
      nombre: [ '', Validators.required ],
      correo: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', Validators.required ]
    })
  }

  ngOnInit(): void {

  }

  createAccount() {
    if (!this.registerForm.valid) { return; }

    Swal.fire({
      title: "Espere por favor!",
      didOpen: () => {
        Swal.showLoading();
      }
    })

    const { nombre, correo, password } = this.registerForm.value;
    this.#authService.createUser(nombre, correo, password)
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
