import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';


import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import * as xslsx from 'xlsx';
import { Reporte } from '../../../../interfaces/reporte copy';
import { VentaService } from '../../../../services/venta.service';
import { UtilidadService } from '../../../../shared/utilidad.service';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMMM/YYYY',
  },
};

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    FormsModule,
    MatInputModule,
  ],
  providers: [
    MomentDateAdapter,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS },
  ],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss',
})
export class ReporteComponent {
  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = [
    'fechaRegistro',
    'numeroVenta',
    'tipoPago',
    'total',
    'producto',
    'cantidad',
    'precio',
    'totalProducto',
  ];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  private _ventaService = inject(VentaService);
  private _utilidadService = inject(UtilidadService);

  constructor(private fb: FormBuilder) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas() {
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format(
      'DD/MM/YYYY'
    );
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format(
      'DD/MM/YYYY'
    );
    if (_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date') {
      this._utilidadService.mostrarAlerta(
        'Debe ingresar ambas fechas',
        'Error'
      );
      return;
    }
    this._ventaService.reporte(_fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if (data.status) {
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadService.mostrarAlerta(
            'No se encontraron datos',
            'Oops'
          );
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  exportarExcel() {
    const wb = xslsx.utils.book_new();
    const ws = xslsx.utils.json_to_sheet(this.listaVentasReporte);
    xslsx.utils.book_append_sheet(wb, ws, 'Reporte');
    xslsx.writeFile(wb, 'ReporteVentas.xlsx');
  }
}
