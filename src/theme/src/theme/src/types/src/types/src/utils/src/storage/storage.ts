import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, Transaction } from '../types';

const KEYS = {
  transactions: '@financepro:transactions',
  goals: '@financepro:goals',
};

async function load<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

async function save<T>(key: string, data: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export const loadTransactions = () => load<Transaction>(KEYS.transactions);
export const saveTransactions = (data: Transaction[]) =>
  save(KEYS.transactions, data);

export const loadGoals = () => load<Goal>(KEYS.goals);
export const saveGoals = (data: Goal[]) => save(KEYS.goals, data);
