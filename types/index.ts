export type Tier = 'Drifted' | 'Reconnecting' | 'Familiar' | 'Back';
export type Feeling = 'Good' | 'Quiet' | 'Hard';
export type Cadence = 'Daily' | 'Every 2 days' | 'Weekdays only' | 'Surprise';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  tier: Tier;
  tierAssessed: boolean; // false until user explicitly sets tier post-interaction
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
  engagementHours: number[]; // hour-of-day (0–23) recorded on each app open
}

export interface AppData {
  contacts: Contact[];
  interactions: Interaction[];
  settings: Settings;
  onboarded: boolean;
}

export type TierSuggestion =
  | { type: 'initial_assessment'; reason: 'first_interaction' | 'second_interaction' }
  | { type: 'upgrade'; current: Tier; suggested: Tier; reason: string }
  | { type: 'downgrade'; current: Tier; suggested: Tier; reason: string }
  | { type: 'cold_check'; current: Tier; daysSince: number };
