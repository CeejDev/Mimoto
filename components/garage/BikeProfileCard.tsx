import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Card, SectionHeader } from '@/components/ui/Card';
import { Theme } from '@/constants/Theme';
import { useDatabase } from '@/context/DatabaseContext';

export function BikeProfileCard() {
  const { bike, updateBikeProfile } = useDatabase();
  const [make, setMake] = useState(bike?.make ?? '');
  const [model, setModel] = useState(bike?.model ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (bike) {
      setMake(bike.make);
      setModel(bike.model);
    }
  }, [bike]);

  const isDirty = bike ? make !== bike.make || model !== bike.model : false;

  const handleSave = async () => {
    if (!make.trim() || !model.trim()) return;

    setIsSaving(true);
    try {
      await updateBikeProfile(make.trim(), model.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon={<MaterialCommunityIcons name="motorbike" size={20} color={Theme.colors.accent} />}
        title="Bike Profile"
        action={
          isDirty ? (
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
              <Text style={styles.saveButtonText}>{isSaving ? 'Saving…' : 'Save'}</Text>
            </Pressable>
          ) : saved ? (
            <Text style={styles.savedText}>Saved</Text>
          ) : null
        }
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Make</Text>
        <TextInput
          style={styles.input}
          value={make}
          onChangeText={setMake}
          placeholder="e.g. Honda"
          placeholderTextColor={Theme.colors.textMuted}
          autoCapitalize="words"
        />
      </View>

      <View style={[styles.fieldGroup, styles.lastField]}>
        <Text style={styles.label}>Model</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="e.g. Click 125 v4"
          placeholderTextColor={Theme.colors.textMuted}
          autoCapitalize="words"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
  },
  lastField: {
    paddingBottom: Theme.spacing.md,
  },
  label: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.radius.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12,
    fontSize: 17,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
  },
  saveButton: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
  },
  saveButtonText: {
    color: Theme.colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  savedText: {
    color: Theme.colors.success,
    fontSize: 14,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.6,
  },
});
