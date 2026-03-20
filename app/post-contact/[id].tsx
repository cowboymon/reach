import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';
import type { Feeling, Tier } from '../../types';

const FEELINGS: Feeling[] = ['Good', 'Quiet', 'Hard'];

const TIER_OPTIONS: { value: Tier; label: string; sub: string }[] = [
  { value: 'Back', label: 'Back', sub: 'Feels like no time has passed.' },
  { value: 'Familiar', label: 'Familiar', sub: 'Finding our rhythm again.' },
  { value: 'Reconnecting', label: 'Reconnecting', sub: 'Still finding the thread.' },
  { value: 'Drifted', label: 'Drifted', sub: "It's been a while." },
];

export default function PostContact() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, logInteraction, tierSuggestion, acceptTierSuggestion, dismissTierSuggestion } =
    useApp();

  const contact = data.contacts.find((c) => c.id === id);
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const activeSuggestion =
    saved && tierSuggestion?.contactId === id ? tierSuggestion.suggestion : null;

  if (!contact) {
    return (
      <View
        className="flex-1 bg-linen items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <Text
          style={{
            fontFamily: 'PlusJakartaSans_400Regular',
            color: '#1C1814',
            opacity: 0.4,
          }}
        >
          Contact not found.
        </Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!selectedFeeling) return;
    await logInteraction(contact.id, selectedFeeling, note.trim());
    setSaved(true);
  };

  const handleDone = () => {
    router.replace('/(tabs)/home');
  };

  const handleAcceptTier = async (tier: Tier) => {
    await acceptTierSuggestion(contact.id, tier);
    router.replace('/(tabs)/home');
  };

  const handleDismissTier = () => {
    dismissTierSuggestion();
    router.replace('/(tabs)/home');
  };

  // ─── Tier suggestion view (shown after saving) ─────────────────────────────

  if (saved && activeSuggestion) {
    const isInitial = activeSuggestion.type === 'initial_assessment';
    const isUpgrade = activeSuggestion.type === 'upgrade';
    const isDowngrade = activeSuggestion.type === 'downgrade';

    const heading = isInitial
      ? 'How does this feel?'
      : isUpgrade
      ? `Feeling like ${activeSuggestion.suggested}?`
      : `Still feeling like ${activeSuggestion.current}?`;

    const reason =
      activeSuggestion.type === 'upgrade' || activeSuggestion.type === 'downgrade'
        ? activeSuggestion.reason
        : '';
    const sub = isInitial
      ? 'Set a tier and Reach will track how this connection evolves.'
      : isUpgrade
      ? `${reason}. Want to move this up?`
      : `${reason}. No pressure to change it.`;

    return (
      <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
        <ScrollView
          className="flex-1 px-10"
          contentContainerStyle={{ paddingTop: 80, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 1400, delay: 300 }}
          >
            <Text
              className="text-ink mb-3"
              style={{
                fontFamily: 'Fraunces_700Bold',
                fontSize: 30,
                lineHeight: 44,
                letterSpacing: -0.8,
              }}
            >
              {heading}
            </Text>
            <Text
              className="text-ink italic mb-12"
              style={{
                fontFamily: 'Fraunces_400Regular',
                fontSize: 16,
                opacity: 0.5,
                lineHeight: 28,
              }}
            >
              {sub}
            </Text>

            <View style={{ gap: 10 }}>
              {(isInitial || isUpgrade || isDowngrade) &&
                TIER_OPTIONS.map((t) => {
                  // For upgrade/downgrade, only show the suggested tier and "keep current"
                  if (!isInitial) {
                    const suggested =
                      activeSuggestion.type === 'upgrade' || activeSuggestion.type === 'downgrade'
                        ? activeSuggestion.suggested
                        : null;
                    const current =
                      activeSuggestion.type === 'upgrade' || activeSuggestion.type === 'downgrade'
                        ? activeSuggestion.current
                        : null;
                    if (t.value !== suggested && t.value !== current) return null;
                  }

                  return (
                    <TouchableOpacity
                      key={t.value}
                      onPress={() => handleAcceptTier(t.value)}
                      activeOpacity={0.8}
                      className="w-full py-4 px-4 border"
                      style={{
                        borderColor: 'rgba(28,24,20,0.15)',
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'PlusJakartaSans_700Bold',
                          fontSize: 15,
                          color: '#1C1814',
                        }}
                      >
                        {t.label}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'PlusJakartaSans_400Regular',
                          fontSize: 12,
                          color: '#1C1814',
                          opacity: 0.45,
                          fontStyle: 'italic',
                          marginTop: 2,
                        }}
                      >
                        {t.sub}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>

            <TouchableOpacity
              onPress={handleDismissTier}
              activeOpacity={0.6}
              className="items-center py-6"
            >
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans_400Regular',
                  fontSize: 14,
                  color: '#1C1814',
                  opacity: 0.35,
                  textDecorationLine: 'underline',
                }}
              >
                {isInitial ? "I'll set it later" : 'Keep it as is'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
        <Navigation />
      </View>
    );
  }

  // ─── Main post-contact flow ────────────────────────────────────────────────

  if (saved) {
    // No suggestion — go straight home
    router.replace('/(tabs)/home');
    return null;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-linen"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 80,
          paddingHorizontal: 40,
          paddingBottom: 120,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1400, delay: 300 }}
        >
          <Text
            className="text-ink italic mb-16"
            style={{
              fontFamily: 'Fraunces_400Regular',
              fontSize: 28,
              lineHeight: 44,
              opacity: 0.65,
            }}
          >
            How did it go?
          </Text>

          {/* Feeling selector */}
          <View className="flex-row mb-16" style={{ gap: 10 }}>
            {FEELINGS.map((feeling) => (
              <TouchableOpacity
                key={feeling}
                onPress={() => setSelectedFeeling(feeling)}
                activeOpacity={0.8}
                className="flex-1 py-4 border items-center"
                style={{
                  backgroundColor:
                    selectedFeeling === feeling ? '#C9A84C' : 'transparent',
                  borderColor:
                    selectedFeeling === feeling
                      ? '#C9A84C'
                      : 'rgba(28,24,20,0.15)',
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily:
                      selectedFeeling === feeling
                        ? 'PlusJakartaSans_700Bold'
                        : 'PlusJakartaSans_400Regular',
                    fontSize: 14,
                    color: '#1C1814',
                  }}
                >
                  {feeling}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Memory note */}
          <View className="mb-16">
            <Text
              className="italic text-ink mb-2"
              style={{
                fontFamily: 'Fraunces_400Regular',
                fontSize: 18,
                opacity: 0.5,
                lineHeight: 32,
              }}
            >
              What were they up to?
            </Text>
            <TextInput
              value={note}
              onChangeText={(t) => setNote(t.slice(0, 140))}
              placeholder="A few words. Just for you."
              placeholderTextColor="rgba(28,24,20,0.3)"
              multiline
              numberOfLines={6}
              className="text-ink"
              style={{
                fontFamily: 'PlusJakartaSans_400Regular',
                fontSize: 15,
                color: '#1C1814',
                lineHeight: 26,
                backgroundColor: '#E8DFD0',
                padding: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'rgba(28,24,20,0.1)',
                textAlignVertical: 'top',
                minHeight: 120,
              }}
            />
            <Text
              style={{
                fontFamily: 'PlusJakartaSans_400Regular',
                fontSize: 12,
                color: '#1C1814',
                opacity: 0.35,
                marginTop: 6,
              }}
            >
              Optional · {140 - note.length} characters left
            </Text>
          </View>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!selectedFeeling}
            activeOpacity={0.8}
            className="w-full py-4 items-center border"
            style={{
              backgroundColor: selectedFeeling ? '#C9A84C' : 'transparent',
              borderColor: selectedFeeling ? '#C9A84C' : 'rgba(28,24,20,0.15)',
              borderRadius: 4,
              opacity: selectedFeeling ? 1 : 0.4,
            }}
          >
            <Text
              style={{
                fontFamily: selectedFeeling
                  ? 'PlusJakartaSans_700Bold'
                  : 'PlusJakartaSans_500Medium',
                fontSize: 15,
                color: '#1C1814',
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>

      <Navigation />
    </KeyboardAvoidingView>
  );
}
