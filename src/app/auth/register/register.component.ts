import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import {Subscription} from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private store: Store<AppState>) {
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre:   [ '', [Validators.required] ],
      correo:   [ '', [Validators.required, Validators.email] ],
      password: [ '', [Validators.required] ],
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
      console.log('subs cargando');
    });

  }

  crearUsuario(): void {
    if ( this.registroForm.invalid ) { return; }
    this.store.dispatch( ui.isLoading() );
    // this.loadingOpen();
    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario( nombre, correo, password )
      .then( credenciales => {
        console.log(credenciales);
        // this.loadingClose();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
        this.error(err);
      });
  }

  loadingOpen(): void {
    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    });
  }

  loadingClose(): void {
    Swal.close();
  }

  error(err: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message
    });
  }
}
