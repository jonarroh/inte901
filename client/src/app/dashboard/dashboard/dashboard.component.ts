// import { Component, OnInit } from '@angular/core';
// import { ChartData, ChartOptions } from 'chart.js';
// import { ReportService } from '../dashboard.service';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css'] // Asegúrate de que styleUrls esté bien escrito
// })
// export class DashboardComponent implements OnInit {
//   public chartData: ChartData<'bar'> | undefined;
//   public chartOptions: ChartOptions<'bar'> = {
//     responsive: true,
//   };

//   constructor(private reportService: ReportService) {}

//   ngOnInit(): void {
//     this.reportService.getUsersReport().subscribe((data: any) => {
//       this.chartData = {
//         labels: data.labels,
//         datasets: data.datasets
//       };
//     });
//   }
// }
