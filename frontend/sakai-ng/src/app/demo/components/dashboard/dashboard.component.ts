import { Component, OnInit, OnDestroy, AfterViewInit, numberAttribute } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import Swiper from 'swiper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CondominService, Condominio } from 'src/app/services/condomin.service';
import Swal from 'sweetalert2';
import { Reserva, ReservasService } from 'src/app/services/reservas.service';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';


@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  
    gerarCorAleatoria(): string{
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue =  Math.floor(Math.random() * 256);

        return `rgba(${red}, ${green}, ${blue}, 0.8)`;
    } 

  condominios: Condominio[] = [];
  reservas: Reserva[] = []; 
  pedidos: any[] = [];
  colors: string[] = [
    '#FF5733', '#33FF57', '#3357FF', 
    '#FF33A1', '#A133FF', '#33FFD6', 
    '#FFD633', '#FF5733', '#FF33C4'
  ];
  
  carregarReservas(){
    this.reservaService.getReservas().subscribe(
        (data: Reserva[]) => {
        this.reservas = data;
        console.log(data);
        }
    )
  }
  

    carregarCondominios(){
       this.condoService.getCondominios().subscribe(
        (data: any) => {
            this.condominios = data.condominios;
            console.log(data);
         
            if(this.condominios.length === 0){
                Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: "Informação importante!",
                    text: "Cadastre um condomínio para continuar...",
                    showConfirmButton: true,
                    timer: 4000
                  });
            } 
            
        }
       ); 
    }
    
    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    getBorderColor(index: number): string {
        return `5px solid ${this.colors[index % this.colors.length]}`;
      }
     
     
    ngAfterViewInit(): void {
        const swiper = new Swiper('.slide-content',{
            slidesPerView: 3,
            spaceBetween:25,
            loop:true,
            autoplay:{
                delay:3000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            pagination:{
                el: ".swiper-pagination",
                clickable:true,
                dynamicBullets:true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                520: {
                    slidesPerView: 2,
                },
                950: {
                    slidesPerView: 3
                },
        
            },
        });
    } 

     responsiveOptions: any[];

    items!: MenuItem[];

    products!: Product[];

    chartData: any;
    barData: any;
    barOptions: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(
        private reservaService:ReservasService ,
        private condoService:CondominService ,
        private http:HttpClient ,
        private productService: ProductService, 
        public layoutService: LayoutService,
        private authService: AuthServiceService 
       ) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });

     
    }

    fetchData(){
        const token = this.authService.getToken();
        if(!token){
            console.error('Token not found in sessionStorage.');
            return;
        }
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        this.http.get<any>('http://127.0.0.1:5000/admin/lista/reservas', { headers }).subscribe(
            (resposta: any) => {
                if (resposta && resposta.admin) {
                    this.pedidos = [resposta.admin]; // Transformar o objeto em um array
                    console.log(this.pedidos);
                } else {
                    console.error('Resposta inesperada da API:', resposta);
                }
            },
            error => {
                console.error('Erro ao buscar reservas:', error);
            }
        );
    }
    

    ngOnInit() {
        this.fetchData()
      
        this.carregarCondominios();
        
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);
    
        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    
}
