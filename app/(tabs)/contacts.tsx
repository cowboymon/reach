import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';
import type { Tier } from '../../types';

const TIER_COLORS: Record<Tier, string> = {
  Drifted: '#C47A7A',
  Reconnecting: '#7A9E87',
  Familiar: '#9B8EA8',
  Back: '#C9A84C',
};

function timeSinceLabel(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 5) return `${weeks} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export default function ContactsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, getInteractionsForContact } = useApp();

  return (
    <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 1000, delay: 400 }}
        className="flex-row justify-end px-6 pt-4 pb-2"
      >
        <TouchableOpacity
          onPress={() => router.push('/add-contact')}
          activeOpacity={0.6}
          className="p-2"
        >
          <Plus size={26} strokeWidth={1.5} color="#1C1814" opacity={0.4} />
        </TouchableOpacity>
      </MotiView>

      <ScrollView
        className="flex-1 px-10"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
        >
          <Text
            className="text-ink mb-12"
            style={{ fontFamily: 'Fraunces_700Bold', fontSize: 32, lineHeight: 44, letterSpacing: -0.8 }}
          >
            Your people
          </Text>
        </MotiView>

        {data.contacts.length === 0 ? (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 1000, delay: 300 }}
            className="items-center mt-20"
          >
            <Text
              className="text-ink italic text-center"
              style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, opacity: 0.4, lineHeight: 32 }}
            >
              Who belongs in your constellation?
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/add-contact')}
              activeOpacity={0.8}
              className="mt-8 py-3 px-8 border"
              style={{ borderColor: 'rgba(28,24,20,0.2)', borderRadius: 4 }}
            >
              <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#1C1814' }}>
                Add someone
              </Text>
            </TouchableOpacity>
          </MotiView>
        ) : (
          <View>
            {data.contacts.map((contact, index) => {
              const interactions = getInteractionsForContact(contact.id);
              const last = interactions[0];
              const lastDate = last?.date ?? contact.addedAt;
              const lastNote = last?.note;

              return (
                <MotiView
                  key={contact.id}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 1000, delay: 100 * index }}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/contact/${contact.id}`)}
                    activeOpacity={0.7}
                    className="w-full pb-6 mb-6"
                    style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(28,24,20,0.08)' }}
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <Text
                        className="text-ink"
                        style={{ fontFamily: 'Fraunces_700Bold', fontSize: 20, lineHeight: 30, flex: 1, marginRight: 12 }}
                      >
                        {contact.name}
                      </Text>
                      <View
                        className="px-3 py-1"
                        style={{ backgroundColor: TIER_COLORS[contact.tier], borderRadius: 3 }}
                      >
                        <Text
                          style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 11, color: '#F5F0E8' }}
                        >
                          {contact.tier}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className="text-ink"
                      style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, opacity: 0.4, lineHeight: 22 }}
                    >
                      {timeSinceLabel(lastDate)}
                      {lastNote ? ` · ${lastNote}` : ''}
                    </Text>
                  </TouchableOpacity>
                </MotiView>
              );
            })}

            {data.contacts.length <= 2 && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 1000, delay: 100 * (data.contacts.length + 1) }}
                className="items-center mt-16"
              >
                <Text
                  className="text-ink italic text-center"
                  style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, opacity: 0.4, lineHeight: 32 }}
                >
                  Who else belongs in your constellation?
                </Text>
              </MotiView>
            )}
          </View>
        )}
      </ScrollView>

      <Navigation />
    </View>
  );
}
