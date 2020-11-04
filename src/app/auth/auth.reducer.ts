import {createAction, createReducer, on} from '@ngrx/store';
import {setUser, unSetUser} from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
  user: Usuario;
}

export const initialstate: State = {
  user: null,
};

const _authReducer = createReducer(initialstate,
  on( setUser, (state, { user }) => ({...state, user: {...user} })),
  on( unSetUser, state => ({...state, user: null })),
  );

export function authReducer(state, action) {
  return _authReducer(state, action);
}
