import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule
  ],
    changeDetection: ChangeDetectionStrategy.OnPush,
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

  garnacha = {
    name: 'Garnacha',
    description: 'Descripción de la garnacha.',
    price: 12.0,
  };

  quesadilla = {
    name: 'Quesadilla',
    description: 'Descripción de la Quesadilla.',
    price: 14.0,
  };

  addToCart(item: any): void {
    console.log('Added to cart:', item);
    // Add logic to handle adding the item to the cart
  }

  removeFromCart(item: any): void {
    console.log('Removed from cart:', item);
    // Add logic to handle removing the item from the cart
  }
}




