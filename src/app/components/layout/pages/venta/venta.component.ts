import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Producto } from '../../../../interfaces/producto';
import { DetalleVenta } from '../../../../interfaces/detalle-venta';
import { ProductoService } from '../../../../services/producto.service';
import { VentaService } from '../../../../services/venta.service';
import { UtilidadService } from '../../../../shared/utilidad.service';
import { Venta } from '../../../../interfaces/venta';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatGridListModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.scss',
})
export class VentaComponent {
  listaProducto: Producto[] = [];
  listaProductoFiltro: Producto[] = [];

  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearProductoRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  tipoPagoPorDefecto: string = 'Efectivo';
  totalPagar: number = 0;

  private _productoService = inject(ProductoService);
  private _ventaService = inject(VentaService);
  private _utilidadService = inject(UtilidadService);

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio','total', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado =
      typeof busqueda === 'string'
        ? busqueda.toLowerCase()
        : busqueda.nombre.toLowerCase();
    return this.listaProducto.filter((item) =>
      item.nombre.toLowerCase().includes(valorBuscado)
    );
  }

  constructor(private fb: FormBuilder) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
    });

    this._productoService.lista().subscribe({
      next: (data) => {
        const lista = data.value as Producto[];
        this.listaProducto = lista.filter(
          (p) => p.esActivo == 1 && p.stock > 0
        );
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.formularioProductoVenta
      .get('producto')
      ?.valueChanges.subscribe((value) => {
        this.listaProductoFiltro = this.retornarProductosPorFiltro(value);
      });
  }

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }
  agregarProductoParaVenta() {
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2)),
    });
    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductosParaVenta
    );
    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: '',
    });
  }

  eliminarProducto(detalle: DetalleVenta) {
    (this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto)),
      (this.listaProductosParaVenta = this.listaProductosParaVenta.filter(
        (p) => p.idProducto != detalle.idProducto
      ));
    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductosParaVenta
    );
  }

  registrarVenta() {
    if (this.listaProductosParaVenta.length > 0) {
      this.bloquearProductoRegistrar = true;
      const requet: Venta = {
        tipoPago: this.tipoPagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosParaVenta,
      };
      this._ventaService.guardar(requet).subscribe({
        next: (response) => {
          if (response.status) {
            (this.totalPagar = 0.0), (this.listaProductosParaVenta = []);
            this.datosDetalleVenta = new MatTableDataSource(
              this.listaProductosParaVenta
            );
            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!!!',
              text: `Numero de venta: ${response.value.numeroDocumento}`,
            });
          } else {
            this._utilidadService.mostrarAlerta(
              'No se pudo registrar la venta',
              'Error'
            );
          }
        },
        complete: () => {
          this.bloquearProductoRegistrar = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
