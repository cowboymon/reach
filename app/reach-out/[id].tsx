import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { Phone, MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';

export default function ReachOut() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data } = useApp();

  const contact = data.contacts.find((c) => c.id === id);

  if (!contact) {
    return (
      <View className="flex-1 bg-linen items-center justify-center" style={{ paddingTop: insets.top }}>
        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', color: '#1C1814', opacity: 0.4 }}>
          Contact not found.
        </Text>
      </View>
    );
  }

  const handleCall = async () => {
    if (!contact.phone) {
      Alert.alert('No phone number', 'This contact has no phone number saved.');
      return;
    }
    const url = `tel:${contact.phone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Cannot make call', 'Your device cannot make phone calls from this app.');
    }
  };

  const handleText = async () => {
    if (!contact.phone) {
      Alert.alert('No phone number', 'This contact has no phone number saved.');
      return;
    }
    const url = `sms:${contact.phone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Cannot send message', 'Your device cannot send messages from this app.');
    }
  };

  const handleDone = () => {
    router.push(`/post-contact/${contact.id}`);
  };

  return (
    <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center justify-center px-10 pb-28">
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1400, delay: 300 }}
          className="w-full"
        >
          <View className="items-center mb-16">
            <Text
              className="text-ink mb-6 text-center"
              style={{ fontFamily: 'Fraunces_700Bold', fontSize: 40, lineHeight: 52, letterSpacing: -0.8 }}
            >
              {contact.name}
            </Text>
            <Text
              className="text-ink italic text-center"
              style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, opacity: 0.5, lineHeight: 32 }}
            >
              A text, a call. Whatever comes naturally.
            </Text>
          </View>

          <View className="mb-16" style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={handleCall}
              activeOpacity={0.8}
              className="w-full py-5 border flex-row items-center justify-center"
              style={{ borderColor: 'rgba(28,24,20,0.15)', borderRadius: 4, gap: 12 }}
            >
              <Phone size={20} strokeWidth={1.5} color="#1C1814" />
              <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 15, color: '#1C1814' }}>
                A call
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleText}
              activeOpacity={0.8}
              className="w-full py-5 border flex-row items-center justify-center"
              style={{ borderColor: 'rgba(28,24,20,0.15)', borderRadius: 4, gap: 12 }}
            >
              <MessageCircle size={20} strokeWidth={1.5} color="#1C1814" />
              <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 15, color: '#1C1814' }}>
                A message
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleDone}
            activeOpacity={0.8}
            className="w-full py-4 items-center"
            style={{ backgroundColor: '#C9A84C', borderRadius: 4 }}
          >
            <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: '#1C1814' }}>
              I've reached out
            </Text>
          </TouchableOpacity>
        </MotiView>
      </View>

      <Navigation />
    </View>
  );
}
