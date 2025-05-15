import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service'; // Importa el servicio de carrito
import { Subscription } from 'rxjs';
import { track } from '@vercel/analytics';
import { inject } from "@vercel/analytics"
import { injectSpeedInsights } from '@vercel/speed-insights';
import { Router } from '@angular/router';

injectSpeedInsights();
inject();
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule,
    SidenavComponent,
    MatBadgeModule, 
    MatIconModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'homes';
  showSearch = false;  
  cartItemCount: number = 0;
  searchQuery: string = '';
  filteredItems: any[] = [];
  @ViewChild('searchBox') searchBox!: ElementRef;
  private cartSubscription!: Subscription;
  
  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchQuery = '';
      this.filteredItems = [];
    }
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = query;
    this.filteredItems = this.cartService.getCartItems().filter(item =>
      item.name.toLowerCase().includes(query)
    );
  }

  onContainerClick(event: Event) {
    // Detiene la propagación para que no se dispare el clic del documento
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.showSearch && this.searchBox && !this.searchBox.nativeElement.contains(event.target)) {
      this.showSearch = false;
      this.searchQuery = '';
      this.filteredItems = [];
    }
  }
  constructor(private cartService: CartService, private router: Router) {
    this.updateCartItemCount();
    this.cartSubscription = this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    });

  }
  onLogout(): void {
    localStorage.removeItem('userToken'); // Elimina el token de autenticación
    this.router.navigate(['/login']); // Redirige al login
  }
  
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  updateCartItemCount(): void {
    const cartItems = this.cartService.getCartItems();
    this.cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  navigateToDetails(): void {
    this.cartService.navigateToDetailsWithCart();

    track('navigate_to_cart', { cartItemCount: this.cartItemCount });
  }
 
  isAuthenticated(): boolean {
    return !!localStorage.getItem('userToken');
  }

  showSettingsAlert(): void {
    alert('Próximamente');
  }
  
}



