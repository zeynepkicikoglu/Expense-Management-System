import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Expense } from '../expense.model';
import { ArrayResult } from 'src/app/utils/models/result-model';
import { NextGenCustomer } from '../add-expense/add-expense.model';
import { generateParamList } from 'src/app/utils/service-helper/service-helper';
import { NextGenExpenseCodes } from '../add-expense/add-expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseListService {
  constructor(private http: HttpClient, private cookieManager: AuthService) {}

  getExpenses(year: number, period: number): Observable<Expense[]> {
    const personId = this.cookieManager.getPersonIdFromCookie(); // Person ID'yi alın
    const headers = this.cookieManager.getHeaders(); // Headers'ı alın

    // Query parametresi ile personId ve year, period gönderiliyor
    const serviceUrl = `http://localhost:3000/api/expense/expenses?year=${year}&period=${period}&personId=${personId}`;

    return this.http.get<any>(serviceUrl, { headers }).pipe(
      map((response) => {
        // Burada gelen veriyi loglayalım
        console.log('Expenses from backend:', response);

        // success alanını kontrol ediyoruz
        if (response.success) {
          return response.expenses;
        } else {
          console.error('Expenses could not be fetched:', response.message);
          return [];
        }
      }),
      catchError((error) => {
        console.error('Error fetching expenses', error);
        return throwError(error);
      })
    );
  }

  ////////////////////////////////////////////

  async fetchExpensesAndCustomers(
    year: number,
    period: number
  ): Promise<Expense[]> {
    try {
      // Expenses'ı Promise olarak al
      const expenses = await this.getExpenses(year, period).toPromise();
      if (!expenses || expenses.length === 0) {
        console.error('Expense bulunamadı.');
        return [];
      }

      // Müşteri ID'lerini topla
      const customerIds = Array.from(
        new Set(expenses.map((item) => item.CustomerId).filter((id) => id))
      );
      // Masraf ID'lerini topla
      const expensesIds = Array.from(
        new Set(expenses.map((item) => item.ExpenseCode).filter((id) => id))
      );

      console.log('Expenses Ids:', expensesIds);

      // Toplu müşteri bilgilerini al (eğer API destekliyorsa)
      const customers = await this.getCustomersByIds(customerIds).toPromise();
      const customerMap = new Map(
        customers!.map((customer: NextGenCustomer) => [
          customer.CustomerId,
          customer,
        ])
      );

      // Toplu masraf bilgilerini al (eğer API destekliyorsa)
      const expensesCode = await this.getExpensesByIds(
        year,
        period,
        expensesIds
      ).toPromise();
      const expensesCodeMap = new Map(
        expensesCode!.map((expensesCode: NextGenExpenseCodes) => [
          expensesCode.ExpenseCode,
          expensesCode,
        ])
      );

      console.log(expensesCode);

      // Güncellenmiş harcamalar
      const updatedExpenses = expenses.map((item: Expense) => {
        const customer = customerMap.get(item.CustomerId);
        const expense = expensesCodeMap.get(item.ExpenseCode);

        item.CustomerName = customer ? customer.Name : 'Unknown';
        item.ExpenseCodeDesc = expense ? expense.Description : 'Unknown';

        return item;
      });

      return updatedExpenses;
    } catch (error) {
      console.error('Error fetching expenses', error);
      return []; // Hata durumunda expenses'ı boş bir dizi yap
    }
  }

  getCustomersByIds(customerIds: string[]): Observable<NextGenCustomer[]> {
    var param = generateParamList(customerIds, 'CustomerId');

    const serviceUrl = `/int/ifsapplications/projection/v1/NextZeyService.svc/Reference_Customers?$filter=${param}`;

    const headers = this.cookieManager.getHeaders();

    return this.http
      .get<ArrayResult<NextGenCustomer>>(serviceUrl, { headers })
      .pipe(
        map((response) => response.value),
        catchError((error) => {
          console.error('Error fetching customers by IDs', error);
          return throwError(error);
        })
      );
  }
  getExpensesByIds(
    Year: number,
    Period: number,
    expensesIds: string[]
  ): Observable<NextGenExpenseCodes[]> {
    const personId = this.cookieManager.getPersonIdFromCookie();
    var param = generateParamList(expensesIds, 'ExpenseCode');

    const serviceUrl = `/int/ifsapplications/projection/v1/NextZeyService.svc/Reference_ExpenseCodes?PersonId='${personId}'&Year=${Year}&Period=${Period})$filter=${param}`;

    const headers = this.cookieManager.getHeaders();

    return this.http
      .get<ArrayResult<NextGenExpenseCodes>>(serviceUrl, { headers })
      .pipe(
        map((response) => response.value),
        catchError((error) => {
          console.error('Error fetching expenses by IDs', error);
          return throwError(error);
        })
      );
  }
}
