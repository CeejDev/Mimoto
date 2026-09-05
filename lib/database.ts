import * as SQLite from 'expo-sqlite';

import {
  DEFAULT_BIKE,
  HONDA_CLICK_125_V4_MAINTENANCE,
  HONDA_CLICK_125_V4_OEM_PARTS,
} from '@/lib/seed/hondaClick125v4';
import type {
  Bike,
  GloveboxDocument,
  MaintenanceItem,
  MaintenanceItemInput,
  OemPart,
  OemPartInput,
} from '@/lib/types';

const DB_NAME = 'mimoto.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

type BikeRow = {
  id: number;
  make: string;
  model: string;
  current_odometer: number;
  created_at: string;
};

type MaintenanceRow = {
  id: number;
  bike_id: number;
  name: string;
  interval_km: number | null;
  interval_months: number | null;
  spec: string | null;
  sort_order: number;
  last_service_km: number;
  last_service_date: string | null;
};

type OemPartRow = {
  id: number;
  bike_id: number;
  name: string;
  part_number: string;
  notes: string | null;
};

type GloveboxRow = {
  id: number;
  bike_id: number;
  type: string;
  uri: string | null;
  updated_at: string | null;
};

function mapBike(row: BikeRow): Bike {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    currentOdometer: row.current_odometer,
    createdAt: row.created_at,
  };
}

function mapMaintenance(row: MaintenanceRow): MaintenanceItem {
  return {
    id: row.id,
    bikeId: row.bike_id,
    name: row.name,
    intervalKm: row.interval_km,
    intervalMonths: row.interval_months,
    spec: row.spec,
    sortOrder: row.sort_order,
    lastServiceKm: row.last_service_km,
    lastServiceDate: row.last_service_date,
  };
}

function mapOemPart(row: OemPartRow): OemPart {
  return {
    id: row.id,
    bikeId: row.bike_id,
    name: row.name,
    partNumber: row.part_number,
    notes: row.notes,
  };
}

function mapGlovebox(row: GloveboxRow): GloveboxDocument {
  return {
    id: row.id,
    bikeId: row.bike_id,
    type: row.type as GloveboxDocument['type'],
    uri: row.uri,
    updatedAt: row.updated_at,
  };
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbInstance;
}

async function createTables(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bikes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      current_odometer INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS maintenance_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bike_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      interval_km INTEGER,
      interval_months INTEGER,
      spec TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      last_service_km INTEGER NOT NULL DEFAULT 0,
      last_service_date TEXT,
      FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS oem_parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bike_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      part_number TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS glovebox_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bike_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      uri TEXT,
      updated_at TEXT,
      FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE,
      UNIQUE(bike_id, type)
    );
  `);
}

async function seedDatabase(db: SQLite.SQLiteDatabase) {
  const meta = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    ['seeded'],
  );

  if (meta?.value === 'true') {
    return;
  }

  const result = await db.runAsync(
    'INSERT INTO bikes (make, model, current_odometer) VALUES (?, ?, ?)',
    [DEFAULT_BIKE.make, DEFAULT_BIKE.model, 0],
  );
  const bikeId = result.lastInsertRowId;

  for (const item of HONDA_CLICK_125_V4_MAINTENANCE) {
    await db.runAsync(
      `INSERT INTO maintenance_items
        (bike_id, name, interval_km, interval_months, spec, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bikeId, item.name, item.intervalKm, item.intervalMonths, item.spec, item.sortOrder],
    );
  }

  for (const part of HONDA_CLICK_125_V4_OEM_PARTS) {
    await db.runAsync(
      'INSERT INTO oem_parts (bike_id, name, part_number, notes) VALUES (?, ?, ?, ?)',
      [bikeId, part.name, part.partNumber, part.notes ?? null],
    );
  }

  for (const type of ['registration', 'insurance', 'license'] as const) {
    await db.runAsync(
      'INSERT INTO glovebox_documents (bike_id, type) VALUES (?, ?)',
      [bikeId, type],
    );
  }

  await db.runAsync('INSERT INTO app_meta (key, value) VALUES (?, ?)', ['seeded', 'true']);
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();
  await createTables(db);
  await seedDatabase(db);
}

export async function getBike(): Promise<Bike | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<BikeRow>('SELECT * FROM bikes ORDER BY id LIMIT 1');
  return row ? mapBike(row) : null;
}

export async function updateBikeProfile(make: string, model: string): Promise<Bike | null> {
  const db = await getDatabase();
  const bike = await getBike();
  if (!bike) return null;

  await db.runAsync('UPDATE bikes SET make = ?, model = ? WHERE id = ?', [make, model, bike.id]);
  return getBike();
}

