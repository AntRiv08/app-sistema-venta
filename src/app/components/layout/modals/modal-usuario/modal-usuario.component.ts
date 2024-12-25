import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Rol } from '../../../../interfaces/rol';
import { Usuario } from '../../../../interfaces/usuario';
import { RolService } from '../../../../services/rol.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { UtilidadService } from '../../../../shared/utilidad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.scss',
})
export class ModalUsuarioComponent implements OnInit {
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaRoles: Rol[] = [];

  private _rolService = inject(RolService);
  private _usuarioService = inject(UsuarioService);
  private _utilidadService = inject(UtilidadService);
  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder
  ) {
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', Validators.required],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });
    if (this.datosUsuario != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
    this._rolService.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaRoles = data.value;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  ngOnInit(): void {
    if (this.datosUsuario != null) {
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString(),
      });
    }
  }
  guardarEditarUsuario() {
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: parseInt(this.formularioUsuario.value.idRol),
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
    };
    if (this.datosUsuario == null) {
      this._usuarioService.guardar(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadService.mostrarAlerta(
              'El usuario fue registrado',
              'Exito'
            );
            this.modalActual.close('true');
          } else {
            this._utilidadService.mostrarAlerta(
              'No se pudo registrar el usuario',
              'Error'
            );
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      this._usuarioService.editar(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadService.mostrarAlerta(
              'El usuario fue editado',
              'Exito'
            );
            this.modalActual.close('true');
          } else {
            this._utilidadService.mostrarAlerta(
              'No se pudo editar el usuario',
              'Error'
            );
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
