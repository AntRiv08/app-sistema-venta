import {
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
  inject,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import Swal from 'sweetalert2';
import { Usuario } from '../../../../interfaces/usuario';
import { UsuarioService } from '../../../../services/usuario.service';
import { UtilidadService } from '../../../../shared/utilidad.service';
import { ModalUsuarioComponent } from '../../modals/modal-usuario/modal-usuario.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = [
    'nombreCompleto',
    'correo',
    'rolDescripcion',
    'estado',
    'acciones',
  ];
  dataInicio: Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  private dialog = inject(MatDialog);
  private _usuarioService = inject(UsuarioService);
  private _utilidadService = inject(UtilidadService);

  obtenerUsuarios() {
    this._usuarioService.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaUsuarios.data = data.value;
        } else {
          this._utilidadService.mostrarAlerta(
            'No se encontraron datos',
            'Error'
          );
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase();
  }

  nuevoUsuario() {
    this.dialog
      .open(ModalUsuarioComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'true') this.obtenerUsuarios();
      });
  }
  editarUsuario(usuario: Usuario) {
    this.dialog
      .open(ModalUsuarioComponent, {
        disableClose: true,
        data: usuario,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'true') this.obtenerUsuarios();
      });
  }
  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: 'Desea eliminar el usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver',
    }).then((res) => {
      if (res.isConfirmed) {
        this._usuarioService.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadService.mostrarAlerta(
                'El usuario fue eliminado',
                'Exito!!!'
              );
              this.obtenerUsuarios();
            } else {
              this._utilidadService.mostrarAlerta(
                'No se pudo eliminar el usuario',
                'Error...'
              );
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }
  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }
}
