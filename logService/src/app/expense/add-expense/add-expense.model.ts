export interface NextGenCustomer {
  luname: string;
  CustomerId: string;
  Name: string;
}

export interface NextGenExpenseCodes {
  luname: string;
  ExpenseCode: string;
  Description: string;
}

export interface NextGenCreateExpenseRequest {
  PersonId: string | null;
  CustomerId: string;
  ExpenseCode: string | null;
  ExpenseDate: string | null;
  Description: string | null;
  ExpenseTypeDb: string;
  DocumentNo: string | null;
  Amount: number | null;
}

export interface NextGenCreateExpenseResult {
  Success: boolean;
  ErrorMessage: string | null;
  ExpenseId: number | null;
}

export interface GetCustomersResponse {
  success: boolean;
  customers: NextGenCustomer[];
}
