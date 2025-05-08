import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = !!localStorage.getItem('userToken'); // Verifica si hay un token en localStorage

  if (!isAuthenticated) {
    router.navigate(['/login']); // Redirige al login si no está autenticado
    return false;
  }

  return true; // Permite el acceso si está autenticado
};