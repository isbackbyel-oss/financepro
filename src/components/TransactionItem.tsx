import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../theme';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface Props {
  item: Transaction;
  onDelete?: (id: string) => void;
}

export default function TransactionItem({ item, onDelete }: Props) {
  const isIncome = item.type === 'income';
  const confirmDelete = () =>
    Alert.alert('Excluir', 'Remover esta movimentação?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => onDelete?.(item.id) },
    ]);

  return (
    <Pressable onLongPress={onDelete ? confirmDelete : undefined} style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.description || item.category}</Text>
        <Text style={styles.sub}>{item.category} · {formatDate(item.date)}</Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
        {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: font.body, fontWeight: '600' },
  sub: { color: colors.textSecondary, fontSize: font.small, marginTop: 2 },
  amount: { fontSize: font.body, fontWeight: '700' },
});
