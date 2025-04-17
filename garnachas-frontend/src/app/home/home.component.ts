import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    MatPaginatorModule
  ],
  templateUrl: './home.component.html',
})

export class HomeComponent {
  pageSize: number = 4;
  currentPage: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filteredLocationList: any[] = []; // Lista filtrada de ubicaciones
  filterResults(filterValue: string) {
    // Lógica para filtrar la lista de ubicaciones
    console.log('Filtrando resultados con:', filterValue);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    console.log('Cambio de página:', event);
  }
}


