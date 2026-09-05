import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Divider, SectionHeader } from '@/components/ui/Card';
import { Theme } from '@/constants/Theme';
import { useDatabase } from '@/context/DatabaseContext';
import type { GloveboxDocType } from '@/lib/types';

const DOC_LABELS: Record<GloveboxDocType, string> = {
  registration: 'Registration',
  insurance: 'Insurance',
  license: 'Driver\'s License',
};

const DOC_ICONS: Record<GloveboxDocType, keyof typeof Ionicons.glyphMap> = {
  registration: 'document-text-outline',
  insurance: 'shield-checkmark-outline',
  license: 'card-outline',
};

export function GloveboxCard() {
  const { gloveboxDocuments } = useDatabase();

  return (
    <Card>
      <SectionHeader
        icon={<Ionicons name="folder-open-outline" size={20} color={Theme.colors.accent} />}
        title="Digital Glovebox"
      />
      <Text style={styles.subtitle}>Registration, insurance, and license photos</Text>

      {gloveboxDocuments.map((doc, index) => {
        const isLast = index === gloveboxDocuments.length - 1;
        const hasPhoto = doc.uri != null;

        return (
          <View key={doc.id}>
            <View style={styles.row}>
              <Ionicons
                name={DOC_ICONS[doc.type]}
                size={22}
                color={Theme.colors.textSecondary}
                style={styles.icon}
              />
              <View style={styles.content}>
                <Text style={styles.docName}>{DOC_LABELS[doc.type]}</Text>
                <Text style={styles.docStatus}>
                  {hasPhoto ? 'Document on file' : 'No photo uploaded'}
                </Text>
              </View>
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonText}>Phase 5</Text>
              </View>
            </View>
            {!isLast ? <Divider /> : null}
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm + 2,
    paddingRight: Theme.spacing.md,
  },
  icon: {
    width: 40,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.colors.text,
  },
  docStatus: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  comingSoon: {
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.radius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
  },
  comingSoonText: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    fontWeight: '500',
  },
});
