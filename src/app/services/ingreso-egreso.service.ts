import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {IngresoEgreso} from '../models/ingreso-egreso.model';
import {AuthService} from './auth.service';
import {jsonDeserialize} from '../models/deserialize';
import 'firebase/firestore';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService ) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso): Promise<any> {
    console.log(ingresoEgreso);
    const uid = this.authService.user.uid;
    console.log(uid);
    return this.firestore.doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add(jsonDeserialize(ingresoEgreso));

    // return this.firestore.collection('ingresos-egresos').add(jsonDeserialize(ingresoEgreso));
  }

  initIngresoEgresoListener(uid: string): Observable<any> {
    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( snapshot => snapshot.map( doc => ({
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data() as any
            })
          )
        )
      );
  }

  borrarIngresoEgreso( uidItem: string ): Promise<void> {
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }

}
