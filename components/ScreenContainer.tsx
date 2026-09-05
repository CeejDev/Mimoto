import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Theme } from '@/constants/Theme';

type ScreenContainerProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function ScreenContainer({ title, subtitle, children }: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children ?? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Coming in a future phase</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: Theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: Theme.spacing.xs,
    fontSize: 15,
    color: Theme.colors.textSecondary,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  placeholderText: {
    fontSize: 16,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
});
