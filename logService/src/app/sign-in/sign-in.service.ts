import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LoginResult } from './sign-in.model';
import { TokenInfo } from '../auth/auth.model';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  private tokenInfo: TokenInfo | null = null;
  private tokenKey = 'token';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  getToken(): Observable<TokenInfo> {
    const tokenEndpoint = 'http://localhost:3000/api/sign-in/token';
    const clientId = 'NEXT_ZEY';
    const clientSecret = 'YyER8d9J2XtLKJX1decY9Ldw0JEZSnQz';

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    return this.http
      .post<TokenInfo>(tokenEndpoint, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        tap((tokenInfo) => {
          this.tokenInfo = tokenInfo;
          this.cookieService.set(this.tokenKey, tokenInfo.access_token);
        }),
        catchError((error) => {
          console.error('Error fetching token', error);
          return throwError(() => new Error('Error fetching token'));
        })
      );
  }

  login(personId: string, password: string): Observable<LoginResult> {
    const serviceUrl = `http://localhost:3000/api/sign-in/login`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenInfo?.access_token}`,
    });

    return this.http
      .post<LoginResult>(serviceUrl, { personId, password }, { headers })
      .pipe(
        catchError((error) => {
          console.error('Login error', error);
          return throwError(() => new Error('Login error'));
        })
      );
  }
}
