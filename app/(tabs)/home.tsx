import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';
import type { Tier } from '../../types';

const DEFER_MESSAGES = [
  "Some days aren't the day. Tomorrow might be.",
  "They'll still be there tomorrow.",
  'Still there. Try tomorrow.',
];

const TIER_ORDER: Tier[] = ['Drifted', 'Reconnecting', 'Familiar', 'Back'];

function timeSinceLabel(dateStr: string): string {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 5) return `${weeks} weeks ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    getTodayContact,
    deferContact,
    getInteractionsForContact,
    data,
    tierSuggestion,
    acceptTierSuggestion,
    dismissTierSuggestion,
  } = useApp();

  const [deferMessage] = useState(
    () => DEFER_MESSAGES[Math.floor(Math.random() * DEFER_MESSAGES.length)]
  );
  const [showDeferMsg, setShowDeferMsg] = useState(false);

  const contact = getTodayContact();
  const interactions = contact ? getInteractionsForContact(contact.id) : [];
  const lastInteraction = interactions[0];
  const lastNote = lastInteraction?.note;
  const lastDate = lastInteraction?.date ?? contact?.addedAt;
  const sinceLabel = lastDate ? `It's been ${timeSinceLabel(lastDate)}` : '';

  // Cold-check suggestion for this contact (from context)
  const coldCheck =
    contact &&
    tierSuggestion?.contactId === contact.id &&
    tierSuggestion.suggestion.type === 'cold_check'
      ? tierSuggestion.suggestion
      : null;

  const handleDefer = () => {
    if (contact) deferContact(contact.id);
    setShowDeferMsg(true);
    setTimeout(() => setShowDeferMsg(false), 3000);
  };

  // ─── Empty state ────────────────────────────────────────────────────────────

  if (data.contacts.length === 0) {
    return (
      <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
        <View className="flex-row justify-end px-6 pt-4 pb-2">
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            activeOpacity={0.6}
            className="p-2"
          >
            <Settings size={22} strokeWidth={1.5} color="#1C1814" opacity={0.4} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-10 pb-28">
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 1200 }}
          >
            <Text
              className="text-ink text-center italic mb-8"
              style={{
                fontFamily: 'Fraunces_400Regular',
                fontSize: 22,
                lineHeight: 36,
                opacity: 0.5,
              }}
            >
              Your constellation is empty.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/add-contact')}
              activeOpacity={0.8}
              className="w-full py-4 border items-center"
              style={{ borderColor: 'rgba(28,24,20,0.2)', borderRadius: 4 }}
            >
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans_500Medium',
                  fontSize: 15,
                  color: '#1C1814',
                }}
              >
                Add someone
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
        <Navigation />
      </View>
    );
  }

  if (!contact) {
    return (
      <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
        <View className="flex-row justify-end px-6 pt-4 pb-2">
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            activeOpacity={0.6}
            className="p-2"
          >
            <Settings size={22} strokeWidth={1.5} color="#1C1814" opacity={0.4} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-10 pb-28">
          <Text
            className="text-ink text-center italic"
            style={{
              fontFamily: 'Fraunces_400Regular',
              fontSize: 22,
              lineHeight: 36,
              opacity: 0.5,
            }}
          >
            You've reached everyone today. Rest well.
          </Text>
        </View>
        <Navigation />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 1200, delay: 400 }}
        className="flex-row justify-end px-6 pt-4 pb-2"
      >
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          activeOpacity={0.6}
          className="p-2"
        >
          <Settings size={22} strokeWidth={1.5} color="#1C1814" opacity={0.4} />
        </TouchableOpacity>
      </MotiView>

      <View className="flex-1 items-center justify-center px-10 pb-28">
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1400, delay: 300 }}
          className="w-full"
        >
          <View className="items-center mb-16">
            <Text
              className="text-ink mb-3 text-center"
              style={{
                fontFamily: 'Fraunces_700Bold',
                fontSize: 40,
                lineHeight: 52,
                letterSpacing: -0.8,
              }}
            >
              {contact.name}
            </Text>

            {contact.tierAssessed && (
              <Text
                className="text-ink mb-3"
                style={{
                  fontFamily: 'PlusJakartaSans_400Regular',
                  fontSize: 14,
                  opacity: 0.4,
                  lineHeight: 24,
                }}
              >
                {contact.tier}
              </Text>
            )}

            {/* Cold-check tier suggestion */}
            {coldCheck && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 800, delay: 600 }}
                className="w-full mb-6 mt-2 px-5 py-4"
                style={{
                  backgroundColor: '#E8DFD0',
                  borderRadius: 4,
                }}
              >
                <Text
                  className="italic text-ink mb-4 text-center"
                  style={{
                    fontFamily: 'Fraunces_400Regular',
                    fontSize: 15,
                    opacity: 0.7,
                    lineHeight: 26,
                  }}
                >
                  It's been {coldCheck.daysSince} days. Still feels like{' '}
                  {contact.tier}?
                </Text>
                <View className="flex-row justify-center" style={{ gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => acceptTierSuggestion(contact.id, contact.tier)}
                    activeOpacity={0.8}
                    className="px-4 py-2 border"
                    style={{ borderColor: 'rgba(28,24,20,0.15)', borderRadius: 4 }}
                  >
                    <Text
                      style={{
                        fontFamily: 'PlusJakartaSans_500Medium',
                        fontSize: 13,
                        color: '#1C1814',
                      }}
                    >
                      Yes, keep it
                    </Text>
                  </TouchableOpacity>
                  {TIER_ORDER.indexOf(contact.tier) > 0 && (
                    <TouchableOpacity
                      onPress={() =>
                        acceptTierSuggestion(
                          contact.id,
                          TIER_ORDER[TIER_ORDER.indexOf(contact.tier) - 1]
                        )
                      }
                      activeOpacity={0.8}
                      className="px-4 py-2 border"
                      style={{ borderColor: 'rgba(28,24,20,0.15)', borderRadius: 4 }}
                    >
                      <Text
                        style={{
                          fontFamily: 'PlusJakartaSans_400Regular',
                          fontSize: 13,
                          color: '#1C1814',
                          opacity: 0.6,
                        }}
                      >
                        Drop to{' '}
                        {TIER_ORDER[TIER_ORDER.indexOf(contact.tier) - 1]}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  onPress={dismissTierSuggestion}
                  activeOpacity={0.6}
                  className="items-center mt-3"
                >
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans_400Regular',
                      fontSize: 12,
                      color: '#1C1814',
                      opacity: 0.3,
                    }}
                  >
                    Dismiss
                  </Text>
                </TouchableOpacity>
              </MotiView>
            )}

            {lastNote ? (
              <Text
                className="text-ink italic text-center px-4 mb-6"
                style={{
                  fontFamily: 'Fraunces_400Regular',
                  fontSize: 18,
                  opacity: 0.5,
                  lineHeight: 32,
                }}
              >
                {lastNote}
              </Text>
            ) : null}
            {sinceLabel ? (
              <Text
                className="text-ink"
                style={{
                  fontFamily: 'PlusJakartaSans_400Regular',
                  fontSize: 14,
                  opacity: 0.35,
                  lineHeight: 24,
                }}
              >
                {sinceLabel}
              </Text>
            ) : null}
          </View>

          <View style={{ gap: 16 }}>
            <TouchableOpacity
              onPress={() => router.push(`/reach-out/${contact.id}`)}
              activeOpacity={0.8}
              className="w-full py-4 border items-center"
              style={{ borderColor: 'rgba(28,24,20,0.2)', borderRadius: 4 }}
            >
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans_500Medium',
                  fontSize: 15,
                  color: '#1C1814',
                }}
              >
                Reach out
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDefer}
              activeOpacity={0.6}
              className="w-full py-3 items-center"
            >
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans_400Regular',
                  fontSize: 14,
                  color: '#1C1814',
                  opacity: 0.4,
                  textDecorationLine: 'underline',
                }}
              >
                Not today
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>

      <Navigation />

      {showDeferMsg && (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={{
            position: 'absolute',
            bottom: 120 + insets.bottom,
            left: 24,
            right: 24,
            backgroundColor: '#E8DFD0',
            borderRadius: 4,
            padding: 24,
          }}
        >
          <Text
            className="text-ink italic text-center"
            style={{
              fontFamily: 'Fraunces_400Regular',
              fontSize: 18,
              opacity: 0.7,
              lineHeight: 32,
            }}
          >
            {deferMessage}
          </Text>
        </MotiView>
      )}
    </View>
  );
}
