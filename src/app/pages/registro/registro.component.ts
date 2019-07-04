import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;

  constructor(private auth: AuthService,
              private router: Router
    ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();

    
  }

  onSubmit( form : NgForm) {

    if( form.invalid) {return;}

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    
    this.auth.nuevoUsario(this.usuario)
        .subscribe(resp => {
          console.log(resp);
          Swal.close();
          this.router.navigateByUrl('/home');
          
        }, (err) => {
          Swal.fire({
            type: 'error',
            title: 'Error al autenticar',
            text: err.error.error.message
          });
        })
    
  }

}
