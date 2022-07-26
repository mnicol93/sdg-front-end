import { CdkPortal } from '@angular/cdk/portal';
import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import * as Highcharts from 'highcharts';
import { updateTotal, updateChart } from './chart-helper';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {
  @Input() comarca: any;
  @Input() listaComarcas: any;
  @Input() genero: string;

  filtroComarcas: string[] = [];

  options: Highcharts.Options = { // required
    chart: {
      renderTo: 'container'
    },
    title: { text: "Vacio"},
    xAxis: {
      categories: [],
      title: { text: 'Comarcas' }
    },
    yAxis: {
      categories: [],
      title: { text: 'Habitantes' }
    },
    series: [{
      name: 'Habitantes por comarca',
      data: [],
      type: 'bar'
    }]
  }; 

  // Para evitar el renderizado doble (Highcharts primero carga
  // sin datos en el servidor) se comprueba si Highcharts es tipo objeto,
  // lo cual no se cumple en el servidor. Si lo es, renderizamos con '*ngIf'
  // (https://github.com/highcharts/highcharts-angular#angular-universal---ssr)
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts; // required
  chartOptions: Highcharts.Options = this.options; // required
  // Asignar True cuando se quiera actualizar el grafico, valor cambia
  // a False internamente en el componente Highcharts-angular.  
  updateFlag: boolean = false;
  // Funcion que devuelve el objeto chart (this). 
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
  }

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = updateTotal(this.listaComarcas, this.genero, this.filtroComarcas);
  }

  ngOnChanges(changes: SimpleChange): void {
    let found: any = this.filtroComarcas.find(element => element == this.comarca.title);
    if(typeof found === 'undefined'){
      // Si no encuentra el titulo, push al filtro.
      this.filtroComarcas.push(this.comarca.title);
    }else{
      // Si lo encuentra, devuelve array sin el titulo.
      this.filtroComarcas = this.filtroComarcas.filter(com => com != this.comarca.title);
    }
    this.chartOptions = updateTotal(this.listaComarcas, this.genero, this.filtroComarcas);
  }
}
