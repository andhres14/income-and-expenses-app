import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as uiActions from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  #authService = inject(AuthService);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  
  #store = inject(Store<AppState>);
  isLoading: boolean = false;
  uiSubscription: Subscription | undefined;

  constructor() {

    this.registerForm = this.#fb.group({
      nombre: [ '', Validators.required ],
      correo: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', Validators.required ]
    })
  }

  ngOnInit(): void {
    this.uiSubscription = this.#store.select('ui').subscribe( ui => this.isLoading = ui.isLoading )
  }

  ngOnDestroy(): void {
    if (this.uiSubscription) {
      this.uiSubscription.unsubscribe();
    }
  }

  createAccount() {
    if (!this.registerForm.valid) { return; }

    this.#store.dispatch( uiActions.isLoading() );
    // Swal.fire({
    //   title: "Espere por favor!",
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // })

    const { nombre, correo, password } = this.registerForm.value;
    this.#authService.createUser(nombre, correo, password)
      .then( credentials => {
        this.#store.dispatch( uiActions.stopLoading() );
        //Swal.close();
        this.#router.navigate(['/']);
      })
      .catch( err => {
        console.log(err);
        this.#store.dispatch( uiActions.stopLoading() );
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message
        });
      });
  }
}
