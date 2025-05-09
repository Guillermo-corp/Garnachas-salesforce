import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    // Obtiene los usuarios registrados desde localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
  
    // Verifica si el usuario existe y las credenciales son correctas
    const user = users.find((u: { email: string; password: string }) => u.email === this.email && u.password === this.password);
  
    if (user) {
      localStorage.setItem('userToken', 'authenticated'); // Guarda un token de autenticación
      alert('Inicio de sesión exitoso');
      this.router.navigate(['/']); // Redirige al home
    } else {
      alert('Correo o contraseña incorrectos');
    }
  }

  // Simulación de inicio de sesión sin backend
  /* onLogin() {
    if (this.email === 'admin@ucc.mx' && this.password === 'password') {
      localStorage.setItem('userToken', 'authenticated');
      this.router.navigate(['/']); // Redirige al perfil
    } else {
      alert('Credenciales incorrectas');
    }
  } */
}