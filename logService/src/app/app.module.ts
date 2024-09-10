import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ExpenseListComponent } from './expense/expense-list/expense-list.component';
import { AddExpenseComponent } from './expense/add-expense/add-expense.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    ExpenseListComponent,
    AddExpenseComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
