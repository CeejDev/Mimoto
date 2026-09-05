import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/Theme';
import {
  addMaintenanceItem as dbAddMaintenanceItem,
  addOemPart as dbAddOemPart,
  deleteMaintenanceItem as dbDeleteMaintenanceItem,
  deleteOemPart as dbDeleteOemPart,
  getBike,
  getGloveboxDocuments,
  getMaintenanceItems,
  getOemParts,
  initializeDatabase,
  updateBikeProfile as dbUpdateBikeProfile,
  updateMaintenanceItem as dbUpdateMaintenanceItem,
  updateOemPart as dbUpdateOemPart,
} from '@/lib/database';
import type {
  Bike,
  GloveboxDocument,
  MaintenanceItem,
  MaintenanceItemInput,
  OemPart,
  OemPartInput,
} from '@/lib/types';

type DatabaseContextValue = {
  isReady: boolean;
  bike: Bike | null;
  maintenanceItems: MaintenanceItem[];
  oemParts: OemPart[];
  gloveboxDocuments: GloveboxDocument[];
  refresh: () => Promise<void>;
  updateBikeProfile: (make: string, model: string) => Promise<void>;
  addMaintenanceItem: (input: MaintenanceItemInput) => Promise<void>;
  updateMaintenanceItem: (id: number, input: MaintenanceItemInput) => Promise<void>;
  deleteMaintenanceItem: (id: number) => Promise<void>;
  addOemPart: (input: OemPartInput) => Promise<void>;
  updateOemPart: (id: number, input: OemPartInput) => Promise<void>;
  deleteOemPart: (id: number) => Promise<void>;
};

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bike, setBike] = useState<Bike | null>(null);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [oemParts, setOemParts] = useState<OemPart[]>([]);
  const [gloveboxDocuments, setGloveboxDocuments] = useState<GloveboxDocument[]>([]);

  const loadData = useCallback(async () => {
    const currentBike = await getBike();
    setBike(currentBike);

    if (!currentBike) {
      setMaintenanceItems([]);
      setOemParts([]);
      setGloveboxDocuments([]);
      return;
    }

    const [items, parts, docs] = await Promise.all([
      getMaintenanceItems(currentBike.id),
      getOemParts(currentBike.id),
      getGloveboxDocuments(currentBike.id),
    ]);

    setMaintenanceItems(items);
    setOemParts(parts);
    setGloveboxDocuments(docs);
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await initializeDatabase();
        if (mounted) {
          await loadData();
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize database');
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loadData]);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const updateBikeProfile = useCallback(
    async (make: string, model: string) => {
      await dbUpdateBikeProfile(make, model);
      await loadData();
    },
    [loadData],
  );

  const addMaintenanceItem = useCallback(
    async (input: MaintenanceItemInput) => {
      if (!bike) return;
      await dbAddMaintenanceItem(bike.id, input);
      await loadData();
    },
    [bike, loadData],
  );

  const updateMaintenanceItem = useCallback(
    async (id: number, input: MaintenanceItemInput) => {
      await dbUpdateMaintenanceItem(id, input);
      await loadData();
    },
    [loadData],
  );

  const deleteMaintenanceItem = useCallback(
    async (id: number) => {
      await dbDeleteMaintenanceItem(id);
      await loadData();
    },
    [loadData],
  );

  const addOemPart = useCallback(
    async (input: OemPartInput) => {
      if (!bike) return;
      await dbAddOemPart(bike.id, input);
      await loadData();
    },
    [bike, loadData],
  );

  const updateOemPart = useCallback(
    async (id: number, input: OemPartInput) => {
      await dbUpdateOemPart(id, input);
      await loadData();
    },
    [loadData],
  );

  const deleteOemPart = useCallback(
    async (id: number) => {
      await dbDeleteOemPart(id);
      await loadData();
    },
    [loadData],
  );

  const value = useMemo(
    () => ({
      isReady,
      bike,
      maintenanceItems,
      oemParts,
      gloveboxDocuments,
      refresh,
      updateBikeProfile,
      addMaintenanceItem,
      updateMaintenanceItem,
      deleteMaintenanceItem,
      addOemPart,
      updateOemPart,
      deleteOemPart,
    }),
    [
      isReady,
      bike,
      maintenanceItems,
      oemParts,
      gloveboxDocuments,
      refresh,
      updateBikeProfile,
      addMaintenanceItem,
      updateMaintenanceItem,
      deleteMaintenanceItem,
      addOemPart,
      updateOemPart,
      deleteOemPart,
    ],
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Theme.colors.accent} />
      </View>
    );
  }

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background,
  },
  errorText: {
    color: Theme.colors.text,
    fontSize: 16,
    paddingHorizontal: Theme.spacing.lg,
    textAlign: 'center',
  },
});
