import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { map } from 'rxjs';
import { User, UserDataFirebase } from '../models/user.model';
import { Firestore, Unsubscribe, addDoc, collection, doc, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #auth = inject(Auth);
  #firestore = inject(Firestore);
  #store = inject(Store<AppState>);
  userUnSubscription!: Unsubscribe;

  initAuthListener() {
    authState(this.#auth).subscribe(async(user) => {
      console.log('Hola estoy pendiente de cambios');
      if (user) {
        console.log(user.uid);
        const userRef = collection(this.#firestore, 'user');
        console.log(userRef);
        const q = query(userRef, where('uid', "==", user.uid));
        //se usa onSnapshot para que llegado el caso que se actualice la información desde la base de datos directamente, se actualice inmediatamente en la app
        const querySnapshot = (await getDocs(q));
        querySnapshot.forEach((docData: any) => {
          //Como docData es de tipo DocumentSnapshot se puede obtener la información de esta usando el método .data()
          const docUserData = docData.data() as UserDataFirebase;
          //se setea el usuario para pasarlo al dispatch
          const newUser = User.fromFirebase(docUserData);
          console.log(newUser);
          //dispatch de la accion que setea el usuario
          this.#store.dispatch(authActions.setUser({ user: newUser }));
        })
        //se usa onSnapshot para que llegado el caso que se actualice la información desde la base de datos directamente, se actualice inmediatamente en la app
        //este metodo recibe dos argumentos, el path donde esta nuestro documento y un callback que tendrá la información que queremos
 
        /*this.userUnSubscription = onSnapshot(
          //acceder al documento de firebase pasando como argumento la base de datos y el path del documento
          doc(this.#firestore, `${user.uid}/user`),
 
          //docData es la promesa que nos devuelve en el callback con la información perse del usuario
          (docData) => {
            console.log(docData.data())
            //Como docData es de tipo DocumentSnapshot se puede obtener la información de esta usando el método .data()
            const docUserData = docData.data() as UserDataFirebase;
 
            //se setea el usuario para pasarlo al dispatch
            const newUser = User.fromFirebase(docUserData);
 
            //dispatch de la accion que setea el usuario
            this.#store.dispatch(authActions.setUser({ user: newUser }));
          }, (err) => {
            console.log(err);
          }
        );*/
      } else {
        //Aquí se cancela la suscripción al onSnapshot
        //Se hace de esta forma porque el onSnapshot retorna una function que puede ser llamada para cancelar la suscripcion tal como indica la documentación
        //@returns
        //An unsubscribe function that can be called to cancel the snapshot listener.
        
        //Por lo anterior estamos preguntando si en la suscripción hay data, y si la hay ejecute la desuscripción a partir del retorno de la misma
        //Por ello se ejecuta this.userUnSubscription() como si fuera un método
        console.log('Hola me desuscribo');
        this.userUnSubscription ? this.userUnSubscription() : null
        this.#store.dispatch(authActions.unSetUser());
      }
    });
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
        const userRef = collection(this.#firestore, `user`);

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
