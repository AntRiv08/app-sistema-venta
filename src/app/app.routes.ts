import { Routes } from '@angular/router';
import { DashBoardComponent } from './components/layout/pages/dash-board/dash-board.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: 'pages',
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (l) => l.LayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './components/layout/pages/dash-board/dash-board.component'
          ).then((m) => m.DashBoardComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./components/layout/pages/usuario/usuario.component').then(
            (u) => u.UsuarioComponent
          ),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./components/layout/pages/producto/producto.component').then(
            (p) => p.ProductoComponent
          ),
      },
      {
        path: 'venta',
        loadComponent: () =>
          import('./components/layout/pages/venta/venta.component').then(
            (v) => v.VentaComponent
          ),
      },
      {
        path: 'historial_venta',
        loadComponent: () =>
          import(
            './components/layout/pages/historial-venta/historial-venta.component'
          ).then((hv) => hv.HistorialVentaComponent),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./components/layout/pages/reporte/reporte.component').then(
            (r) => r.ReporteComponent
          ),
      },
    ],
  },
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
