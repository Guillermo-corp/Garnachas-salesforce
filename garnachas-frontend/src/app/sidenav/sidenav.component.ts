import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  imports: [RouterModule]
})
export class SidenavComponent {
  isOpen = false;

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }
}
