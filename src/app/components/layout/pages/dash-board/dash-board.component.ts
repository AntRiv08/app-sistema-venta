import { Component, inject, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

import { Chart, registerables } from 'chart.js';
import { DashBoardService } from '../../../../services/dash-board.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, MatIconModule],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.scss',
})
export class DashBoardComponent implements OnInit {
  totalIngresos: string = '0';
  totalVentas: string = '0';
  totalProductos: string = '0';

  private _dashboardService = inject(DashBoardService);

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]) {
    const chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [
          {
            label: '# de ventas',
            data: dataGrafico,
            backgroundColor: ['rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  ngOnInit(): void {
    this._dashboardService.resumen().subscribe({
      next: (data) => {
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[] = data.value.ventasUltimaSemana;
          // console.log(arrayData);

          const labelTemporal = arrayData.map((value) => value.fecha);
          const dataTemporal = arrayData.map((value) => value.total);

          this.mostrarGrafico(labelTemporal, dataTemporal);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
