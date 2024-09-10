import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Person } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private personId = 'CurrentPersonId';
  private personName = 'CurrentPersonName';

  constructor(private cookieService: CookieService, private router: Router) {}

  // Cookieden token'ı getir
  getTokenFromCookie(): string | null {
    return this.cookieService.get(this.tokenKey);
  }

  // Token'ı cookie'ye set et
  setTokenInCookie(token: string) {
    this.cookieService.set(this.tokenKey, token);
  }

  // Cookieden PersonId'yi getir
  getPersonIdFromCookie(): string | null {
    return this.cookieService.get(this.personId);
  }

  // Cookieden Person'ı getir
  getPerson(): Person {
    return {
      Id: this.cookieService.get(this.personId),
      Name: this.cookieService.get(this.personName),
    };
  }

  // Cookieden Person'ı kur
  setPerson(person: Person) {
    this.cookieService.set(this.personName, person.Name);
    this.cookieService.set(this.personId, person.Id);
  }

  // PersonId'yi cookie'ye set et
  setPersonIdInCookie(personId: string) {
    this.cookieService.set(this.personId, personId);
  }

  // Token'ı ve kullanıcı bilgilerini çerezden silme
  removeTokenFromCookie(): void {
    this.cookieService.delete(this.tokenKey);
    this.cookieService.delete(this.personId);
    this.cookieService.delete(this.personName);
  }

  // Token var mı kontrolü
  isTokenExist(): boolean {
    return this.getTokenFromCookie() !== null;
  }

  // Token geçerliliğini kontrol etme
  isAuthenticated(): boolean {
    const token = this.getTokenFromCookie();
    if (!token) {
      return false;
    }

    try {
      // Token'ı decode edip geçerlilik süresini kontrol etme
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;

      // Geçerlilik süresini Unix zamanından okunabilir bir tarihe çevirme
      const expiryDate = new Date(expiry * 1000); // Unix zamanını milisaniyeye çevirme
      console.log('Token expiration date:', expiryDate.toLocaleString());

      // Geçerlilik süresini kontrol etme
      return Math.floor(new Date().getTime() / 1000) < expiry;
    } catch (e) {
      console.error('Token decoding error:', e);
      return false;
    }
  }

  // Kullanıcıyı çıkış yaptırma
  logout(): void {
    this.removeTokenFromCookie();
    this.router.navigate(['/login']);
  }

  // HTTP başlıkları için token ekleme
  getHeaders() {
    const token = this.getTokenFromCookie();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }
}
