import { Component, OnInit, signal, effect, computed, inject, runInInjectionContext, Inject } from '@angular/core';
import { Chart, Filler, registerables, scales } from 'chart.js';
import { ReportService } from '../dashboard.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

Chart.register(...registerables);

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements OnInit {  
    private reportService = inject(ReportService);

    selectedDate: string | null = null;
    dateRange= signal<string>('last_day');
    chartData = signal<any[]>([]);
    chartLabels = signal<string[]>([]);
    availableOptions: {label:string, id:string} [] = [];
    predictions: any[] = [];
    
    selectedOptions: {id:string, label:string}[] = [];
    selectedLabels = <string[]> ([]);
    isOpen = false; 

    public cfgUser:any = {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Cantidad de ordenes',
                    data: [],
                    fill: false,
                    backgroundColor: '',
                    borderColor: '',
                },
            ],
            option: {
                aspectRatio:1,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            },
        }
    };
    chart:any; 

    public cfgInventarioMp: any = {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Cantidad de materias primas',
                    data: [],
                    backgroundColor: [''],
                    borderColor: [''],
                    fill:false,

                }
            ],
            options: {
                indexAxis: 'y', 
                responsive: true,
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Chart.js Horizontal Bar Chart'
                    }
                }
            }
        }
    }
    chartInventoryMp: any;

    public cfgVentas: any = computed(() =>  ({
        type: 'line',
        data: {
            labels: this.chartLabels(),
            datasets: [
                {
                    label: this.getTextLabel(this.dateRange()),
                    data: this.chartData(),
                    fill: false,
                    borderColor: '#FF6384',
                    backgroundColor: 'FF6384',
                    borderWidth: 1,
                }
            ],
            options: {
                indexAxis: 'x',
                responsive: true,
                aspectRatio: 1,
                scales: {
                    x:{
                        beginAtZero: true,
                    },
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        }
    }));
    chartVentas: Chart | undefined;

    chartPredict: Chart | undefined;

    constructor() {
        effect(() => {
            if (this.chartVentas) {
                this.chartVentas.destroy();
            }
            this.chartVentas = new Chart('ventas', this.cfgVentas());
        });
    }
    
    ngOnInit(): void {
        this.reportService.getUsersReport().subscribe((data: any) => {
            console.log(data);
            this.cfgUser.data.lables = data.labels || [];
            this.cfgUser.data.datasets = data.datasets || [];

            if(this.chart){
                this.chart.update();
            } else{
                this.chart = new Chart('userMostOrder', this.cfgUser);
            }

        });        
        this.chart = new Chart('userMostOrder', this.cfgUser);

        this.reportService.getInventarioMp().subscribe((data: any) => {
            console.log(data);

            this.cfgInventarioMp.data.labels = data.labels || [];
            this.cfgInventarioMp.data.datasets = data.datasets || [];

            if(this.chartInventoryMp){
                this.chartInventoryMp.update();
            }else {
                this.chartInventoryMp = new Chart('invetoryMp',this.cfgInventarioMp);
            }

        });
        this.chartInventoryMp = new Chart('invetoryMp',this.cfgInventarioMp);

        this.loadReportsVentas();

        this.loadProductos();
        // this.loadPredict();
    }

    loadProductos() {
        this.reportService.getProductos().subscribe( productos  => {
            console.log(productos);
            if(Array.isArray(productos)){
                this.availableOptions = productos.map((producto: any) => 
                    ({
                        label: producto.nombre, 
                        id: producto.id.toString()
                    }));
            }
        });
    }

    loadReportsVentas():void{
        this.reportService.getVentas(this.dateRange()).subscribe((data: any) => {
            console.log(data);

            const labels = data.data.map((item: any) => new Date(item.OrderDate).toLocaleDateString());
            const dataset = data.data.map((item: any) => item.Total);

            this.chartLabels.set(labels);
            this.chartData.set(dataset);  
            
            if(this.chartVentas){
                this.chartVentas.data.datasets[0].label=  this.getTextLabel(this.dateRange());    
                this.chartVentas.update();
            }
        });
    }

    getTextLabel(dateRange:string){
        switch(dateRange) {
            case 'last_day':
                return 'Ultimas 24 horas';
            case 'last_week':
                return 'Ultima semana';
            case 'last_month':
                return 'Ultimo mes';
            case 'last_year':
                return 'Ultimo año';
            default:
                return 'Ultimas 24 horas';
        }
    }

    loadPredict():void{

        if(!this.selectedDate){
            console.error('No se ha seleccionado una fecha');
            return;
        }
        const requestData = this.selectedOptions.map((option) => 
            ({
                date: this.selectedDate,
                item: parseInt(option.id)
            })
        );

        this.reportService.getPredictRege(Array.from(requestData)).subscribe((data) => {
            console.log('predictions:',data);


            const labels = data.map((item: any) => {
                const selectedOption = this.selectedOptions.find(option => parseInt(option.id) === item.item);
                return selectedOption ? selectedOption.label : 'Producto desconocido';
            });

            const dataset = data.map((item:any) => item.prediction);

            const colors = dataset.map((value: number) => {
                if (value < 11) {
                    return '#EF5252'; 
                } else if (value >= 11 && value < 21) {
                    return '#F4AA39'; 
                } else {
                    return '#52EF84'; 
                }
            });

            const cfgPredict:any = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: `Predicciones para la fecha ${this.selectedDate}`,
                            data: dataset,
                            fill: false,
                            backgroundColor: colors , 
                            borderColor: colors,
                            borderWidth: 2,
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    aspectRatio: 1,
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks:{
                                callback: (value:number) => value.toString(),
                            }
                        },
                        y: {
                            beginAtZero: true,
                        }
                    }
                }
            }

            if (this.chartPredict) {
                this.chartPredict.destroy();
                this.chartPredict = undefined; 
            }

            this.chartPredict = new Chart('predict', cfgPredict);

        }, (error) => {
            console.error('Error:', error);
        });
    }


    onChange(event : any ): void{
        this.dateRange.set(event.target.value);
        this.loadReportsVentas();
        console.log(event.target.value);
    }

    toggleDropdown(): void {
        this.isOpen = !this.isOpen;
    }
    
    selectOption(option: { label: string; id: string }): void {
        const index = this.selectedOptions.findIndex(selectOption => selectOption.id === option.id);

        if(this.selectedOptions.length < 5){
            if(index === -1){
                this.selectedOptions.push(option);
                this.selectedLabels.push(option.label);
            }else{
                this.selectedOptions.splice(index, 1);
                this.selectedLabels.splice(index, 1);
            }
        }else{
            if(index !== -1){
                this.selectedOptions.splice(index, 1);
                this.selectedLabels.splice(index, 1);
            }
        }
    }

    onDateChange(event: any): void {
        const selectedDate = new Date(event.target.value);
        this.selectedDate = selectedDate.toISOString().split('T')[0]; 
        console.log(this.selectedDate); 
        
        this.loadPredict();
    }

    isOptionSelected(optionId: string): boolean {
        return this.selectedOptions.some(selectedOption => selectedOption.id === optionId);
    }
    
    
}