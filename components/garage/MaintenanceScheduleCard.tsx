import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Card, Divider, SectionHeader } from '@/components/ui/Card';
import { Theme } from '@/constants/Theme';
import { useDatabase } from '@/context/DatabaseContext';
import { formatMaintenanceInterval } from '@/lib/database';
import type { MaintenanceItem, MaintenanceItemInput } from '@/lib/types';

const ICON_MAP: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  'Engine Oil': 'oil',
  'Gear Oil': 'cog',
  'Air Filter': 'air-filter',
  'CVT Cleaning & Regrease': 'cog-transfer',
  'Drive Belt & Sliders': 'circle-outline',
  'Spark Plug': 'flash',
  'Coolant Flush': 'coolant-temperature',
  'Brake Fluid Flush': 'water',
};

function parseOptionalInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function isFormValid(name: string, intervalKm: string, intervalMonths: string): boolean {
  if (!name.trim()) return false;
  const km = parseOptionalInt(intervalKm);
  const months = parseOptionalInt(intervalMonths);
  return km != null || months != null;
}

function buildInput(
  name: string,
  intervalKm: string,
  intervalMonths: string,
  spec: string,
): MaintenanceItemInput {
  return {
    name: name.trim(),
    intervalKm: parseOptionalInt(intervalKm),
    intervalMonths: parseOptionalInt(intervalMonths),
    spec: spec.trim() || undefined,
  };
}

export function MaintenanceScheduleCard() {
  const {
    bike,
    maintenanceItems,
    addMaintenanceItem,
    updateMaintenanceItem,
    deleteMaintenanceItem,
  } = useDatabase();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [intervalKm, setIntervalKm] = useState('');
  const [intervalMonths, setIntervalMonths] = useState('');
  const [spec, setSpec] = useState('');

  const resetForm = () => {
    setName('');
    setIntervalKm('');
    setIntervalMonths('');
    setSpec('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (item: MaintenanceItem) => {
    setEditingId(item.id);
    setName(item.name);
    setIntervalKm(item.intervalKm?.toString() ?? '');
    setIntervalMonths(item.intervalMonths?.toString() ?? '');
    setSpec(item.spec ?? '');
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!isFormValid(name, intervalKm, intervalMonths)) return;

    const input = buildInput(name, intervalKm, intervalMonths, spec);

    if (editingId != null) {
      await updateMaintenanceItem(editingId, input);
    } else {
      await addMaintenanceItem(input);
    }

    resetForm();
  };

  const handleDelete = (item: MaintenanceItem) => {
    Alert.alert('Delete task', `Remove "${item.name}" from the schedule?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMaintenanceItem(item.id),
      },
    ]);
  };

  const showForm = isAdding || editingId != null;
  const templateLabel = bike ? `${bike.make} ${bike.model} schedule` : 'Maintenance schedule';
  const visibleItems = maintenanceItems.filter((item) => item.id !== editingId);

  return (
    <Card>
      <SectionHeader
        icon={<MaterialCommunityIcons name="wrench" size={20} color={Theme.colors.accent} />}
        title="Maintenance Schedule"
        action={
          !showForm ? (
            <Pressable
              onPress={() => setIsAdding(true)}
              style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <Ionicons name="add" size={22} color={Theme.colors.accent} />
            </Pressable>
          ) : null
        }
      />
      <Text style={styles.templateLabel}>Sorted by interval · {templateLabel}</Text>

      {visibleItems.map((item, index) => {
        const iconName = ICON_MAP[item.name] ?? 'cog-outline';
        const isLast = index === visibleItems.length - 1 && !showForm;

        return (
          <View key={item.id}>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name={iconName}
                size={22}
                color={Theme.colors.textSecondary}
                style={styles.icon}
              />
              <Pressable
                onPress={() => startEdit(item)}
                style={({ pressed }) => [styles.itemContent, pressed && styles.pressed]}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.interval}>{formatMaintenanceInterval(item)}</Text>
                {item.spec ? <Text style={styles.spec}>{item.spec}</Text> : null}
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item)}
                hitSlop={8}
                style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
                <Ionicons name="trash-outline" size={18} color={Theme.colors.textMuted} />
              </Pressable>
            </View>
            {!isLast ? <Divider /> : null}
          </View>
        );
      })}

      {showForm ? (
        <View style={styles.form}>
          {visibleItems.length > 0 && editingId == null ? <Divider /> : null}
          <Text style={styles.formTitle}>{editingId != null ? 'Edit Task' : 'Add Task'}</Text>

          <Text style={styles.label}>Task name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Engine Oil"
            placeholderTextColor={Theme.colors.textMuted}
          />

          <Text style={styles.label}>Interval (km)</Text>
          <TextInput
            style={styles.input}
            value={intervalKm}
            onChangeText={setIntervalKm}
            placeholder="e.g. 1500"
            placeholderTextColor={Theme.colors.textMuted}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Interval (months)</Text>
          <TextInput
            style={styles.input}
            value={intervalMonths}
            onChangeText={setIntervalMonths}
            placeholder="e.g. 24 for 2 years"
            placeholderTextColor={Theme.colors.textMuted}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Spec / notes (optional)</Text>
          <TextInput
            style={styles.input}
            value={spec}
            onChangeText={setSpec}
            placeholder="e.g. 10W-30 JASO MB, 0.8L"
            placeholderTextColor={Theme.colors.textMuted}
          />

          <View style={styles.formActions}>
            <Pressable
              onPress={resetForm}
              style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!isFormValid(name, intervalKm, intervalMonths)}
              style={({ pressed }) => [
                styles.saveFormButton,
                !isFormValid(name, intervalKm, intervalMonths) && styles.saveFormButtonDisabled,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.saveFormText}>{editingId != null ? 'Update' : 'Add'}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {maintenanceItems.length === 0 && !showForm ? (
        <Text style={styles.emptyText}>No tasks yet. Tap + to add one.</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  addButton: {
    padding: 4,
  },
  templateLabel: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm + 2,
    paddingRight: Theme.spacing.sm,
  },
  icon: {
    width: 40,
    textAlign: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.colors.text,
  },
  interval: {
    fontSize: 14,
    color: Theme.colors.accent,
    marginTop: 2,
  },
  spec: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    padding: Theme.spacing.sm,
  },
  form: {
    padding: Theme.spacing.md,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  label: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  input: {
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.radius.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },
  cancelButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  cancelText: {
    color: Theme.colors.textSecondary,
    fontSize: 15,
  },
  saveFormButton: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.radius.sm,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
  },
  saveFormButtonDisabled: {
    opacity: 0.4,
  },
  saveFormText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
});
