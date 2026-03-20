export type Tier = 'Drifted' | 'Reconnecting' | 'Familiar' | 'Back';
export type Feeling = 'Good' | 'Quiet' | 'Hard';
export type Cadence = 'Daily' | 'Every 2 days' | 'Weekdays only' | 'Surprise';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  tier: Tier;
  addedAt: string; // ISO date string
}

export interface Interaction {
  id: string;
  contactId: string;
  date: string; // ISO date string
  feeling: Feeling;
  note: string;
}

export interface Settings {
  cadence: Cadence;
  notificationTime: string; // 'HH:MM' or 'surprise'
  notificationsEnabled: boolean;
}

export interface AppData {
  contacts: Contact[];
  interactions: Interaction[];
  settings: Settings;
  onboarded: boolean;
}
