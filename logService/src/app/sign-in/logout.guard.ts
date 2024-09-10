import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    this.authService.logout(); // AuthService'teki logout methodunu çağırın
    this.router.navigate(['/login']); // Login sayfasına yönlendirin
    return false;
  }
}
