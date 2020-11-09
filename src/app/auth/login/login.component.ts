import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private store: Store<AppState>) { }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
    }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
    });
  }

  loginUsuario(): void {
    if ( this.loginForm.invalid ) { return; }
    this.store.dispatch( ui.isLoading() );
    // this.loadingOpen();
    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password)
      .then( login => {
        console.log(login);
        // this.loadingClose();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/home']);
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
