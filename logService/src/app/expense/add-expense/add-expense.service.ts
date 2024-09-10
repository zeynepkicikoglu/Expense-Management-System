import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { ArrayResult } from 'src/app/utils/models/result-model';
import {
  NextGenExpenseCodes,
  NextGenCustomer,
  NextGenCreateExpenseRequest,
  NextGenCreateExpenseResult,
} from './add-expense.model';

@Injectable({
  providedIn: 'root',
})
export class AddExpenseService {
  private baseUrl = 'http://localhost:3000/api/expense';

  constructor(private http: HttpClient, private cookieManager: AuthService) {}

  getExpenseCodes(): Observable<NextGenExpenseCodes[]> {
    const serviceUrl = `${this.baseUrl}/expense-codes`;
    const headers = this.cookieManager.getHeaders();

    return this.http.get<any>(serviceUrl, { headers }).pipe(
      map((response) => {
        // Burada gelen veriyi loglayalım
        console.log('ExpenseCodes from backend:', response);
        // success alanını kontrol ediyoruz
        if (response.success) {
          return response.codes;
        } else {
          console.error('ExpenseCodes could not be fetched:', response.message);
          return [];
        }
      })
    );
  }

  getCustomers(): Observable<NextGenCustomer[]> {
    const serviceUrl = `${this.baseUrl}/customers`;
    const headers = this.cookieManager.getHeaders();
    return this.http.get<any>(serviceUrl, { headers }).pipe(
      map((response) => {
        // Burada gelen veriyi loglayalım
        console.log('Customers from backend:', response);

        // success alanını kontrol ediyoruz
        if (response.success) {
          return response.customers;
        } else {
          console.error('Customers could not be fetched:', response.message);
          return [];
        }
      })
    );
  }

  createExpense(
    request: NextGenCreateExpenseRequest
  ): Observable<NextGenCreateExpenseResult> {
    const serviceUrl = `${this.baseUrl}/create-expense`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookieManager.getTokenFromCookie()}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(serviceUrl, request, { headers }).pipe(
      catchError((error) => {
        console.error('Error creating expense', error);
        return throwError(error);
      })
    );
  }
}
