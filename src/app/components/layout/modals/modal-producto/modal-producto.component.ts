import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Categoria } from '../../../../interfaces/categoria';
import { Producto } from '../../../../interfaces/producto';
import { CategoriaService } from '../../../../services/categoria.service';
import { ProductoService } from '../../../../services/producto.service';
import { UtilidadService } from '../../../../shared/utilidad.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.scss',
})
export class ModalProductoComponent implements OnInit {
  formularioProducto: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaCategorias: Categoria[] = [];

  private _categoriaService = inject(CategoriaService);
  private _productoService = inject(ProductoService);
  private _utilidadService = inject(UtilidadService);

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder
  ) {
    this.formularioProducto = fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });
    if (this.datosProducto != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
    this._categoriaService.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategorias = data.value;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString(),
      });
    }
  }

  guardarEditarProducto() {
    const _producto: Producto = {
      idProducto:
        this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCatergoria: '',
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo),
    };
    if (this.datosProducto == null) {
      this._productoService.guardar(_producto).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadService.mostrarAlerta(
              'El producto fue registrado',
              'Exito'
            );
            this.modalActual.close('true');
          } else {
            this._utilidadService.mostrarAlerta(
              'No se pudo registrar el producto',
              'Error'
            );
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      this._productoService.editar(_producto).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadService.mostrarAlerta(
              'El producto fue editado',
              'Exito'
            );
            this.modalActual.close('true');
          } else {
            this._utilidadService.mostrarAlerta(
              'No se pudo editar el producto',
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
