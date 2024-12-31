import {
  Component,
  AfterViewInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';


import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { Venta } from '../../../../interfaces/venta';
import { VentaService } from '../../../../services/venta.service';
import { UtilidadService } from '../../../../shared/utilidad.service';
import { ModalDetalleVentaComponent } from '../../modals/modal-detalle-venta/modal-detalle-venta.component';
import { CommonModule } from '@angular/common';

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
  selector: 'app-historial-venta',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    FormsModule,
  ],
  providers: [
    MomentDateAdapter,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS },
  ],
  templateUrl: './historial-venta.component.html',
  styleUrl: './historial-venta.component.scss',
})
export class HistorialVentaComponent implements AfterViewInit {
  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    { value: 'fecha', descripcion: 'Por Fechas' },
    { value: 'numero', descripcion: 'Numero Venta' },
  ];
  columnasTabla: string[] = [
    'fechaRegistro',
    'numeroDocumento',
    'tipoPago',
    'total',
    'accion',
  ];
  dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  private dialog = inject(MatDialog);
  private _ventaService = inject(VentaService);
  private _utilidadService = inject(UtilidadService);

  constructor(private fb: FormBuilder) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: [''],
    });
    this.formularioBusqueda
      .get('buscarPor')
      ?.valueChanges.subscribe((value) => {
        this.formularioBusqueda.patchValue({
          numero: '',
          fechaInicio: '',
          fechaFin: '',
        });
      });
  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }
  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLowerCase();
  }
  buscarVentas() {
    let _fechaInicio: string = '';
    let _fechaFin: string = '';
    if (this.formularioBusqueda.value.buscarPor === 'fecha') {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format(
        'DD/MM/YYYY'
      );
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format(
        'DD/MM/YYYY'
      );
      if (_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date') {
        this._utilidadService.mostrarAlerta(
          'Debe ingresar ambas fechas',
          'Error'
        );
        return;
      }
    }
    this._ventaService
      .historial(
        this.formularioBusqueda.value.buscarPor,
        this.formularioBusqueda.value.numero,
        _fechaInicio,
        _fechaFin
      )
      .subscribe({
        next: (data) => {
          if (data.status) this.datosListaVenta = data.value;
          else
            this._utilidadService.mostrarAlerta(
              'No se encontraron datos',
              'Oops!'
            );
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  verDetalleVenta(_venta: Venta) {
    this.dialog.open(ModalDetalleVentaComponent, {
      data: _venta,
      disableClose: true,
      width: '700px',
    });
  }
}
