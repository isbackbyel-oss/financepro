import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TransactionItem from '../components/TransactionItem';
import { useFinance } from '../context/FinanceContext';
import { colors, font, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/format';

export default function HomeScreen() {
  const { balance, income, expense, transactions, removeTransaction } = useFinance();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.brand}>FinancePro</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo total</Text>
        <Text style={styles.balance}>{formatCurrency(balance)}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.mini}>
          <Text style={styles.miniLabel}>Receitas do mês</Text>
          <Text style={[styles.miniValue, { color: colors.income }]}>{formatCurrency(income)}</Text>
        </View>
        <View style={styles.mini}>
          <Text style={styles.miniLabel}>Despesas do mês</Text>
          <Text style={[styles.miniValue, { color: colors.expense }]}>{formatCurrency(expense)}</Text>
        </View>
      </View>

      <Text style={styles.section}>Últimas movimentações</Text>
      {transactions.length === 0 && (
        <Text style={styles.empty}>Nenhuma movimentação ainda. Toque no + para começar.</Text>
      )}
      {transactions.slice(0, 5).map((t) => (
        <TransactionItem key={t.id} item={t} onDelete={removeTransaction} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: 120 },
  brand: { color: colors.gold, fontSize: font.title, fontWeight: '800', marginBottom: spacing.lg },
  balanceCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.gold, marginBottom: spacing.md,
  },
  balanceLabel: { color: colors.textSecondary, fontSize: font.small },
  balance: { color: colors.textPrimary, fontSize: font.big, fontWeight: '800', marginTop: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  mini: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  miniLabel: { color: colors.textSecondary, fontSize: font.small },
  miniValue: { fontSize: font.body, fontWeight: '700', marginTop: spacing.xs },
  section: { color: colors.textPrimary, fontSize: font.body, fontWeight: '700', marginBottom: spacing.sm },
  empty: { color: colors.textSecondary },
});
