import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router) {
  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre:   [ '', [Validators.required] ],
      correo:   [ '', [Validators.required, Validators.email] ],
      password: [ '', [Validators.required] ],
    });
  }

  crearUsuario(): void {
    if ( this.registroForm.invalid ) { return; }
    this.loadingOpen();
    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario( nombre, correo, password )
      .then( credenciales => {
        console.log(credenciales);
        this.loadingClose();
        this.router.navigate(['/']);
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
