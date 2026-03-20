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
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Contacts from 'expo-contacts';
import { useApp } from '../context/AppContext';
import type { Tier } from '../types';

const TIERS: { value: Tier; label: string; sub: string }[] = [
  { value: 'Back', label: 'Back', sub: "Feels like no time has passed." },
  { value: 'Familiar', label: 'Familiar', sub: "Finding our rhythm again." },
  { value: 'Reconnecting', label: 'Reconnecting', sub: "Still finding the thread." },
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

  const handleImportFromContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow Reach to access your contacts to import someone.');
        return;
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });
      const valid = data.filter((c) => c.name && c.phoneNumbers?.length);
      if (valid.length === 0) {
        Alert.alert('No contacts found', 'No contacts with phone numbers were found on your device.');
        return;
      }
      // On native, we'd use a picker; for now pick first result matching name
      Alert.alert('Tip', 'Type a name below and their number will be looked up when you save, or enter manually.');
    } catch (e) {
      console.error(e);
    }
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
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} className="mb-12">
            <ArrowLeft size={20} strokeWidth={1.5} color="#1C1814" opacity={0.4} />
          </TouchableOpacity>

          <Text
            className="text-ink mb-12"
            style={{ fontFamily: 'Fraunces_700Bold', fontSize: 32, lineHeight: 44, letterSpacing: -0.8 }}
          >
            Add someone
          </Text>
        </MotiView>

        <View style={{ gap: 32 }}>
          {/* Name */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 200 }}
          >
            <Text
              className="text-ink mb-3"
              style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, opacity: 0.6 }}
            >
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Their name"
              placeholderTextColor="rgba(28,24,20,0.3)"
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
          </MotiView>

          {/* Phone */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 300 }}
          >
            <Text
              className="text-ink mb-3"
              style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, opacity: 0.6 }}
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

          {/* Tier */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 400 }}
          >
            <Text
              className="text-ink mb-4"
              style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, opacity: 0.6 }}
            >
              How close are you?
            </Text>
            <View style={{ gap: 8 }}>
              {TIERS.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => setTier(t.value)}
                  activeOpacity={0.8}
                  className="w-full py-3.5 px-4 border"
                  style={{
                    borderColor: tier === t.value ? 'rgba(28,24,20,0.25)' : 'rgba(28,24,20,0.1)',
                    borderRadius: 4,
                    opacity: tier === t.value ? 1 : 0.6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: tier === t.value ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_400Regular',
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

          {/* Actions */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 900, delay: 600 }}
            style={{ gap: 12 }}
          >
            <TouchableOpacity
              onPress={handleSave}
              disabled={!name.trim() || saving}
              activeOpacity={0.8}
              className="w-full py-4 border items-center"
              style={{
                borderColor: name.trim() ? 'rgba(28,24,20,0.2)' : 'rgba(28,24,20,0.1)',
                borderRadius: 4,
                opacity: name.trim() ? 1 : 0.4,
              }}
            >
              <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 15, color: '#1C1814' }}>
                {saving ? 'Saving…' : 'Add to constellation'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
