import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import TransactionItem from '../components/TransactionItem';
import { useFinance } from '../context/FinanceContext';
import { colors, font, spacing } from '../theme';

export default function TransactionsScreen() {
  const { transactions, removeTransaction } = useFinance();

  return (
    <FlatList
      data={transactions}
      keyExtractor={(t) => t.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Movimentações</Text>
          <Text style={styles.hint}>Segure um item para excluir.</Text>
        </>
      }
      ListEmptyComponent={<Text style={styles.hint}>Nada por aqui ainda.</Text>}
      renderItem={({ item }) => <TransactionItem item={item} onDelete={removeTransaction} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: 120 },
  title: { color: colors.gold, fontSize: font.title, fontWeight: '800' },
  hint: { color: colors.textSecondary, fontSize: font.small, marginBottom: spacing.md, marginTop: spacing.xs },
});
