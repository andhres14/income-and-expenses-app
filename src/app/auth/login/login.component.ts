import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiActions from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit, OnDestroy {
  authForm: FormGroup;
  #authService = inject(AuthService);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #store = inject(Store<AppState>);
  isLoading: boolean = false;
  uiSubscription: Subscription | undefined;

  constructor() {
    this.authForm = this.#fb.group({
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

  logIn() {
    if (!this.authForm.valid) { return; }

    this.#store.dispatch( uiActions.isLoading() )

    /*Swal.fire({
      title: "Espere por favor!",
      didOpen: () => {
        Swal.showLoading();
      }
    })*/

    const { correo, password } = this.authForm.value;
    this.#authService.logInUser(correo, password)
      .then( credentials => {
        console.log(credentials);
        //Swal.close();
        this.#store.dispatch( uiActions.stopLoading() );
        this.#router.navigate(['/']);
      })
      .catch( err => {
        console.log(err);
        this.#store.dispatch( uiActions.stopLoading() );
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: err.message
        // });
      });
  }
}