export async function getMaintenanceItems(bikeId: number): Promise<MaintenanceItem[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<MaintenanceRow>(
    `SELECT * FROM maintenance_items
     WHERE bike_id = ?
     ORDER BY
       CASE WHEN interval_km IS NULL THEN 1 ELSE 0 END,
       interval_km ASC,
       CASE WHEN interval_months IS NULL THEN 1 ELSE 0 END,
       interval_months ASC,
       name ASC`,
    [bikeId],
  );
  return rows.map(mapMaintenance);
}

export async function addMaintenanceItem(
  bikeId: number,
  input: MaintenanceItemInput,
): Promise<MaintenanceItem> {
  const db = await getDatabase();
  const maxOrder = await db.getFirstAsync<{ max_order: number }>(
    'SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM maintenance_items WHERE bike_id = ?',
    [bikeId],
  );

  const result = await db.runAsync(
    `INSERT INTO maintenance_items
      (bike_id, name, interval_km, interval_months, spec, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      bikeId,
      input.name.trim(),
      input.intervalKm ?? null,
      input.intervalMonths ?? null,
      input.spec?.trim() ?? null,
      (maxOrder?.max_order ?? 0) + 1,
    ],
  );

  const row = await db.getFirstAsync<MaintenanceRow>('SELECT * FROM maintenance_items WHERE id = ?', [
    result.lastInsertRowId,
  ]);

  if (!row) {
    throw new Error('Failed to create maintenance item');
  }

  return mapMaintenance(row);
}

export async function updateMaintenanceItem(
  id: number,
  input: MaintenanceItemInput,
): Promise<MaintenanceItem | null> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE maintenance_items
     SET name = ?, interval_km = ?, interval_months = ?, spec = ?
     WHERE id = ?`,
    [
      input.name.trim(),
      input.intervalKm ?? null,
      input.intervalMonths ?? null,
      input.spec?.trim() ?? null,
      id,
    ],
  );

  const row = await db.getFirstAsync<MaintenanceRow>('SELECT * FROM maintenance_items WHERE id = ?', [id]);
  return row ? mapMaintenance(row) : null;
}

export async function deleteMaintenanceItem(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM maintenance_items WHERE id = ?', [id]);
}

export async function getOemParts(bikeId: number): Promise<OemPart[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<OemPartRow>(
    'SELECT * FROM oem_parts WHERE bike_id = ? ORDER BY name ASC',
    [bikeId],
  );
  return rows.map(mapOemPart);
}

export async function addOemPart(bikeId: number, input: OemPartInput): Promise<OemPart> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO oem_parts (bike_id, name, part_number, notes) VALUES (?, ?, ?, ?)',
    [bikeId, input.name.trim(), input.partNumber.trim(), input.notes?.trim() ?? null],
  );

  const row = await db.getFirstAsync<OemPartRow>('SELECT * FROM oem_parts WHERE id = ?', [
    result.lastInsertRowId,
  ]);

  if (!row) {
    throw new Error('Failed to create OEM part');
  }

  return mapOemPart(row);
}

export async function updateOemPart(id: number, input: OemPartInput): Promise<OemPart | null> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE oem_parts SET name = ?, part_number = ?, notes = ? WHERE id = ?',
    [input.name.trim(), input.partNumber.trim(), input.notes?.trim() ?? null, id],
  );

  const row = await db.getFirstAsync<OemPartRow>('SELECT * FROM oem_parts WHERE id = ?', [id]);
  return row ? mapOemPart(row) : null;
}

export async function deleteOemPart(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM oem_parts WHERE id = ?', [id]);
}

export async function getGloveboxDocuments(bikeId: number): Promise<GloveboxDocument[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<GloveboxRow>(
    'SELECT * FROM glovebox_documents WHERE bike_id = ? ORDER BY type ASC',
    [bikeId],
  );
  return rows.map(mapGlovebox);
}

export function formatMaintenanceInterval(item: MaintenanceItem): string {
  const parts: string[] = [];

  if (item.intervalKm != null) {
    parts.push(`${item.intervalKm.toLocaleString()} km`);
  }

  if (item.intervalMonths != null) {
    const years = item.intervalMonths / 12;
    parts.push(years === 1 ? '1 year' : years === 2 ? '2 years' : `${item.intervalMonths} months`);
  }

  if (parts.length === 0) return 'As needed';
  if (parts.length === 1) return parts[0];
  return parts.join(' or ');
}
