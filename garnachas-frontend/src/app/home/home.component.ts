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
  
  sauces: string[] = ['Roja', 'Verde', 'Habanero', 'Chipotle Dulce'];
  // Complementos de los productos
  rellenos: { [key: string]: string[] } = {
    Garnacha: ['Con papa','Sin papa'],
    Quesadilla: ['Queso', 'Pollo', 'Carne molida'],
    Tempispis: ['Queso', 'Frijol', 'Carne'],
    Gorditas: ['Frijol', 'Mole'],
    Picadas: ['Con huevo', 'Sin huevo'],
    Sopes: ['Queso', 'Frijol', 'Carne'],
    Molotes: ['Queso', 'Papa', 'Platano'],
    Chilaquiles: ['Con huevo', 'Sin huevo'],
    Panuchos: ['Pollo', 'Cochinita Pibil'],
  };

  selectedRelleno: string | null = null;

  selectedSize: string | null = null;
  selectedSauce: string | null = null;

  sizesControl = new FormControl();
  sauceControl = new FormControl();

  filteredSauces: string[] = this.sauces;

  onSizeSelected(event: MatAutocompleteSelectedEvent, item: any) {
    item.selectedSize = event.option.value; // Asocia el tamaño seleccionado al producto específico
    console.log(`Selected size for ${item.name}:`, item.selectedSize);
  }

  onSauceSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedSauce = event.option.value;
    console.log('Selected sauce:', this.selectedSauce);
  }

  onRellenoSelected(event: MatAutocompleteSelectedEvent, item: any) {
    item.selectedRelleno = event.option.value; // Asocia el relleno seleccionado al producto específico
    console.log(`Selected relleno for ${item.name}:`, item.selectedRelleno);
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
        description: 'Garnachas al estilo Soledad de Doblado, Veracruz.',
        price: 12,
        image: 'https://i.ytimg.com/vi/Yz4ljMJOhKU/maxresdefault.jpg',
        spiceLevel: 'Picante',
        category: 'Tradicional',
        isBestSeller: true,
        selectedRelleno: null, // Añadir propiedad para el relleno seleccionado
        rellenoControl: new FormControl(), // Control específico para el relleno
      },
      {
        name: 'Quesadilla',
        description: 'quesadilla de maíz junto con queso y con el relleno de tu elección.',
        price: 14,
        image: 'https://editorialtelevisa.brightspotcdn.com/wp-content/uploads/2019/11/quesadillas-veracruzanas.jpg',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedRelleno: null,
        rellenoControl: new FormControl(), // Control específico para el relleno
      },
      {
        name: 'Tempispis',
        description: 'tamal de tortilla de maiz acompañado de queso fresco y relleno de tu elección.',
        price: 15,
        image: 'https://animalgourmet.com/wp-content/uploads/2020/05/image0-1.jpeg',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedRelleno: null, // Añadir propiedad para el relleno seleccionado
        rellenoControl: new FormControl(), // Control específico para el relleno
      },
      {
        name: 'Gorditas',
        description: 'base de maiz rellena a tu elección.',
        price: 14,
        image: 'https://i.ytimg.com/vi/GnArHf0i5nE/maxresdefault.jpg',
        spiceLevel: 'Dulce',
        category: 'Tradicional',
        isBestSeller: false,
        selectedRelleno: null, // Añadir propiedad para el relleno seleccionado
        rellenoControl: new FormControl(), // Control específico para el relleno
      },
      {
        name: 'Picadas',
        description: 'Deliciosas tortillas de maíz con frijoles, aguacate y salsa al gusto',
        price: 12,
        image: 'https://i.ytimg.com/vi/lhGN9kJeNsw/maxresdefault.jpg',
        spiceLevel: 'Picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedRelleno: null, // Añadir propiedad para el relleno seleccionado
        rellenoControl: new FormControl(), // Control específico para el relleno
      },
      {
        name: 'Sopes',
        description: 'tortillas gruesas de maíz con el relleno de tu elección.',
        price: 14,
        image: 'https://patijinich.com/es/wp-content/uploads/sites/3/2017/12/610-sopes.jpg',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedRelleno: null, // Añadir propiedad para el relleno seleccionado
        rellenoControl: new FormControl(), // Control específico para el relleno
      },
      {
        name: 'Molotes',
        description: 'base de masa de maíz rellena de frijoles, papa o platano.',
        price: 30,
        image: 'https://curul.com.mx/wp-content/uploads/2022/09/FB_IMG_1664032066408.jpg',
        spiceLevel: 'Dulce',
        category: 'Tradicional',
        isBestSeller: false,
        selectedRelleno: null, // Añadir propiedad para el relleno seleccionado
        rellenoControl: new FormControl(), // Control específico para el relleno
      },
      {
        name: 'Chilaquiles',
        description: 'tortillas fritas bañadas en salsa roja o verde, acompañadas de pollo deshebrado y crema.',
        price: 20,
        image: 'https://www.lamichoacanameatmarket.com/wp-content/uploads/2019/03/Chilaquiles-Rojos.jpg',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedRelleno: null, // Añadir propiedad para el relleno seleccionado
        rellenoControl: new FormControl(), // Control específico para el relleno
      },
      {
        name: 'Panuchos',
        description: 'tortillas de maíz rellenas de frijoles al estilo Veracruzano.',
        price: 18,
        image: 'https://i.ytimg.com/vi/87h2fWh4ol4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDVKZF7rbYAfdrD4yz-qlQLG_i_ew',
        spiceLevel: 'No picante',
        category: 'Tradicional',
        isBestSeller: false,
        selectedRelleno: null, // Añadir propiedad para el relleno seleccionado
        rellenoControl: new FormControl(), // Control específico para el relleno
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
    if (item.selectedRelleno) {
      item.relleno = item.selectedRelleno; // Usa el relleno seleccionado del producto
    }
    this.cartService.addToCart({ ...item }); // Clonar el objeto para evitar referencias compartidas
    console.log('Added to cart:', item);
    window.alert(`Producto agregado al carrito: ${item.name} (Relleno: ${item.relleno || 'No especificado'})`);

    // Rastrear el evento de agregar al carrito
    track('add_to_cart', { itemName: item.name, itemPrice: item.price, itemRelleno: item.relleno });
  }

  removeFromCart(item: any): void {
    this.cartService.removeItemFromCart(item); // Lógica para eliminar el producto del carrito
    console.log('Removed from cart:', item);
    window.alert('Producto eliminado del carrito: ' + item.name);
    // Add logic to handle removing the item from the cart
  }
}




