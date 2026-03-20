import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { Cadence } from '../types';

const CADENCE_OPTIONS: { value: Cadence; label: string; sub?: string }[] = [
  { value: 'Daily', label: 'Every day' },
  { value: 'Every 2 days', label: 'Every couple days' },
  { value: 'Weekdays only', label: 'Weekdays only' },
  { value: 'Surprise', label: 'When it feels right', sub: 'Reach picks the rhythm for you' },
];

const TIME_OPTIONS = [
  { value: '08:00', label: 'Morning (8am)' },
  { value: '12:00', label: 'Midday (noon)' },
  { value: '18:00', label: 'Evening (6pm)' },
  { value: 'surprise', label: "Whenever the moment's right", sub: 'Reach finds a quiet moment in your day' },
];

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, updateSettings } = useApp();
  const { cadence, notificationTime, notificationsEnabled } = data.settings;

  return (
    <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 px-10"
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 80 }}
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
            className="text-ink mb-16"
            style={{ fontFamily: 'Fraunces_700Bold', fontSize: 32, lineHeight: 44, letterSpacing: -0.8 }}
          >
            Settings
          </Text>
        </MotiView>

        <View style={{ gap: 48 }}>
          {/* Cadence */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 200 }}
          >
            <Text
              className="text-ink mb-4"
              style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, opacity: 0.6 }}
            >
              How often should Reach nudge you?
            </Text>
            <View style={{ gap: 8 }}>
              {CADENCE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => updateSettings({ cadence: opt.value })}
                  activeOpacity={0.8}
                  className="w-full py-3.5 px-4 border"
                  style={{
                    borderColor: cadence === opt.value ? 'rgba(28,24,20,0.25)' : 'rgba(28,24,20,0.1)',
                    borderRadius: 4,
                    opacity: cadence === opt.value ? 1 : 0.6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: cadence === opt.value ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_400Regular',
                      fontSize: 14,
                      color: '#1C1814',
                    }}
                  >
                    {opt.label}
                  </Text>
                  {opt.sub && (
                    <Text
                      style={{
                        fontFamily: 'PlusJakartaSans_400Regular',
                        fontSize: 12,
                        color: '#1C1814',
                        opacity: 0.5,
                        fontStyle: 'italic',
                        marginTop: 2,
                      }}
                    >
                      {opt.sub}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </MotiView>

          {/* Notification time */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 350 }}
          >
            <Text
              className="text-ink mb-4"
              style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, opacity: 0.6 }}
            >
              What time works best?
            </Text>
            <View style={{ gap: 8 }}>
              {TIME_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => updateSettings({ notificationTime: opt.value })}
                  activeOpacity={0.8}
                  className="w-full py-3.5 px-4 border"
                  style={{
                    borderColor: notificationTime === opt.value ? 'rgba(28,24,20,0.25)' : 'rgba(28,24,20,0.1)',
                    borderRadius: 4,
                    opacity: notificationTime === opt.value ? 1 : 0.6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: notificationTime === opt.value ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_400Regular',
                      fontSize: 14,
                      color: '#1C1814',
                    }}
                  >
                    {opt.label}
                  </Text>
                  {opt.sub && (
                    <Text
                      style={{
                        fontFamily: 'PlusJakartaSans_400Regular',
                        fontSize: 12,
                        color: '#1C1814',
                        opacity: 0.5,
                        fontStyle: 'italic',
                        marginTop: 2,
                      }}
                    >
                      {opt.sub}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </MotiView>

          {/* Notifications toggle */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 500 }}
            className="flex-row items-center justify-between py-3"
          >
            <Text
              style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#1C1814', opacity: 0.6 }}
            >
              Keep me in the loop?
            </Text>
            <TouchableOpacity
              onPress={() => updateSettings({ notificationsEnabled: !notificationsEnabled })}
              activeOpacity={0.8}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                backgroundColor: notificationsEnabled ? '#C9A84C' : 'rgba(28,24,20,0.15)',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  backgroundColor: '#F5F0E8',
                  borderRadius: 10,
                  left: notificationsEnabled ? 26 : 2,
                }}
              />
            </TouchableOpacity>
          </MotiView>

          {/* Add to constellation */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 900, delay: 600 }}
          >
            <TouchableOpacity
              onPress={() => router.push('/add-contact')}
              activeOpacity={0.8}
              className="w-full py-4 border items-center"
              style={{ borderColor: 'rgba(28,24,20,0.15)', borderRadius: 4 }}
            >
              <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#1C1814' }}>
                Add to constellation
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </ScrollView>
    </View>
  );
}
