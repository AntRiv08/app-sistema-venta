import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UtilidadService } from '../../shared/utilidad.service';
import { Login } from '../../interfaces/login';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  // private fb = inject(FormBuilder);
  private router = inject(Router);
  private _usuarioService = inject(UsuarioService);
  private _utilidadService = inject(UtilidadService);
  constructor(private fb: FormBuilder) {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  iniciarSesion() {
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formLogin.value.email,
      clave: this.formLogin.value.password,
    };
    this._usuarioService.iniciarSesion(request).subscribe({
      next: (data) => {
        if (data.status) {
          this._utilidadService.guardarSesionUsuario(data.value);
          this, this.router.navigate(['pages']);
        } else {
          this._utilidadService.mostrarAlerta(
            'No se encontraron coincidencias',
            'error'
          );
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: () => {
        this._utilidadService.mostrarAlerta('hubo un error', 'error');
      },
    });
  }
}
