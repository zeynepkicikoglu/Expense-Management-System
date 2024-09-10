import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Option } from '../../utils/models/general-model';
import { Expense } from '../expense.model';
import { ExpenseListService } from './expense-list.service';
import { AddExpenseService } from '../add-expense/add-expense.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
})
export class ExpenseListComponent implements OnInit {
  months: Option[] = [
    { value: '01', label: '01' },
    { value: '02', label: '02' },
    { value: '03', label: '03' },
    { value: '04', label: '04' },
    { value: '05', label: '05' },
    { value: '06', label: '06' },
    { value: '07', label: '07' },
    { value: '08', label: '08' },
    { value: '09', label: '09' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
  ];

  years: Option[] = [];
  selectedMonth: string = '01';
  selectedYear: string = '2024';

  expenses: Expense[] = [];

  constructor(
    private router: Router,
    public authService: AuthService,
    private expenseListService: ExpenseListService,
    private addExpService: AddExpenseService
  ) {}

  ngOnInit() {
    this.years = Array.from({ length: 25 }, (_, i) => 2000 + i).map((year) => ({
      value: year.toString(),
      label: year.toString(),
    }));
  }

  // listExpenses() {
  //   const year = parseInt(this.selectedYear, 10);
  //   const period = parseInt(this.selectedMonth, 10);
  //   const personId = this.authService.getPersonIdFromCookie();

  //   if (!personId) {
  //     console.error('Person ID is not set');
  //     return;
  //   }

  //   this.expenseListService.getExpenses(year, period).subscribe(
  //     (expenses) => {
  //       this.expenses = expenses || []; // Boş bir dizi döndür
  //     },
  //     (error) => {
  //       console.error('Error fetching expenses', error);
  //     }
  //   );
  // }

  async listExpenses() {
    const year = parseInt(this.selectedYear, 10);
    const period = parseInt(this.selectedMonth, 10);
    const personId = this.authService.getPersonIdFromCookie();

    if (!personId) {
      console.error('Person ID is not set');
      return;
    }

    this.expenses = await this.expenseListService.fetchExpensesAndCustomers(
      year,
      period
    );
  }

  addExpense() {
    console.log('Add Expense button clicked');
    this.router.navigate(['/add-expense']);
  }

  logout() {
    this.authService.logout();
  }
}
