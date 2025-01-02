import { Component, inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Menu } from '../../interfaces/menu';
import { MenuService } from '../../services/menu.service';
import { UtilidadService } from '../../shared/utilidad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    LayoutModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = '';

  private router = inject(Router);
  private _menuService = inject(MenuService);
  private _utilidadService = inject(UtilidadService);

  ngOnInit(): void {
    const usuario = this._utilidadService.obtenerSesionUsuario();
    if (usuario != null) {
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;

      this._menuService.lista(usuario.idUsuario).subscribe({
        next: (data) => {
          if (data.value) {
            this.listaMenus = data.value;
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  cerrarSesion() {
    this._utilidadService.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }
}
