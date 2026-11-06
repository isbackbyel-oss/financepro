import React, { useState } from 'react';
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { colors, font, radius, spacing } from '../theme';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TransactionType } from '../types';
import { parseToCents } from '../utils/parse';

export default function AddTransactionModal({
  visible, onClose,
}: { visible: boolean; onClose: () => void }) {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [error, setError] = useState('');

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const changeType = (t: TransactionType) => {
    setType(t);
    setCategory((t === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES)[0]);
  };

  const save = () => {
    const cents = parseToCents(amount);
    if (!cents) { setError('Digite um valor válido.'); return; }
    addTransaction({ type, amount: cents, category, description: description.trim() });
    setAmount(''); setDescription(''); setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Nova movimentação</Text>

            <View style={styles.toggle}>
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => changeType(t)}
                  style={[styles.toggleBtn, type === t && { backgroundColor: t === 'income' ? colors.income : colors.expense }]}
                >
                  <Text style={[styles.toggleText, type === t && { color: '#000' }]}>
                    {t === 'expense' ? 'Despesa' : 'Receita'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              style={styles.input} placeholder="Valor (ex.: 25,50)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad" value={amount} onChangeText={setAmount}
            />
            <TextInput
              style={styles.input} placeholder="Descrição (opcional)"
              placeholderTextColor={colors.textSecondary}
              value={description} onChangeText={setDescription}
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.chips}>
              {categories.map((c) => (
                <Pressable
                  key={c} onPress={() => setCategory(c)}
                  style={[styles.chip, category === c && styles.chipActive]}
                >
                  <Text style={[styles.chipText, category === c && { color: '#000' }]}>{c}</Text>
                </Pressable>
              ))}
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={styles.save} onPress={save}>
              <Text style={styles.saveText}>Salvar</Text>
            </Pressable>
            <Pressable onPress={onClose} style={{ padding: spacing.md }}>
              <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>Cancelar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg, padding: spacing.lg, maxHeight: '90%',
  },
  title: { color: colors.textPrimary, fontSize: font.title, fontWeight: '700', marginBottom: spacing.md },
  toggle: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  toggleBtn: {
    flex: 1, padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surfaceLight, alignItems: 'center',
  },
  toggleText: { color: colors.textPrimary, fontWeight: '700' },
  input: {
    backgroundColor: colors.surfaceLight, color: colors.textPrimary,
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md,
    fontSize: font.body, borderWidth: 1, borderColor: colors.border,
  },
  label: { color: colors.textSecondary, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: {
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: 20,
    backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { color: colors.textPrimary, fontSize: font.small },
  error: { color: colors.expense, marginBottom: spacing.sm },
  save: { backgroundColor: colors.gold, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  saveText: { color: '#000', fontWeight: '800', fontSize: font.body },
});
