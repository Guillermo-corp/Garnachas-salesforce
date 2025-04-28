import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service'; // Importa el servicio de carrito
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatPaginatorModule,
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
  @ViewChild('searchBox') searchBox!: ElementRef;
  private cartSubscription!: Subscription;
  
  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onContainerClick(event: Event) {
    // Detiene la propagación para que no se dispare el clic del documento
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.showSearch && this.searchBox && !this.searchBox.nativeElement.contains(event.target)) {
      this.showSearch = false;
    }
  }
  constructor(private cartService: CartService) {
    this.updateCartItemCount();
    this.cartSubscription = this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    });
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
  }
}



