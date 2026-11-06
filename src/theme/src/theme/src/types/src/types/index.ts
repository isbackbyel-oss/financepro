export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // em centavos (ex.: R$ 10,50 = 1050)
  category: string;
  description: string;
  date: string; // formato ISO
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number; // centavos
  currentAmount: number; // centavos
}

export const EXPENSE_CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Lazer',
  'Saúde', 'Educação', 'Compras', 'Outros',
];

export const INCOME_CATEGORIES = [
  'Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros',
];
