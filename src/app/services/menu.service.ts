import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {}

  private urlApi: string = environment.endPoint + 'Menu/';
  private http = inject(HttpClient);

  lista(idUsuario: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.urlApi}Listar?idUsuario=${idUsuario}`
    );
  }
}
