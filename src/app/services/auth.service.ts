import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from './../models/usuario.model';
import {map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private apikey = 'AIzaSyCFAYtw6xYEYVbdIIZPzGy6ayL-8WPA5Mk'

  userToken: string;

  constructor(private http: HttpClient) { 

    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`
    ${this.url}/verifyPassword?key=${this.apikey}`, authData)
    .pipe(map(resp => {
      console.log('entro en el map de RXJS');
      this.guardarToken(resp['idToken'])
      return resp;
    }))

  }

  nuevoUsario(usuario: UsuarioModel) {

    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`
    ${this.url}/signupNewUser?key=${this.apikey}`, authData)
      .pipe(map(resp => {
        console.log('entro en el map de RXJS');
        this.guardarToken(resp['idToken'])
        return resp;
      }))
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken)
  
  let hoy = new Date();
  hoy.setSeconds(3600);

  localStorage.setItem('expira', hoy.getTime().toString())

  }

  leerToken() {
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token')
    }else {
      this.userToken = '';
    }
    return this.userToken;
  }


  estaAutenticado(): boolean {

    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'))
    const expiracion = new Date()
    expiracion.setTime(expira);

    if( expiracion > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
