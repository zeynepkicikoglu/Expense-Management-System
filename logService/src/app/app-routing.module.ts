import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { ExpenseListComponent } from './expense/expense-list/expense-list.component';
import { AddExpenseComponent } from './expense/add-expense/add-expense.component';
import { AuthGuard } from './auth/auth.guard';
import { LogoutGuard } from './sign-in/logout.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  {
    path: 'expense-list',
    component: ExpenseListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-expense',
    component: AddExpenseComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
