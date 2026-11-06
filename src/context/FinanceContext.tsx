import React, { createContext, useContext, useEffect, useState } from 'react';
import { Goal, Transaction } from '../types';
import {
  loadGoals, loadTransactions, saveGoals, saveTransactions,
} from '../storage/storage';
import { generateId } from '../utils/format';

interface FinanceValue {
  transactions: Transaction[];
  goals: Goal[];
  balance: number;
  income: number;
  expense: number;
  addTransaction: (t: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
  addGoal: (name: string, target: number) => void;
  depositGoal: (id: string, amount: number) => void;
  removeGoal: (id: string) => void;
}

const Ctx = createContext<FinanceValue | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      setTransactions(await loadTransactions());
      setGoals(await loadGoals());
      setReady(true);
    })();
  }, []);

  useEffect(() => { if (ready) saveTransactions(transactions); }, [transactions, ready]);
  useEffect(() => { if (ready) saveGoals(goals); }, [goals, ready]);

  const now = new Date();
  const inMonth = (iso: string) => {
    const d = new Date(iso);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };
  const sum = (list: Transaction[]) => list.reduce((s, t) => s + t.amount, 0);

  const balance =
    sum(transactions.filter((t) => t.type === 'income')) -
    sum(transactions.filter((t) => t.type === 'expense'));
  const income = sum(transactions.filter((t) => t.type === 'income' && inMonth(t.date)));
  const expense = sum(transactions.filter((t) => t.type === 'expense' && inMonth(t.date)));

  const value: FinanceValue = {
    transactions, goals, balance, income, expense,
    addTransaction: (t) =>
      setTransactions((p) => [{ ...t, id: generateId(), date: new Date().toISOString() }, ...p]),
    removeTransaction: (id) => setTransactions((p) => p.filter((t) => t.id !== id)),
    addGoal: (name, target) =>
      setGoals((p) => [...p, { id: generateId(), name, targetAmount: target, currentAmount: 0 }]),
    depositGoal: (id, amount) =>
      setGoals((p) => p.map((g) => (g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g))),
    removeGoal: (id) => setGoals((p) => p.filter((g) => g.id !== id)),
  };

  if (!ready) return null;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFinance(): FinanceValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFinance fora do provider');
  return v;
        }
