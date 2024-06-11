import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  #authService = inject(AuthService);
  #router = inject(Router);

  logOut() {
    this.#authService.logOut()
      .then(() => {
        this.#router.navigate(['/login']);
      });
  }
}
