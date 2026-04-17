import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // Verificamos si existe la sesión maestra en el explorador
  const operator = localStorage.getItem('pos_operator');
  
  if (operator) {
    return true;
  } else {
    // Redirigir al portal de inicio de sesión
    router.navigate(['/']);
    return false;
  }
};
