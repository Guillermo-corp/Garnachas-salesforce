import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.email === 'admin@ucc.mx' && this.password === 'password') {
      localStorage.setItem('userToken', 'authenticated');
      this.router.navigate(['/']); // Redirige al perfil
    } else {
      alert('Credenciales incorrectas');
    }
  }
}