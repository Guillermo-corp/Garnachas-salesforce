import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  onRegister() {
    // Verifica si el correo ya está registrado
    if (!this.email || !this.password || !this.confirmPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    // Obtiene los usuarios registrados desde localStorage
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

     // Validación: Verifica que el correo no esté ya registrado
     const users = JSON.parse(localStorage.getItem('users') || '[]');
     const userExists = users.some((u: { email: string }) => u.email === this.email);
 
     if (userExists) {
       alert('Este correo ya está registrado. Por favor, usa otro.');
       return;
     }
 
     // Guarda el usuario en localStorage
     users.push({ email: this.email, password: this.password });
     localStorage.setItem('users', JSON.stringify(users));
 
     alert('Registro exitoso. Ahora puedes iniciar sesión.');
     this.router.navigate(['/login']); // Redirige al login
   }
}