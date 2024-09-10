import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddExpenseService } from './add-expense.service';
import {
  NextGenCreateExpenseRequest,
  NextGenCustomer,
  NextGenExpenseCodes,
} from './add-expense.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css'],
})
export class AddExpenseComponent implements OnInit {
  expense = {
    customerId: '',
    expenseDate: '',
    expenseCode: '',
    description: '',
    expenseType: '',
    documentNo: '',
    amount: 0,
  };

  customers: NextGenCustomer[] = [];
  expenseCodes: NextGenExpenseCodes[] = [];
  expenseTypes = [
    { id: 'invoice', name: 'Invoice' },
    { id: 'voucher', name: 'Voucher' },
  ];

  errorMessage: string | null = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isAmountInvalid: boolean = false;
  getCust: any;

  constructor(
    private router: Router,
    private addExpenseService: AddExpenseService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCustomers();
    this.loadExpenseCodes();
  }

  loadExpenseCodes() {
    this.addExpenseService.getExpenseCodes().subscribe(
      (codes) => {
        this.expenseCodes = codes;
        console.log('İşlenen exp code listesi:', this.expenseCodes);
        if (this.expenseCodes.length === 0) {
          console.warn('No exp code found');
        }
      },
      (error) => {
        console.error('Error loading exp codes:', error);
      }
    );
  }
  loadCustomers(): void {
    this.addExpenseService.getCustomers().subscribe(
      (customers) => {
        this.customers = customers;
        console.log('İşlenen müşteri listesi:', this.customers);
        if (this.customers.length === 0) {
          console.warn('No customers found');
        }
      },
      (error) => {
        console.error('Error loading customers:', error);
      }
    );
  }

  onSubmit() {
    if (this.expense.amount <= 0) {
      this.isAmountInvalid = true;
      return;
    }

    this.isAmountInvalid = false;

    const request: NextGenCreateExpenseRequest = {
      PersonId: this.authService.getPersonIdFromCookie(),
      CustomerId: this.expense.customerId,
      ExpenseCode: this.expense.expenseCode,
      ExpenseDate: this.expense.expenseDate,
      Description: this.expense.description,
      ExpenseTypeDb: this.expense.expenseType.toUpperCase(),
      DocumentNo: this.expense.documentNo,
      Amount: this.expense.amount,
    };

    this.isLoading = true;

    this.addExpenseService.createExpense(request).subscribe(
      (result) => {
        this.isLoading = false;
        if (result.Success) {
          this.successMessage = 'Expense added successfully!';
          this.errorMessage = '';
          this.expense = {
            customerId: '',
            expenseDate: '',
            expenseCode: '',
            description: '',
            expenseType: '',
            documentNo: '',
            amount: 0,
          };
        } else {
          this.errorMessage = result.ErrorMessage;
          this.successMessage = '';
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error adding expense';
        this.successMessage = '';
        console.error('Error adding expense', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/expense-list']);
  }

  onAmountFocus() {
    if (this.isAmountInvalid) {
      this.isAmountInvalid = false;
    }
  }

  logout() {
    this.authService.logout();
  }
}
