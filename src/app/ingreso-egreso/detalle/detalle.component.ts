import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import {IngresoEgreso} from '../../models/ingreso-egreso.model';
import {Subscription} from 'rxjs';
import {IngresoEgresoService} from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[];
  ingresoSubs: Subscription;

  constructor( private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresoSubs = this.store.select('ingresosEgresos')
      .subscribe( ({items}) => this.ingresosEgresos = items );
  }

  ngOnDestroy(): void {
    this.ingresoSubs.unsubscribe();
  }

  borrar(uid: string): void {
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
      .then( () => Swal.fire('Borrado', 'Item borrado', 'success') )
      .catch( error => Swal.fire('Error', error.message, 'error') );
  }

}
