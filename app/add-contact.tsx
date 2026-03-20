import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Contacts from 'expo-contacts';
import { useApp } from '../context/AppContext';
import type { Tier } from '../types';

interface DeviceContact {
  name: string;
  phone: string;
}

const TIERS: { value: Tier; label: string; sub: string }[] = [
  { value: 'Back', label: 'Back', sub: 'Feels like no time has passed.' },
  { value: 'Familiar', label: 'Familiar', sub: 'Finding our rhythm again.' },
  { value: 'Reconnecting', label: 'Reconnecting', sub: 'Still finding the thread.' },
  { value: 'Drifted', label: 'Drifted', sub: "It's been a while." },
];

export default function AddContact() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addContact } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState<Tier>('Reconnecting');
  const [saving, setSaving] = useState(false);

  const [deviceContacts, setDeviceContacts] = useState<DeviceContact[]>([]);
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const nameInputRef = useRef<TextInput>(null);

  const suggestions =
    name.trim().length >= 1 && contactsLoaded
      ? deviceContacts
          .filter((c) =>
            c.name.toLowerCase().startsWith(name.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const loadDeviceContacts = async () => {
    if (contactsLoaded) return;
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setContactsLoaded(true);
        return;
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });
      const result: DeviceContact[] = data
        .filter((c) => c.name && c.phoneNumbers?.length)
        .map((c) => ({
          name: c.name!,
          phone: c.phoneNumbers![0].number ?? '',
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setDeviceContacts(result);
      setContactsLoaded(true);
    } catch (e) {
      setContactsLoaded(true);
    }
  };

  const handleNameFocus = () => {
    setShowSuggestions(true);
    loadDeviceContacts();
  };

  const handleNameBlur = () => {
    // Slight delay so taps on suggestions register first
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const applySuggestion = (contact: DeviceContact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setShowSuggestions(false);
    nameInputRef.current?.blur();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for this person.');
      return;
    }
    setSaving(true);
    await addContact({ name: name.trim(), phone: phone.trim(), tier });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-linen"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingHorizontal: 40,
          paddingBottom: 80,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.6}
            className="mb-12"
          >
            <ArrowLeft size={20} strokeWidth={1.5} color="#1C1814" opacity={0.4} />
          </TouchableOpacity>

          <Text
            className="text-ink mb-12"
            style={{
              fontFamily: 'Fraunces_700Bold',
              fontSize: 32,
              lineHeight: 44,
              letterSpacing: -0.8,
            }}
          >
            Add someone
          </Text>
        </MotiView>

        <View style={{ gap: 32 }}>
          {/* Name with typeahead */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 200 }}
          >
            <Text
              className="text-ink mb-3"
              style={{
                fontFamily: 'PlusJakartaSans_500Medium',
                fontSize: 13,
                opacity: 0.6,
              }}
            >
              Name
            </Text>

            <TextInput
              ref={nameInputRef}
              value={name}
              onChangeText={setName}
              onFocus={handleNameFocus}
              onBlur={handleNameBlur}
              placeholder="Their name"
              placeholderTextColor="rgba(28,24,20,0.3)"
              autoCapitalize="words"
              className="text-ink"
              style={{
                fontFamily: 'Fraunces_400Regular',
                fontSize: 22,
                color: '#1C1814',
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(28,24,20,0.15)',
                paddingBottom: 12,
                paddingTop: 4,
              }}
              autoFocus
            />

            {/* Typeahead suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <MotiView
                from={{ opacity: 0, translateY: -8 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300 }}
                style={{
                  backgroundColor: '#EDE8DF',
                  borderRadius: 4,
                  marginTop: 4,
                  overflow: 'hidden',
                }}
              >
                {suggestions.map((s, i) => (
                  <TouchableOpacity
                    key={s.name + i}
                    onPress={() => applySuggestion(s)}
                    activeOpacity={0.7}
                    className="flex-row justify-between items-center px-4 py-3"
                    style={{
                      borderBottomWidth: i < suggestions.length - 1 ? 1 : 0,
                      borderBottomColor: 'rgba(28,24,20,0.06)',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Fraunces_400Regular',
                        fontSize: 17,
                        color: '#1C1814',
                      }}
                    >
                      {s.name}
                    </Text>
                    {s.phone ? (
                      <Text
                        style={{
                          fontFamily: 'PlusJakartaSans_400Regular',
                          fontSize: 12,
                          color: '#1C1814',
                          opacity: 0.4,
                        }}
                      >
                        {s.phone}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </MotiView>
            )}
          </MotiView>

          {/* Phone */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 300 }}
          >
            <Text
              className="text-ink mb-3"
              style={{
                fontFamily: 'PlusJakartaSans_500Medium',
                fontSize: 13,
                opacity: 0.6,
              }}
            >
              Phone number
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor="rgba(28,24,20,0.3)"
              keyboardType="phone-pad"
              className="text-ink"
              style={{
                fontFamily: 'PlusJakartaSans_400Regular',
                fontSize: 18,
                color: '#1C1814',
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(28,24,20,0.15)',
                paddingBottom: 12,
                paddingTop: 4,
              }}
            />
          </MotiView>

          {/* Tier — note this is a starting point; Reach will refine it with you */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 400 }}
          >
            <Text
              className="text-ink mb-1"
              style={{
                fontFamily: 'PlusJakartaSans_500Medium',
                fontSize: 13,
                opacity: 0.6,
              }}
            >
              How close are you right now?
            </Text>
            <Text
              className="text-ink mb-4 italic"
              style={{
                fontFamily: 'Fraunces_400Regular',
                fontSize: 13,
                opacity: 0.35,
                lineHeight: 22,
              }}
            >
              Reach will check in after your first conversation.
            </Text>
            <View style={{ gap: 8 }}>
              {TIERS.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => setTier(t.value)}
                  activeOpacity={0.8}
                  className="w-full py-3.5 px-4 border"
                  style={{
                    borderColor:
                      tier === t.value
                        ? 'rgba(28,24,20,0.25)'
                        : 'rgba(28,24,20,0.1)',
                    borderRadius: 4,
                    opacity: tier === t.value ? 1 : 0.6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily:
                        tier === t.value
                          ? 'PlusJakartaSans_700Bold'
                          : 'PlusJakartaSans_400Regular',
                      fontSize: 14,
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
              ))}
            </View>
          </MotiView>

          {/* Save */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 900, delay: 600 }}
          >
            <TouchableOpacity
              onPress={handleSave}
              disabled={!name.trim() || saving}
              activeOpacity={0.8}
              className="w-full py-4 border items-center"
              style={{
                borderColor: name.trim()
                  ? 'rgba(28,24,20,0.2)'
                  : 'rgba(28,24,20,0.1)',
                borderRadius: 4,
                opacity: name.trim() ? 1 : 0.4,
              }}
            >
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans_500Medium',
                  fontSize: 15,
                  color: '#1C1814',
                }}
              >
                {saving ? 'Saving…' : 'Add to constellation'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
