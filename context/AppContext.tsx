import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData, Contact, Interaction, Settings, Tier, Feeling, TierSuggestion } from '../types';
import { getTierSuggestion, urgencyScore } from '../utils/tierLogic';
import { scheduleNextNudge } from '../utils/notifications';

const STORAGE_KEY = 'reach_app_data';

const DEFAULT_SETTINGS: Settings = {
  cadence: 'Daily',
  notificationTime: '09:00',
  notificationsEnabled: true,
  engagementHours: [],
};

const DEFAULT_DATA: AppData = {
  contacts: [],
  interactions: [],
  settings: DEFAULT_SETTINGS,
  onboarded: false,
};

interface ActiveTierSuggestion {
  contactId: string;
  suggestion: TierSuggestion;
}

interface AppContextValue {
  data: AppData;
  isLoading: boolean;
  // Tier suggestion
  tierSuggestion: ActiveTierSuggestion | null;
  acceptTierSuggestion: (contactId: string, tier: Tier) => Promise<void>;
  dismissTierSuggestion: () => void;
  // Contacts
  addContact: (contact: Omit<Contact, 'id' | 'addedAt' | 'tierAssessed'>) => Promise<Contact>;
  addContacts: (contacts: Omit<Contact, 'id' | 'addedAt' | 'tierAssessed'>[]) => Promise<void>;
  updateContactTier: (contactId: string, tier: Tier, assessed?: boolean) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  // Interactions
  logInteraction: (contactId: string, feeling: Feeling, note: string) => Promise<void>;
  getInteractionsForContact: (contactId: string) => Interaction[];
  // Settings
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  recordEngagementHour: (hour: number) => Promise<void>;
  // Onboarding
  completeOnboarding: () => Promise<void>;
  // Today's nudge
  getTodayContact: () => Contact | null;
  deferContact: (contactId: string) => void;
  // Stats
  getWeeklyInteractions: () => { date: string; contact: Contact | null; feeling: Feeling | null }[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [deferredIds, setDeferredIds] = useState<Set<string>>(new Set());
  const [tierSuggestion, setTierSuggestion] = useState<ActiveTierSuggestion | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AppData = JSON.parse(raw);
        // Backfill tierAssessed for contacts that predate the field
        parsed.contacts = parsed.contacts.map((c) =>
          c.tierAssessed === undefined ? { ...c, tierAssessed: false } : c
        );
        // Backfill engagementHours for settings that predate the field
        if (!parsed.settings.engagementHours) {
          parsed.settings.engagementHours = [];
        }
        setData(parsed);
      }
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const persist = useCallback((next: AppData) => {
    setData(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
    return next;
  }, []);

  // ─── Tier suggestion ────────────────────────────────────────────────────────

  const evaluateTierSuggestion = useCallback(
    (contactId: string, contacts: Contact[], interactions: Interaction[]) => {
      const contact = contacts.find((c) => c.id === contactId);
      if (!contact) return;
      const contactInteractions = interactions.filter((i) => i.contactId === contactId);
      const suggestion = getTierSuggestion(contact, contactInteractions);
      if (suggestion) {
        setTierSuggestion({ contactId, suggestion });
      }
    },
    []
  );

  const acceptTierSuggestion = useCallback(
    async (contactId: string, tier: Tier) => {
      setData((prev) => {
        const next = {
          ...prev,
          contacts: prev.contacts.map((c) =>
            c.id === contactId ? { ...c, tier, tierAssessed: true } : c
          ),
        };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
        scheduleNextNudge(next.settings, next.contacts, next.interactions);
        return next;
      });
      setTierSuggestion(null);
    },
    []
  );

  const dismissTierSuggestion = useCallback(() => {
    setTierSuggestion(null);
  }, []);

  // ─── Contacts ───────────────────────────────────────────────────────────────

  const addContact = useCallback(
    async (contact: Omit<Contact, 'id' | 'addedAt' | 'tierAssessed'>): Promise<Contact> => {
      const newContact: Contact = {
        ...contact,
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        addedAt: new Date().toISOString(),
        tierAssessed: false,
      };
      setData((prev) => {
        const next = { ...prev, contacts: [...prev.contacts, newContact] };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
        scheduleNextNudge(next.settings, next.contacts, next.interactions);
        return next;
      });
      return newContact;
    },
    []
  );

  const addContacts = useCallback(
    async (contacts: Omit<Contact, 'id' | 'addedAt' | 'tierAssessed'>[]) => {
      const now = Date.now();
      const newContacts: Contact[] = contacts.map((c, i) => ({
        ...c,
        id: `c_${now + i}_${Math.random().toString(36).slice(2)}`,
        addedAt: new Date().toISOString(),
        tierAssessed: false,
      }));
      setData((prev) => {
        const next = { ...prev, contacts: [...prev.contacts, ...newContacts] };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
        scheduleNextNudge(next.settings, next.contacts, next.interactions);
        return next;
      });
    },
    []
  );

  const updateContactTier = useCallback(
    async (contactId: string, tier: Tier, assessed = true) => {
      setData((prev) => {
        const next = {
          ...prev,
          contacts: prev.contacts.map((c) =>
            c.id === contactId ? { ...c, tier, tierAssessed: assessed } : c
          ),
        };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
        scheduleNextNudge(next.settings, next.contacts, next.interactions);
        return next;
      });
    },
    []
  );

  const deleteContact = useCallback(async (contactId: string) => {
    setData((prev) => {
      const next = {
        ...prev,
        contacts: prev.contacts.filter((c) => c.id !== contactId),
        interactions: prev.interactions.filter((i) => i.contactId !== contactId),
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
      scheduleNextNudge(next.settings, next.contacts, next.interactions);
      return next;
    });
    setTierSuggestion((prev) => (prev?.contactId === contactId ? null : prev));
  }, []);

  // ─── Interactions ───────────────────────────────────────────────────────────

  const logInteraction = useCallback(
    async (contactId: string, feeling: Feeling, note: string) => {
      const interaction: Interaction = {
        id: `i_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        contactId,
        date: new Date().toISOString(),
        feeling,
        note,
      };
      setData((prev) => {
        const nextInteractions = [interaction, ...prev.interactions];
        const next = { ...prev, interactions: nextInteractions };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
        scheduleNextNudge(next.settings, next.contacts, next.interactions);
        // Evaluate tier suggestion after state update
        const contact = prev.contacts.find((c) => c.id === contactId);
        if (contact) {
          const contactInteractions = nextInteractions.filter((i) => i.contactId === contactId);
          const suggestion = getTierSuggestion(contact, contactInteractions);
          if (suggestion) {
            setTierSuggestion({ contactId, suggestion });
          }
        }
        return next;
      });
    },
    []
  );

  const getInteractionsForContact = useCallback(
    (contactId: string): Interaction[] =>
      data.interactions.filter((i) => i.contactId === contactId),
    [data.interactions]
  );

  // ─── Settings ───────────────────────────────────────────────────────────────

  const updateSettings = useCallback(async (settings: Partial<Settings>) => {
    setData((prev) => {
      const next = { ...prev, settings: { ...prev.settings, ...settings } };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
      scheduleNextNudge(next.settings, next.contacts, next.interactions);
      return next;
    });
  }, []);

  const recordEngagementHour = useCallback(async (hour: number) => {
    setData((prev) => {
      const engagementHours = [...(prev.settings.engagementHours ?? []), hour].slice(-50);
      const next = { ...prev, settings: { ...prev.settings, engagementHours } };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
      return next;
    });
  }, []);

  // ─── Onboarding ─────────────────────────────────────────────────────────────

  const completeOnboarding = useCallback(async () => {
    setData((prev) => {
      const next = { ...prev, onboarded: true };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
      scheduleNextNudge(next.settings, next.contacts, next.interactions);
      return next;
    });
  }, []);

  // ─── Nudge logic ────────────────────────────────────────────────────────────

  const getTodayContact = useCallback((): Contact | null => {
    if (data.contacts.length === 0) return null;

    const eligible = data.contacts.filter((c) => !deferredIds.has(c.id));
    const pool = eligible.length > 0 ? eligible : data.contacts;

    const sorted = [...pool].sort((a, b) => {
      const aScore = urgencyScore(
        a,
        data.interactions.filter((i) => i.contactId === a.id)
      );
      const bScore = urgencyScore(
        b,
        data.interactions.filter((i) => i.contactId === b.id)
      );
      return bScore - aScore;
    });

    const top = sorted[0];

    // Check for cold-contact tier suggestion when surfacing this contact
    if (top && top.tierAssessed) {
      const contactInteractions = data.interactions.filter((i) => i.contactId === top.id);
      const suggestion = getTierSuggestion(top, contactInteractions);
      if (suggestion?.type === 'cold_check' && !tierSuggestion) {
        setTierSuggestion({ contactId: top.id, suggestion });
      }
    }

    return top;
  }, [data.contacts, data.interactions, deferredIds, tierSuggestion]);

  const deferContact = useCallback((contactId: string) => {
    setDeferredIds((prev) => new Set([...prev, contactId]));
  }, []);

  // ─── Weekly stats ────────────────────────────────────────────────────────────

  const getWeeklyInteractions = useCallback(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const interaction = data.interactions.find((int) => {
        const intDate = new Date(int.date);
        return intDate >= d && intDate <= dayEnd;
      });

      const contact = interaction
        ? data.contacts.find((c) => c.id === interaction.contactId) ?? null
        : null;

      result.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        contact,
        feeling: (interaction?.feeling ?? null) as Feeling | null,
      });
    }
    return result;
  }, [data.contacts, data.interactions]);

  return (
    <AppContext.Provider
      value={{
        data,
        isLoading,
        tierSuggestion,
        acceptTierSuggestion,
        dismissTierSuggestion,
        addContact,
        addContacts,
        updateContactTier,
        deleteContact,
        logInteraction,
        getInteractionsForContact,
        updateSettings,
        recordEngagementHour,
        completeOnboarding,
        getTodayContact,
        deferContact,
        getWeeklyInteractions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
