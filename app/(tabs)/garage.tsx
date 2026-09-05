import { ScrollView, StyleSheet } from 'react-native';

import { BikeProfileCard } from '@/components/garage/BikeProfileCard';
import { GloveboxCard } from '@/components/garage/GloveboxCard';
import { MaintenanceScheduleCard } from '@/components/garage/MaintenanceScheduleCard';
import { OemRolodexCard } from '@/components/garage/OemRolodexCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/Theme';

export default function GarageScreen() {
  return (
    <ScreenContainer title="Garage">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <BikeProfileCard />
        <MaintenanceScheduleCard />
        <OemRolodexCard />
        <GloveboxCard />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: Theme.spacing.xl,
  },
});
