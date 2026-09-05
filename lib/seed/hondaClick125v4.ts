import type { OemPartInput } from '@/lib/types';

export const DEFAULT_BIKE = {
  make: 'Honda',
  model: 'Click 125 v4',
};

export type MaintenanceSeed = {
  name: string;
  intervalKm: number | null;
  intervalMonths: number | null;
  spec: string | null;
  sortOrder: number;
};

export const HONDA_CLICK_125_V4_MAINTENANCE: MaintenanceSeed[] = [
  {
    name: 'Engine Oil',
    intervalKm: 1500,
    intervalMonths: null,
    spec: '10W-30 JASO MB, 0.8L',
    sortOrder: 1,
  },
  {
    name: 'Gear Oil',
    intervalKm: 4000,
    intervalMonths: null,
    spec: '120ml',
    sortOrder: 2,
  },
  {
    name: 'CVT Cleaning & Regrease',
    intervalKm: 6000,
    intervalMonths: null,
    spec: null,
    sortOrder: 3,
  },
  {
    name: 'Air Filter',
    intervalKm: 8000,
    intervalMonths: null,
    spec: null,
    sortOrder: 4,
  },
  {
    name: 'Spark Plug',
    intervalKm: 8000,
    intervalMonths: null,
    spec: 'Standard CPR8EA-9',
    sortOrder: 5,
  },
  {
    name: 'Drive Belt & Sliders',
    intervalKm: 16000,
    intervalMonths: null,
    spec: null,
    sortOrder: 6,
  },
  {
    name: 'Coolant Flush',
    intervalKm: 24000,
    intervalMonths: 24,
    spec: null,
    sortOrder: 7,
  },
  {
    name: 'Brake Fluid Flush',
    intervalKm: null,
    intervalMonths: 24,
    spec: 'DOT 4',
    sortOrder: 8,
  },
];

export const HONDA_CLICK_125_V4_OEM_PARTS: OemPartInput[] = [
  { name: 'Spark Plug', partNumber: 'CPR8EA-9', notes: 'Standard NGK equivalent' },
  { name: 'Engine Oil', partNumber: '10W-30 JASO MB', notes: '0.8L capacity' },
  { name: 'Brake Fluid', partNumber: 'DOT 4', notes: 'Flush every 2 years' },
  { name: 'Drive Belt', partNumber: '23100-K2F-003', notes: 'Honda OEM reference' },
];
