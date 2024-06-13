import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ingresoEgresoApp';
  #authService = inject(AuthService);

  constructor() {
    this.#authService.initAuthListener();
  }

  ngOnInit(): void {
  }
}
