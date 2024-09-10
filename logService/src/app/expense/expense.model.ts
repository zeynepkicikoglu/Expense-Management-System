export interface Expense {
  ExpenseId: number;
  CustomerId: string;
  CustomerName: string | null;
  ExpenseCode: string;
  ExpenseCodeDesc: string | null;
  ExpenseDate: string;
  Description: string;
  ExpenseType: string;
  DocumentNo: string;
  Amount: number;
}
