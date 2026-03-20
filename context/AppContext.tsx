import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData, Contact, Interaction, Settings, Tier, Feeling } from '../types';

const STORAGE_KEY = 'reach_app_data';

const DEFAULT_SETTINGS: Settings = {
  cadence: 'Daily',
  notificationTime: '09:00',
  notificationsEnabled: true,
};

const DEFAULT_DATA: AppData = {
  contacts: [],
  interactions: [],
  settings: DEFAULT_SETTINGS,
  onboarded: false,
};

interface AppContextValue {
  data: AppData;
  // Contacts
  addContact: (contact: Omit<Contact, 'id' | 'addedAt'>) => Promise<Contact>;
  addContacts: (contacts: Omit<Contact, 'id' | 'addedAt'>[]) => Promise<void>;
  updateContactTier: (contactId: string, tier: Tier) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  // Interactions
  logInteraction: (contactId: string, feeling: Feeling, note: string) => Promise<void>;
  getInteractionsForContact: (contactId: string) => Interaction[];
  // Settings
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  // Onboarding
  completeOnboarding: () => Promise<void>;
  // Today's nudge
  getTodayContact: () => Contact | null;
  deferContact: (contactId: string) => void;
  // Stats
  getWeeklyInteractions: () => { date: string; contact: Contact | null; feeling: Feeling | null }[];
  isLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [deferredIds, setDeferredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (next: AppData) => {
    setData(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addContact = useCallback(async (contact: Omit<Contact, 'id' | 'addedAt'>): Promise<Contact> => {
    const newContact: Contact = {
      ...contact,
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      addedAt: new Date().toISOString(),
    };
    setData((prev) => {
      const next = { ...prev, contacts: [...prev.contacts, newContact] };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return newContact;
  }, []);

  const addContacts = useCallback(async (contacts: Omit<Contact, 'id' | 'addedAt'>[]) => {
    const now = Date.now();
    const newContacts: Contact[] = contacts.map((c, i) => ({
      ...c,
      id: `c_${now + i}_${Math.random().toString(36).slice(2)}`,
      addedAt: new Date().toISOString(),
    }));
    setData((prev) => {
      const next = { ...prev, contacts: [...prev.contacts, ...newContacts] };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateContactTier = useCallback(async (contactId: string, tier: Tier) => {
    setData((prev) => {
      const next = {
        ...prev,
        contacts: prev.contacts.map((c) => (c.id === contactId ? { ...c, tier } : c)),
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteContact = useCallback(async (contactId: string) => {
    setData((prev) => {
      const next = {
        ...prev,
        contacts: prev.contacts.filter((c) => c.id !== contactId),
        interactions: prev.interactions.filter((i) => i.contactId !== contactId),
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logInteraction = useCallback(async (contactId: string, feeling: Feeling, note: string) => {
    const interaction: Interaction = {
      id: `i_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      contactId,
      date: new Date().toISOString(),
      feeling,
      note,
    };
    setData((prev) => {
      const next = { ...prev, interactions: [interaction, ...prev.interactions] };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getInteractionsForContact = useCallback((contactId: string): Interaction[] => {
    return data.interactions.filter((i) => i.contactId === contactId);
  }, [data.interactions]);

  const updateSettings = useCallback(async (settings: Partial<Settings>) => {
    setData((prev) => {
      const next = { ...prev, settings: { ...prev.settings, ...settings } };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    setData((prev) => {
      const next = { ...prev, onboarded: true };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Pick the contact due for a nudge today (least recently contacted, not deferred)
  const getTodayContact = useCallback((): Contact | null => {
    if (data.contacts.length === 0) return null;

    const eligible = data.contacts.filter((c) => !deferredIds.has(c.id));
    if (eligible.length === 0) return data.contacts[0];

    // Sort by last interaction date (oldest first)
    const sorted = [...eligible].sort((a, b) => {
      const lastA = data.interactions.filter((i) => i.contactId === a.id)[0]?.date ?? a.addedAt;
      const lastB = data.interactions.filter((i) => i.contactId === b.id)[0]?.date ?? b.addedAt;
      return new Date(lastA).getTime() - new Date(lastB).getTime();
    });

    return sorted[0];
  }, [data.contacts, data.interactions, deferredIds]);

  const deferContact = useCallback((contactId: string) => {
    setDeferredIds((prev) => new Set([...prev, contactId]));
  }, []);

  // Return last 7 days with interaction data per day
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
        feeling: (interaction?.feeling ?? null) as any,
      });
    }
    return result;
  }, [data.contacts, data.interactions]);

  return (
    <AppContext.Provider
      value={{
        data,
        addContact,
        addContacts,
        updateContactTier,
        deleteContact,
        logInteraction,
        getInteractionsForContact,
        updateSettings,
        completeOnboarding,
        getTodayContact,
        deferContact,
        getWeeklyInteractions,
        isLoading,
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
