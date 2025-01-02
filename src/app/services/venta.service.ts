import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Venta } from '../interfaces/venta';
@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private urlApi: string = environment.endPoint + 'Venta/';
  private http = inject(HttpClient);
  constructor() {}

  guardar(request: Venta): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Registrar`, request);
  }
  historial(
    buscarPor: string,
    numeroVenta: string,
    fechaInicio: string,
    fechaFin: string
  ): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.urlApi}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }
  reporte(fechaInicio: string, fechaFin: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.urlApi}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }
}
