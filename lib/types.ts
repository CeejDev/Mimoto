export type Bike = {
  id: number;
  make: string;
  model: string;
  currentOdometer: number;
  createdAt: string;
};

export type MaintenanceItem = {
  id: number;
  bikeId: number;
  name: string;
  intervalKm: number | null;
  intervalMonths: number | null;
  spec: string | null;
  sortOrder: number;
  lastServiceKm: number;
  lastServiceDate: string | null;
};

export type OemPart = {
  id: number;
  bikeId: number;
  name: string;
  partNumber: string;
  notes: string | null;
};

export type GloveboxDocType = 'registration' | 'insurance' | 'license';

export type GloveboxDocument = {
  id: number;
  bikeId: number;
  type: GloveboxDocType;
  uri: string | null;
  updatedAt: string | null;
};

export type MaintenanceItemInput = {
  name: string;
  intervalKm?: number | null;
  intervalMonths?: number | null;
  spec?: string;
};

export type OemPartInput = {
  name: string;
  partNumber: string;
  notes?: string;
};
