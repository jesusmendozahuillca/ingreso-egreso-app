import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IngresoEgreso} from '../models/ingreso-egreso.model';
import {IngresoEgresoService} from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducer';
import * as ui from '../shared/ui.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubscription: Subscription;

  constructor(private  fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>) { }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading );
    /** Desestructuracion */
    this.loadingSubscription = this.store.select('ui').subscribe( ({isLoading}) => this.cargando = isLoading );
    this.ingresoForm = this.fb.group({
      descripcion:  ['', [Validators.required]],
      monto:        ['', [Validators.required]]
    });
  }

  guardar(): void {
    if ( this.ingresoForm.invalid ) { return; }
    this.store.dispatch( ui.isLoading() );

    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then( () => {
        this.ingresoForm.reset();
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Registro Creado', descripcion, 'success');
      })
      .catch( error => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Error', error.message, 'error');
      });
  }


}
