import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor( private authService: AuthService,
               private router: Router) {
  }
  canActivate(): Observable<boolean> {

    return this.authService.isAuth()
      .pipe(
        tap( estado => {
          if ( !estado ) { this.router.navigate(['/login']); }
        })
      );
  }

  canLoad(): Observable<boolean> {
    return this.authService.isAuth()
      .pipe(
        tap( estado => {
          if ( !estado ) { this.router.navigate(['/login']); }
        }),
        take(1)
      );
  }

}
