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
import { Producto } from '../../../../interfaces/producto';
import { ProductoService } from '../../../../services/producto.service';
import { UtilidadService } from '../../../../shared/utilidad.service';
import { ModalProductoComponent } from '../../modals/modal-producto/modal-producto.component';
@Component({
  selector: 'app-producto',
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
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss',
})
export class ProductoComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = [
    'nombre',
    'categoria',
    'stock',
    'precio',
    'estado',
    'acciones',
  ];
  dataInicio: Producto[] = [];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  private dialog = inject(MatDialog);
  private _productoService = inject(ProductoService);
  private _utilidadService = inject(UtilidadService);

  obtenerProductos() {
    this._productoService.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaProductos.data = data.value;
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
    this.dataListaProductos.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  nuevoProducto() {
    this.dialog
      .open(ModalProductoComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'true') this.obtenerProductos();
      });
  }

  editarProducto(producto: Producto) {
    this.dialog
      .open(ModalProductoComponent, {
        disableClose: true,
        data: producto,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'true') this.obtenerProductos();
      });
  }

  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: 'Desea eliminar el producto?',
      text: producto.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver',
    }).then((res) => {
      if (res.isConfirmed) {
        this._productoService.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadService.mostrarAlerta(
                'El producto fue eliminado',
                'Exito!!!'
              );
              this.obtenerProductos();
            } else {
              this._utilidadService.mostrarAlerta(
                'No se pudo eliminar el producto',
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
}
