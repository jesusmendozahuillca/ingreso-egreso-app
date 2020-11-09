import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducer';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {IngresoEgresoService} from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubcription: Subscription;
  ingresosSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnDestroy(): void {
        this.userSubcription?.unsubscribe();
        this.ingresosSubscription?.unsubscribe();
    }

  ngOnInit(): void {
    this.userSubcription = this.store.select('user')
      .pipe(
        filter( auth => auth.user != null )
      )
      .subscribe( ({user}) => {
        console.log(user);
        this.ingresosSubscription = this.ingresoEgresoService.initIngresoEgresoListener(user.uid)
          .subscribe( ingresoEgresoFB => {
            this.store.dispatch( ingresoEgresoActions.setItems({ items: ingresoEgresoFB}))
          });
      });
  }

}
