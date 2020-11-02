import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Usuario} from '../models/usuario.model';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore) { }

  initAuthListener(): void {

    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
    });
  }

  crearUsuario( nombre: string, email: string, password: string ): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser } ).then(() => {
          console.log('user create');
          }
        );
      });
  }

  loginUsuario( email: string, password: string ): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<any> {
    return this.auth.signOut();
  }

  isAuth(): Observable<boolean> {
    return this.auth.authState.pipe( map( fUser => fUser != null) );

  }

}
