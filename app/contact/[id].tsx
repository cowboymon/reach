import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';
import type { Tier, Feeling } from '../../types';

const TIER_COLORS: Record<Tier, string> = {
  Drifted: '#C47A7A',
  Reconnecting: '#7A9E87',
  Familiar: '#9B8EA8',
  Back: '#C9A84C',
};

const TIER_DESCRIPTIONS: Record<Tier, string> = {
  Back: "Feels like no time has passed. This one's easy.",
  Familiar: "We're finding our rhythm again. No pressure, just presence.",
  Reconnecting: 'Still finding the thread. Worth the effort.',
  Drifted: "It's been a while. A small reach goes a long way.",
};

const FEELING_COLORS: Record<Feeling, string> = {
  Good: '#D4A843',
  Quiet: '#7A9E87',
  Hard: '#C47A7A',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export default function ContactProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, logInteraction, getInteractionsForContact, updateContactTier, deleteContact } = useApp();

  const contact = data.contacts.find((c) => c.id === id);
  const interactions = getInteractionsForContact(id ?? '');

  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newFeeling, setNewFeeling] = useState<Feeling | null>(null);
  const [showTierPicker, setShowTierPicker] = useState(false);

  if (!contact) {
    return (
      <View className="flex-1 bg-linen items-center justify-center" style={{ paddingTop: insets.top }}>
        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', color: '#1C1814', opacity: 0.4 }}>
          Contact not found.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6">
          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', color: '#1C1814', textDecorationLine: 'underline' }}>
            Go back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSaveInteraction = async () => {
    if (!newFeeling) return;
    await logInteraction(contact.id, newFeeling, newNote.trim());
    setNewNote('');
    setNewFeeling(null);
    setIsAdding(false);
  };

  const handleDeleteContact = () => {
    Alert.alert(
      `Remove ${contact.name}?`,
      'This will remove them and all their logs from your constellation.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await deleteContact(contact.id);
            router.replace('/(tabs)/contacts');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 px-10"
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
          className="mb-12"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.6}
            className="mb-8"
          >
            <ArrowLeft size={20} strokeWidth={1.5} color="#1C1814" opacity={0.4} />
          </TouchableOpacity>

          <Text
            className="text-ink mb-6"
            style={{ fontFamily: 'Fraunces_700Bold', fontSize: 40, lineHeight: 52, letterSpacing: -0.8 }}
          >
            {contact.name}
          </Text>

          <View
            className="self-start px-4 py-1.5 mb-3"
            style={{ backgroundColor: TIER_COLORS[contact.tier], borderRadius: 3 }}
          >
            <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: '#F5F0E8' }}>
              {contact.tier}
            </Text>
          </View>
          <Text
            className="text-ink italic"
            style={{ fontFamily: 'Fraunces_400Regular', fontSize: 14, opacity: 0.5, lineHeight: 24 }}
          >
            {TIER_DESCRIPTIONS[contact.tier]}
          </Text>
        </MotiView>

        {/* Interaction log */}
        <View className="mb-12">
          {/* Add log entry */}
          {!isAdding ? (
            <TouchableOpacity
              onPress={() => setIsAdding(true)}
              activeOpacity={0.7}
              className="w-full py-5 pl-6"
              style={{
                borderLeftWidth: 2,
                borderLeftColor: 'rgba(28,24,20,0.15)',
              }}
            >
              <Text
                className="italic text-ink"
                style={{ fontFamily: 'Fraunces_400Regular', fontSize: 14, opacity: 0.5 }}
              >
                + Log a reach out
              </Text>
            </TouchableOpacity>
          ) : (
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600 }}
              className="pl-6 py-5"
              style={{ borderLeftWidth: 2, borderLeftColor: 'rgba(28,24,20,0.15)' }}
            >
              <Text
                style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#1C1814', opacity: 0.4, marginBottom: 12 }}
              >
                Today
              </Text>

              <TextInput
                value={newNote}
                onChangeText={setNewNote}
                placeholder="What stuck with you?"
                placeholderTextColor="rgba(28,24,20,0.3)"
                multiline
                numberOfLines={2}
                className="text-ink italic mb-4"
                style={{
                  fontFamily: 'Fraunces_400Regular',
                  fontSize: 18,
                  lineHeight: 32,
                  opacity: 0.7,
                  borderWidth: 0,
                  padding: 0,
                  textAlignVertical: 'top',
                }}
                autoFocus
              />

              <View className="flex-row gap-3 mb-5" style={{ gap: 10 }}>
                {(['Good', 'Quiet', 'Hard'] as Feeling[]).map((feeling) => (
                  <TouchableOpacity
                    key={feeling}
                    onPress={() => setNewFeeling(newFeeling === feeling ? null : feeling)}
                    activeOpacity={0.8}
                    className="px-3 py-1.5"
                    style={{
                      borderWidth: 1,
                      borderColor: newFeeling === feeling ? FEELING_COLORS[feeling] : 'rgba(28,24,20,0.1)',
                      backgroundColor: newFeeling === feeling ? FEELING_COLORS[feeling] : 'transparent',
                      borderRadius: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'PlusJakartaSans_500Medium',
                        fontSize: 12,
                        color: newFeeling === feeling ? '#F5F0E8' : '#1C1814',
                        opacity: newFeeling === feeling ? 1 : 0.4,
                      }}
                    >
                      {feeling}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row" style={{ gap: 12 }}>
                {newNote.trim() && newFeeling && (
                  <TouchableOpacity
                    onPress={handleSaveInteraction}
                    activeOpacity={0.8}
                    className="py-2.5 px-5 border"
                    style={{ borderColor: 'rgba(28,24,20,0.2)', borderRadius: 4 }}
                  >
                    <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: '#1C1814' }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => { setIsAdding(false); setNewNote(''); setNewFeeling(null); }}
                  activeOpacity={0.6}
                  className="py-2.5 px-4"
                >
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#1C1814', opacity: 0.3 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          )}

          {interactions.map((interaction, index) => (
            <MotiView
              key={interaction.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 1000, delay: 200 * index }}
              className="pl-6 py-5"
              style={{
                borderLeftWidth: 2,
                borderLeftColor: FEELING_COLORS[interaction.feeling] ?? 'rgba(28,24,20,0.1)',
              }}
            >
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans_400Regular',
                  fontSize: 12,
                  color: '#1C1814',
                  opacity: 0.4,
                  marginBottom: 12,
                  lineHeight: 20,
                }}
              >
                {formatDate(interaction.date)}
              </Text>
              {interaction.note ? (
                <Text
                  className="italic text-ink mb-2"
                  style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, opacity: 0.6, lineHeight: 32 }}
                >
                  {interaction.note}
                </Text>
              ) : null}
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans_500Medium',
                  fontSize: 12,
                  color: FEELING_COLORS[interaction.feeling],
                  marginTop: 4,
                }}
              >
                Felt {interaction.feeling.toLowerCase()}
              </Text>
            </MotiView>
          ))}
        </View>

        {/* Edit tier */}
        {!showTierPicker ? (
          <TouchableOpacity
            onPress={() => setShowTierPicker(true)}
            activeOpacity={0.8}
            className="w-full py-4 border items-center mb-4"
            style={{ borderColor: 'rgba(28,24,20,0.15)', borderRadius: 4 }}
          >
            <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#1C1814' }}>
              Edit tier
            </Text>
          </TouchableOpacity>
        ) : (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            className="mb-4"
            style={{ gap: 8 }}
          >
            {(['Back', 'Familiar', 'Reconnecting', 'Drifted'] as Tier[]).map((tier) => (
              <TouchableOpacity
                key={tier}
                onPress={async () => {
                  await updateContactTier(contact.id, tier);
                  setShowTierPicker(false);
                }}
                activeOpacity={0.8}
                className="w-full py-3.5 px-4 border"
                style={{
                  borderColor: contact.tier === tier ? TIER_COLORS[tier] : 'rgba(28,24,20,0.1)',
                  backgroundColor: contact.tier === tier ? TIER_COLORS[tier] + '22' : 'transparent',
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: contact.tier === tier ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_400Regular',
                    fontSize: 14,
                    color: '#1C1814',
                  }}
                >
                  {tier}
                </Text>
                <Text
                  style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#1C1814', opacity: 0.4, marginTop: 2 }}
                >
                  {TIER_DESCRIPTIONS[tier]}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowTierPicker(false)}
              activeOpacity={0.6}
              className="items-center py-3"
            >
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#1C1814', opacity: 0.35 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Delete */}
        <TouchableOpacity onPress={handleDeleteContact} activeOpacity={0.6} className="items-center py-4">
          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#C47A7A', opacity: 0.6 }}>
            Remove from constellation
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Navigation />
    </View>
  );
}
