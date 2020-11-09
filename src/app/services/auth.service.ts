import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {Usuario} from '../models/usuario.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubcription: Subscription;
  private _user: Usuario;

  get user(): Usuario {
    return this._user;
  }

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore,
               private store: Store<AppState>) { }

  initAuthListener(): void {

    this.auth.authState.subscribe( fuser => {
      if ( fuser ) {
        this.userSubcription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = Usuario.fromFirebase(firestoreUser);
            this._user = user;
            this.store.dispatch( authActions.setUser({ user }));
            this.store.dispatch( ingresoEgresoActions.unSetItems() );
          });
      } else {
        this._user = null;
        this.userSubcription?.unsubscribe();
        this.store.dispatch( authActions.unSetUser());
        this.store.dispatch( ingresoEgresoActions.unSetItems() );
      }
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
