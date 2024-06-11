import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { map } from 'rxjs';
import { User } from '../models/user.model';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #auth = inject(Auth);
  firestore = inject(Firestore);

  initAuthListener() {
    this.#auth.onAuthStateChanged( user => {
      console.log(user?.email);
      console.log(user?.uid)
    })
  }

  /**
   * Check logged user
   */
  isAuth() {
    return authState(this.#auth).pipe( map( (fUser) => fUser !== null ));
  }
 
  createUser(userName: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.#auth, email, password)
      .then( ({ user }) => {
        const newUser = new User( user.uid, userName, email );
        const userRef = collection(this.firestore, `user`);

        return addDoc( userRef, { ...newUser });
      })
  }

  logInUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.#auth, email, password);
  }

  logOut() {
    return this.#auth.signOut();
  }
}
