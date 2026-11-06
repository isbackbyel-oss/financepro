import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { colors, font, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/format';

export default function ReportsScreen() {
  const { transactions, income, expense } = useFinance();
  const now = new Date();

  const expenses = transactions.filter((t) => {
    const d = new Date(t.date);
    return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const total = expenses.reduce((s, t) => s + t.amount, 0);

  const byCat: Record<string, number> = {};
  expenses.forEach((t) => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
  const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatório do mês</Text>

      <View style={styles.card}>
        <Text style={styles.line}>Receitas: <Text style={{ color: colors.income }}>{formatCurrency(income)}</Text></Text>
        <Text style={styles.line}>Despesas: <Text style={{ color: colors.expense }}>{formatCurrency(expense)}</Text></Text>
        <Text style={styles.line}>Resultado: <Text style={{ color: colors.gold }}>{formatCurrency(income - expense)}</Text></Text>
      </View>

      <Text style={styles.section}>Gastos por categoria</Text>
      {rows.length === 0 && <Text style={styles.hint}>Sem despesas neste mês.</Text>}
      {rows.map(([cat, value]) => {
        const pct = Math.round((value / total) * 100);
        return (
          <View key={cat} style={{ marginBottom: spacing.md }}>
            <View style={styles.catRow}>
              <Text style={styles.cat}>{cat}</Text>
              <Text style={styles.cat}>{formatCurrency(value)} · {pct}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${pct}%` as `${number}%` }]} />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: 120 },
  title: { color: colors.gold, fontSize: font.title, fontWeight: '800', marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg,
  },
  line: { color: colors.textPrimary, fontSize: font.body, marginVertical: 3 },
  section: { color: colors.textPrimary, fontSize: font.body, fontWeight: '700', marginBottom: spacing.sm },
  hint: { color: colors.textSecondary },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cat: { color: colors.textPrimary, fontSize: font.small },
  barBg: { height: 8, backgroundColor: colors.surfaceLight, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.gold },
});
