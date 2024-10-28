import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { VisitantesService } from 'src/app/services/visitantes.service';

@Component({
    selector: 'app-blocks',
    templateUrl: './blocks.component.html'
})
export class BlocksComponent implements OnInit{

    loading = [false, false, false];
    representatives: any[] = []; 
    statuses: any[] = [];
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10, 25, 50];
    visitantes: any[] = [];

    isNotAutorizado(estado: string): boolean {
        return estado === 'Não Autorizado';
    }
    
    isAutorizado(estado: string): boolean {
        return estado === 'Autorizado';
    }

    constructor(private visitas:VisitantesService, private http: HttpClient) {}

      load(index: number){
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
      }

      carregarVisitantesAprovados(){
        this.visitas.getVisitantesAprovado().subscribe(
            (response: any) => {
             this.visitantes = response;   
            console.log(response);
            }
        )
      }


    ngOnInit(): void {
        this.carregarVisitantesAprovados();
    }

}