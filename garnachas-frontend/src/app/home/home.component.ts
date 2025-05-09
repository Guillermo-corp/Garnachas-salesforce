import { Component, ViewChild, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../services/cart.service'; 
import { track } from '@vercel/analytics';
import { CustomPaginatorIntl } from '../services/custom-paginator-intl.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None, // Desactiva la encapsulación de estilos
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatAutocompleteModule, // Add this
    MatOptionModule,       // Add this
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }, // Registra el servicio personalizado
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }, // Set appearance to outline
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class HomeComponent {
  pageSize: number = 4;
  currentPage: number = 0;
  paginatedList: any[] = [];
  
  
  // Complementos de los productos
  sizes: string[] = ['Pequeño', 'Mediano', 'Grande'];
  sauces: string[] = ['No picante', 'Picante', 'Dulce'];

  selectedSize: string | null = null;
  selectedSauce: string | null = null;

  sizesControl = new FormControl();
  sauceControl = new FormControl();

  filteredSizes: string[] = this.sizes;
  filteredSauces: string[] = this.sauces;

  onSizeSelected(event: MatAutocompleteSelectedEvent, item: any) {
    item.selectedSize = event.option.value; // Asocia el tamaño seleccionado al producto específico
    console.log(`Selected size for ${item.name}:`, item.selectedSize);
  }

  onSauceSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedSauce = event.option.value;
    console.log('Selected sauce:', this.selectedSauce);
  }

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
    this.updatePaginatedList();
  }
  ngOnInit() {
    this.filteredLocationList = [
      {
        name: 'Garnacha',
        description: 'Descripción de la garnacha.',
        price: 12,
        image: 'https://i.ytimg.com/vi/Yz4ljMJOhKU/maxresdefault.jpg',
        spiceLevel: 'Picante',
        category: 'Tradicional',
        isBestSeller: true,
        selectedSize: null, // Añadir propiedad para el tamaño seleccionado
        sizeControl: new FormControl(), // Control específico para el tamaño
      },
      {
        name: 'Quesadilla',
        description: 'Descripción de la quesadilla.',
        price: 14,
        image: 'https://editorialtelevisa.brightspotcdn.com/wp-content/uploads/2019/11/quesadillas-veracruzanas.jpg',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedSize: null,
        sizeControl: new FormControl(), // Control específico para el tamaño
      },
      {
        name: 'Tempispis',
        description: 'Descripción de la tempispis.',
        price: 15,
        image: 'https://animalgourmet.com/wp-content/uploads/2020/05/image0-1.jpeg',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedSize: null, // Añadir propiedad para el tamaño seleccionado
        sizeControl: new FormControl(), // Control específico para el tamaño
      },
      {
        name: 'Gorditas',
        description: 'Descripción de la gordita.',
        price: 14,
        image: 'https://i.ytimg.com/vi/GnArHf0i5nE/maxresdefault.jpg',
        spiceLevel: 'Dulce',
        category: 'Tradicional',
        isBestSeller: false,
        selectedSize: null, // Añadir propiedad para el tamaño seleccionado
        sizeControl: new FormControl(), // Control específico para el tamaño
      },
      {
        name: 'Picadas',
        description: 'Descripción de la picada.',
        price: 12,
        image: 'https://i.ytimg.com/vi/lhGN9kJeNsw/maxresdefault.jpg',
        spiceLevel: 'Picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedSize: null, // Añadir propiedad para el tamaño seleccionado
        sizeControl: new FormControl(), // Control específico para el tamaño
      },
      {
        name: 'Sopes',
        description: 'Descripción de los sopes.',
        price: 14,
        image: 'https://patijinich.com/es/wp-content/uploads/sites/3/2017/12/610-sopes.jpg',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedSize: null, // Añadir propiedad para el tamaño seleccionado
        sizeControl: new FormControl(), // Control específico para el tamaño
      },
      {
        name: 'Molotes',
        description: 'Descripción de los molotes.',
        price: 30,
        image: 'https://curul.com.mx/wp-content/uploads/2022/09/FB_IMG_1664032066408.jpg',
        spiceLevel: 'Dulce',
        category: 'Tradicional',
        isBestSeller: false,
        selectedSize: null, // Añadir propiedad para el tamaño seleccionado
        sizeControl: new FormControl(), // Control específico para el tamaño
      },
      {
        name: 'Chilaquiles',
        description: 'Descripción de los chilaquiles.',
        price: 20,
        image: 'https://www.lamichoacanameatmarket.com/wp-content/uploads/2019/03/Chilaquiles-Rojos.jpg',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedSize: null, // Añadir propiedad para el tamaño seleccionado
        sizeControl: new FormControl(), // Control específico para el tamaño
      },
      {
        name: 'Panuchos',
        description: 'Descripción de los panuchos.',
        price: 18,
        image: 'https://i.ytimg.com/vi/87h2fWh4ol4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDVKZF7rbYAfdrD4yz-qlQLG_i_ew',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedSize: null, // Añadir propiedad para el tamaño seleccionado
        sizeControl: new FormControl(), // Control específico para el tamaño
      }
    ];
    this.updatePaginatedList();
  }
  updatePaginatedList() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedList = this.filteredLocationList.slice(startIndex, endIndex);
  }
/* 
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
  tempispis = {
    name: 'Tempispis',
    description: 'Descripción de la tempispis.',
    price: 15.0,
  };
  gorditas = {
    name: 'Gorditas',
    description: 'Descripción de la gorditas.',
    price: 14.0,
  }
  picadas = {
    name: 'Picadas',
    description: 'Descripción de la picadas.',
    price: 12.0,
  } */
  constructor(private cartService: CartService) {} // Inyectar el servicio

  addToCart(item: any): void {
    if (item.selectedSize) {
      item.size = item.selectedSize; // Usa el tamaño seleccionado del producto
    }
    this.cartService.addToCart(item); // Agregar al carrito usando el servicio
    console.log('Added to cart:', item);
    window.alert(`Producto agregado al carrito: ${item.name} (Tamaño: ${item.size || 'No especificado'})`);

    // Rastrear el evento de agregar al carrito
    track('add_to_cart', { itemName: item.name, itemPrice: item.price, itemSize: item.size });
  }

  removeFromCart(item: any): void {
    this.cartService.removeItemFromCart(item); // Lógica para eliminar el producto del carrito
    console.log('Removed from cart:', item);
    window.alert('Producto eliminado del carrito: ' + item.name);
    // Add logic to handle removing the item from the cart
  }
}




