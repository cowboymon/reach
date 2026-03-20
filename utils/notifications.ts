import * as Notifications from 'expo-notifications';
import type { Contact, Interaction, Settings, Cadence } from '../types';
import { urgencyScore } from './tierLogic';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// ─── Adaptive timing ─────────────────────────────────────────────────────────

export function getBestHour(engagementHours: number[]): number {
  if (engagementHours.length === 0) return 9;
  const freq: Record<number, number> = {};
  for (const h of engagementHours) {
    freq[h] = (freq[h] ?? 0) + 1;
  }
  return Number(
    Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
  );
}

// ─── Contact selection ────────────────────────────────────────────────────────

export function getMostUrgentContact(
  contacts: Contact[],
  interactions: Interaction[]
): Contact | null {
  if (contacts.length === 0) return null;
  return [...contacts].sort((a, b) => {
    const aInts = interactions.filter((i) => i.contactId === a.id);
    const bInts = interactions.filter((i) => i.contactId === b.id);
    return urgencyScore(b, bInts) - urgencyScore(a, aInts);
  })[0];
}

// ─── Next notification date ───────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function nextWeekday(date: Date): Date {
  const d = new Date(date);
  do {
    d.setDate(d.getDate() + 1);
  } while (d.getDay() === 0 || d.getDay() === 6);
  return d;
}

export function getNextTriggerDate(cadence: Cadence, hour: number): Date {
  const now = new Date();
  let base: Date;

  switch (cadence) {
    case 'Daily':
      base = addDays(now, 1);
      break;
    case 'Every 2 days':
      base = addDays(now, 2);
      break;
    case 'Weekdays only':
      base = nextWeekday(now);
      break;
    case 'Surprise':
      base = addDays(now, 1 + Math.floor(Math.random() * 3)); // 1–3 days
      break;
  }

  base.setHours(hour, 0, 0, 0);
  // If the computed time is in the past, push forward one interval
  if (base <= now) {
    base = addDays(base, cadence === 'Every 2 days' ? 2 : 1);
  }
  return base;
}

// ─── Main scheduling function ─────────────────────────────────────────────────

export async function scheduleNextNudge(
  settings: Settings,
  contacts: Contact[],
  interactions: Interaction[]
): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!settings.notificationsEnabled || contacts.length === 0) return;

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    const contact = getMostUrgentContact(contacts, interactions);
    if (!contact) return;

    const hour =
      settings.notificationTime === 'surprise'
        ? getBestHour(settings.engagementHours)
        : parseInt(settings.notificationTime.split(':')[0], 10);

    const triggerDate = getNextTriggerDate(settings.cadence, hour);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reach',
        body: `${contact.name} is waiting.`,
        data: { contactId: contact.id },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
    });
  } catch (e) {
    // Notifications may not be available in Expo Go without proper setup — fail silently
    console.warn('scheduleNextNudge failed:', e);
  }
}

// ─── Permission request ───────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}
