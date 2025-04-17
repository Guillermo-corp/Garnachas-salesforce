import { Component } from '@angular/core';
import { RouterLink} from '@angular/router';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
 
}
