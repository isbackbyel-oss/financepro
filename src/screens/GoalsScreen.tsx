import React, { useState } from 'react';
import {
  Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { colors, font, radius, spacing } from '../theme';
import { Goal } from '../types';
import { formatCurrency } from '../utils/format';
import { parseToCents } from '../utils/parse';

function GoalCard({ goal }: { goal: Goal }) {
  const { depositGoal, removeGoal } = useFinance();
  const [value, setValue] = useState('');
  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  const deposit = () => {
    const c = parseToCents(value);
    if (!c) return;
    depositGoal(goal.id, c);
    setValue('');
  };

  return (
    <Pressable
      style={styles.card}
      onLongPress={() =>
        Alert.alert('Excluir meta', `Remover "${goal.name}"?`, [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: () => removeGoal(goal.id) },
        ])
      }
    >
      <Text style={styles.goalName}>{goal.name}</Text>
      <Text style={styles.goalSub}>
        {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)} ({pct}%)
      </Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` as `${number}%` }]} />
      </View>
      <View style={styles.depositRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="Valor a guardar"
          placeholderTextColor={colors.textSecondary} keyboardType="decimal-pad"
          value={value} onChangeText={setValue}
        />
        <Pressable style={styles.smallBtn} onPress={deposit}>
          <Text style={styles.smallBtnText}>Guardar</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function GoalsScreen() {
  const { goals, addGoal } = useFinance();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const create = () => {
    const c = parseToCents(target);
    if (!name.trim() || !c) return;
    addGoal(name.trim(), c);
    setName(''); setTarget('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Metas</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input} placeholder="Nome da meta (ex.: Viagem)"
          placeholderTextColor={colors.textSecondary} value={name} onChangeText={setName}
        />
        <TextInput
          style={styles.input} placeholder="Valor alvo (ex.: 2000)"
          placeholderTextColor={colors.textSecondary} keyboardType="decimal-pad"
          value={target} onChangeText={setTarget}
        />
        <Pressable style={styles.btn} onPress={create}>
          <Text style={styles.btnText}>Criar meta</Text>
        </Pressable>
      </View>

      {goals.length === 0 && <Text style={styles.hint}>Nenhuma meta ainda.</Text>}
      {goals.length > 0 && <Text style={styles.hint}>Segure uma meta para excluir.</Text>}
      {goals.map((g) => <GoalCard key={g.id} goal={g} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: 120 },
  title: { color: colors.gold, fontSize: font.title, fontWeight: '800', marginBottom: spacing.md },
  hint: { color: colors.textSecondary, fontSize: font.small, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surfaceLight, color: colors.textPrimary, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  btn: { backgroundColor: colors.gold, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '800' },
  goalName: { color: colors.textPrimary, fontSize: font.body, fontWeight: '700' },
  goalSub: { color: colors.textSecondary, fontSize: font.small, marginVertical: spacing.sm },
  barBg: { height: 8, backgroundColor: colors.surfaceLight, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.gold },
  depositRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  smallBtn: {
    backgroundColor: colors.gold, paddingHorizontal: spacing.md,
    borderRadius: radius.md, justifyContent: 'center',
  },
  smallBtnText: { color: '#000', fontWeight: '800' },
});
