import type { Tier, Feeling, TierSuggestion } from '../types';

// How many days of no contact before a tier is considered "cold"
export const TIER_COLD_THRESHOLDS: Record<Tier, number> = {
  Back: 28,
  Familiar: 14,
  Reconnecting: 7,
  Drifted: 4,
};

// Target urgency interval per tier (used for notification contact selection)
export const TIER_URGENCY_THRESHOLDS: Record<Tier, number> = {
  Back: 14,
  Familiar: 7,
  Reconnecting: 3,
  Drifted: 2,
};

const TIER_ORDER: Tier[] = ['Drifted', 'Reconnecting', 'Familiar', 'Back'];

export function nextTierUp(tier: Tier): Tier | null {
  const idx = TIER_ORDER.indexOf(tier);
  return idx < TIER_ORDER.length - 1 ? TIER_ORDER[idx + 1] : null;
}

export function nextTierDown(tier: Tier): Tier | null {
  const idx = TIER_ORDER.indexOf(tier);
  return idx > 0 ? TIER_ORDER[idx - 1] : null;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

interface ContactLike {
  id: string;
  tier: Tier;
  tierAssessed: boolean;
  addedAt: string;
}

interface InteractionLike {
  contactId: string;
  date: string;
  feeling: Feeling;
}

export function getTierSuggestion(
  contact: ContactLike,
  interactions: InteractionLike[]
): TierSuggestion | null {
  const sorted = [...interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const count = sorted.length;

  // Initial assessment: after 1st or 2nd interaction and not yet assessed
  if (!contact.tierAssessed && count >= 1) {
    return {
      type: 'initial_assessment',
      reason: count === 1 ? 'first_interaction' : 'second_interaction',
    };
  }

  // Only run progression logic for assessed contacts
  if (!contact.tierAssessed) return null;

  // Upgrade: last 3 all Good
  if (count >= 3) {
    const last3 = sorted.slice(0, 3);
    if (last3.every((i) => i.feeling === 'Good')) {
      const up = nextTierUp(contact.tier);
      if (up) {
        return {
          type: 'upgrade',
          current: contact.tier,
          suggested: up,
          reason: '3 good conversations in a row',
        };
      }
    }
  }

  // Downgrade: 3 of last 4 are Hard
  if (count >= 4) {
    const last4 = sorted.slice(0, 4);
    const hardCount = last4.filter((i) => i.feeling === 'Hard').length;
    if (hardCount >= 3) {
      const down = nextTierDown(contact.tier);
      if (down) {
        return {
          type: 'downgrade',
          current: contact.tier,
          suggested: down,
          reason: 'conversations have felt hard lately',
        };
      }
    }
  }

  // Cold check: no interaction in threshold days
  const lastDate = sorted[0]?.date ?? contact.addedAt;
  const days = daysSince(lastDate);
  const threshold = TIER_COLD_THRESHOLDS[contact.tier];
  if (days >= threshold) {
    return { type: 'cold_check', current: contact.tier, daysSince: days };
  }

  return null;
}

export function urgencyScore(contact: ContactLike, interactions: InteractionLike[]): number {
  const sorted = [...interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastDate = sorted[0]?.date ?? contact.addedAt;
  const days = daysSince(lastDate);
  const threshold = TIER_URGENCY_THRESHOLDS[contact.tier];
  return days / threshold; // >1 = overdue relative to tier
}
