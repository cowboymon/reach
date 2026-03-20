import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Contacts from 'expo-contacts';
import { Check, X } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { requestNotificationPermission } from '../utils/notifications';
import type { Tier } from '../types';

interface PickedPerson {
  name: string;
  phone: string;
}

export default function OnboardingContacts() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addContacts, completeOnboarding } = useApp();

  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [people, setPeople] = useState<PickedPerson[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery.trim()
    ? people.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : people;

  const loadContacts = async () => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Contacts access needed',
          'To suggest people from your phone, Reach needs access to your contacts.',
          [{ text: 'OK' }]
        );
        setHasLoaded(true);
        setLoading(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      const result: PickedPerson[] = data
        .filter((c) => c.name && c.phoneNumbers && c.phoneNumbers.length > 0)
        .slice(0, 200)
        .map((c) => ({
          name: c.name!,
          phone: c.phoneNumbers![0].number ?? '',
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setPeople(result);
      setHasLoaded(true);
    } catch (e) {
      console.error(e);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePick = (name: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleContinue = async () => {
    const selected = people.filter((p) => picked.has(p.name));
    if (selected.length > 0) {
      await addContacts(
        selected.map((p) => ({
          name: p.name,
          phone: p.phone,
          tier: 'Reconnecting' as Tier,
        }))
      );
    }
    // Request notification permission before completing onboarding
    await requestNotificationPermission();
    await completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const handleSkip = async () => {
    await requestNotificationPermission();
    await completeOnboarding();
    router.replace('/(tabs)/home');
  };

  return (
    <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 px-10"
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 160 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Heading */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1400, delay: 200 }}
          className="mb-10"
        >
          <Text
            className="text-ink mb-4"
            style={{
              fontFamily: 'Fraunces_700Bold',
              fontSize: 32,
              lineHeight: 44,
              letterSpacing: -0.8,
            }}
          >
            Who belongs in your constellation?
          </Text>
          <Text
            className="italic text-ink"
            style={{
              fontFamily: 'Fraunces_400Regular',
              fontSize: 16,
              lineHeight: 28,
              opacity: 0.45,
            }}
          >
            Tap anyone you want to stay close to.
          </Text>
        </MotiView>

        {!hasLoaded ? (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 800, delay: 600 }}
          >
            <TouchableOpacity
              onPress={loadContacts}
              disabled={loading}
              activeOpacity={0.8}
              className="w-full py-4 border items-center mb-4"
              style={{
                borderColor: 'rgba(28,24,20,0.2)',
                borderRadius: 4,
                opacity: loading ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans_500Medium',
                  fontSize: 15,
                  color: '#1C1814',
                }}
              >
                {loading ? 'Loading contacts…' : 'Import from contacts'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ) : (
          <View>
            {/* Search bar */}
            {people.length > 0 && (
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 600 }}
                className="mb-6"
              >
                <View
                  className="flex-row items-center px-4"
                  style={{
                    backgroundColor: '#E8DFD0',
                    borderRadius: 4,
                    height: 44,
                  }}
                >
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search contacts…"
                    placeholderTextColor="rgba(28,24,20,0.35)"
                    autoCapitalize="words"
                    returnKeyType="search"
                    style={{
                      flex: 1,
                      fontFamily: 'PlusJakartaSans_400Regular',
                      fontSize: 15,
                      color: '#1C1814',
                    }}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchQuery('')}
                      activeOpacity={0.6}
                      className="p-1"
                    >
                      <X size={16} strokeWidth={2} color="#1C1814" opacity={0.4} />
                    </TouchableOpacity>
                  )}
                </View>
              </MotiView>
            )}

            {filtered.length === 0 && (
              <Text
                className="italic text-center mb-8"
                style={{
                  fontFamily: 'Fraunces_400Regular',
                  fontSize: 16,
                  color: '#1C1814',
                  opacity: 0.4,
                  lineHeight: 28,
                }}
              >
                {people.length === 0
                  ? 'No contacts found. You can add people from the app.'
                  : 'No contacts match.'}
              </Text>
            )}

            {filtered.map((person, index) => {
              const isSelected = picked.has(person.name);
              return (
                <MotiView
                  key={person.name}
                  from={{ opacity: 0, translateY: 12 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 600, delay: Math.min(index * 30, 600) }}
                >
                  <TouchableOpacity
                    onPress={() => togglePick(person.name)}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between py-5"
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(28,24,20,0.06)',
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: isSelected
                            ? 'Fraunces_700Bold'
                            : 'Fraunces_400Regular',
                          fontSize: 18,
                          color: '#1C1814',
                          opacity: isSelected ? 1 : 0.7,
                        }}
                      >
                        {person.name}
                      </Text>
                      {person.phone ? (
                        <Text
                          style={{
                            fontFamily: 'PlusJakartaSans_400Regular',
                            fontSize: 12,
                            color: '#1C1814',
                            opacity: 0.35,
                            marginTop: 2,
                          }}
                        >
                          {person.phone}
                        </Text>
                      ) : null}
                    </View>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: isSelected ? '#C9A84C' : 'transparent',
                        borderWidth: 2,
                        borderColor: isSelected ? '#C9A84C' : 'rgba(28,24,20,0.12)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && (
                        <Check size={14} strokeWidth={2.5} color="#F5F0E8" />
                      )}
                    </View>
                  </TouchableOpacity>
                </MotiView>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View
        className="px-10 pt-4 bg-linen"
        style={{
          paddingBottom: Math.max(insets.bottom + 16, 36),
          borderTopWidth: 1,
          borderTopColor: 'rgba(28,24,20,0.06)',
        }}
      >
        {hasLoaded && picked.size > 0 && (
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.8}
            className="w-full py-4 border items-center mb-3"
            style={{ borderColor: 'rgba(28,24,20,0.2)', borderRadius: 4 }}
          >
            <Text
              style={{
                fontFamily: 'PlusJakartaSans_500Medium',
                fontSize: 15,
                color: '#1C1814',
              }}
            >
              Continue with {picked.size}{' '}
              {picked.size === 1 ? 'person' : 'people'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
          className="items-center py-3"
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
            I'll add people later
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
