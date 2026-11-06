import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AddTransactionModal from './src/components/AddTransactionModal';
import { FinanceProvider } from './src/context/FinanceContext';
import GoalsScreen from './src/screens/GoalsScreen';
import HomeScreen from './src/screens/HomeScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import { colors } from './src/theme';

type Tab = 'home' | 'transactions' | 'goals' | 'reports';

const TABS: { key: Tab; label: string }[] = [
  { key: 'home', label: 'Início' },
  { key: 'transactions', label: 'Extrato' },
  { key: 'goals', label: 'Metas' },
  { key: 'reports', label: 'Relatórios' },
];

function Main() {
  const [tab, setTab] = useState<Tab>('home');
  const [adding, setAdding] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'transactions' && <TransactionsScreen />}
        {tab === 'goals' && <GoalsScreen />}
        {tab === 'reports' && <ReportsScreen />}
      </View>

      <Pressable style={styles.fab} onPress={() => setAdding(true)}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <Pressable key={t.key} style={styles.tab} onPress={() => setTab(t.key)}>
            <Text style={[styles.tabText, tab === t.key && { color: colors.gold }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <AddTransactionModal visible={adding} onClose={() => setAdding(false)} />
    </View>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <Main />
    </FinanceProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingTop: 44 },
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 24,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  tabText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  fab: {
    position: 'absolute', right: 20, bottom: 100, width: 58, height: 58,
    borderRadius: 29, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center',
    elevation: 6,
  },
  fabText: { color: '#000', fontSize: 32, fontWeight: '600', marginTop: -2 },
});
