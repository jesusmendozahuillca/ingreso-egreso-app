import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  loginUsuario(): void {
    if ( this.loginForm.invalid ) { return; }
    this.loadingOpen();
    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password)
      .then( login => {
        console.log(login);
        this.loadingClose();
        this.router.navigate(['/home']);
      })
      .catch( err => {
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
