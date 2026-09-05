import { Ionicons } from '@expo/vector-icons';
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
import type { OemPart } from '@/lib/types';

export function OemRolodexCard() {
  const { oemParts, addOemPart, updateOemPart, deleteOemPart } = useDatabase();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setName('');
    setPartNumber('');
    setNotes('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (part: OemPart) => {
    setEditingId(part.id);
    setName(part.name);
    setPartNumber(part.partNumber);
    setNotes(part.notes ?? '');
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!name.trim() || !partNumber.trim()) return;

    const input = { name, partNumber, notes: notes.trim() || undefined };

    if (editingId != null) {
      await updateOemPart(editingId, input);
    } else {
      await addOemPart(input);
    }

    resetForm();
  };

  const handleDelete = (part: OemPart) => {
    Alert.alert('Delete part', `Remove "${part.name}" from the rolodex?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteOemPart(part.id),
      },
    ]);
  };

  const showForm = isAdding || editingId != null;

  return (
    <Card>
      <SectionHeader
        icon={<Ionicons name="albums-outline" size={20} color={Theme.colors.accent} />}
        title="OEM Part Rolodex"
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

      {oemParts.map((part, index) => {
        if (editingId === part.id) return null;

        const isLast = index === oemParts.length - 1 && !showForm;

        return (
          <View key={part.id}>
            <Pressable
              onPress={() => startEdit(part)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
              <View style={styles.partContent}>
                <Text style={styles.partName}>{part.name}</Text>
                <Text style={styles.partNumber}>{part.partNumber}</Text>
                {part.notes ? <Text style={styles.partNotes}>{part.notes}</Text> : null}
              </View>
              <Pressable
                onPress={() => handleDelete(part)}
                hitSlop={8}
                style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
                <Ionicons name="trash-outline" size={18} color={Theme.colors.textMuted} />
              </Pressable>
            </Pressable>
            {!isLast ? <Divider /> : null}
          </View>
        );
      })}

      {showForm ? (
        <View style={styles.form}>
          {oemParts.length > 0 && editingId == null ? <Divider /> : null}
          <Text style={styles.formTitle}>{editingId != null ? 'Edit Part' : 'Add Part'}</Text>

          <Text style={styles.label}>Part name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Spark Plug"
            placeholderTextColor={Theme.colors.textMuted}
          />

          <Text style={styles.label}>OEM part number</Text>
          <TextInput
            style={styles.input}
            value={partNumber}
            onChangeText={setPartNumber}
            placeholder="e.g. CPR8EA-9"
            placeholderTextColor={Theme.colors.textMuted}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any extra details"
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
              disabled={!name.trim() || !partNumber.trim()}
              style={({ pressed }) => [
                styles.saveFormButton,
                (!name.trim() || !partNumber.trim()) && styles.saveFormButtonDisabled,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.saveFormText}>{editingId != null ? 'Update' : 'Add'}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {oemParts.length === 0 && !showForm ? (
        <Text style={styles.emptyText}>No parts yet. Tap + to add one.</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  addButton: {
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm + 2,
    paddingLeft: Theme.spacing.md,
    paddingRight: Theme.spacing.sm,
  },
  partContent: {
    flex: 1,
  },
  partName: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.colors.text,
  },
  partNumber: {
    fontSize: 15,
    color: Theme.colors.accent,
    marginTop: 2,
    fontFamily: 'SpaceMono',
  },
  partNotes: {
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
