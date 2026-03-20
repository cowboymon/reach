import { View, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

function HomeIcon({ active }: { active: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        stroke="#1C1814"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.35}
      />
    </Svg>
  );
}

function PeopleIcon({ active }: { active: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={8} r={4} stroke="#1C1814" strokeWidth={1.5} opacity={active ? 1 : 0.35} />
      <Path
        d="M2 20C2 17 5 14 9 14C13 14 16 17 16 20"
        stroke="#1C1814"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={active ? 1 : 0.35}
      />
      <Path
        d="M17 11C18.6569 11 20 9.65685 20 8C20 6.34315 18.6569 5 17 5"
        stroke="#1C1814"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={active ? 0.7 : 0.2}
      />
      <Path
        d="M22 20C22 17.5 20.5 15.5 17 15"
        stroke="#1C1814"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={active ? 0.7 : 0.2}
      />
    </Svg>
  );
}

function RhythmIcon({ active }: { active: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12H6L9 5L12 19L15 10L18 14L21 12"
        stroke="#1C1814"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.35}
      />
    </Svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke="#1C1814" strokeWidth={1.5} opacity={active ? 1 : 0.35} />
      <Path
        d="M4 20C4 17 7.5 14 12 14C16.5 14 20 17 20 20"
        stroke="#1C1814"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={active ? 1 : 0.35}
      />
    </Svg>
  );
}

const TABS = [
  { href: '/(tabs)/home', Icon: HomeIcon },
  { href: '/(tabs)/contacts', Icon: PeopleIcon },
  { href: '/(tabs)/rhythm', Icon: RhythmIcon },
  { href: '/(tabs)/profile', Icon: ProfileIcon },
];

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom + 8,
        paddingTop: 16,
        backgroundColor: '#F5F0E8',
        borderTopWidth: 1,
        borderTopColor: 'rgba(28,24,20,0.06)',
      }}
    >
      <View className="flex-row justify-around items-center px-8">
        {TABS.map(({ href, Icon }) => {
          const active = pathname.startsWith(href.replace('(tabs)/', '').replace('/(tabs)', '')) || pathname === href;
          return (
            <TouchableOpacity
              key={href}
              onPress={() => router.push(href as any)}
              className="p-3"
              activeOpacity={0.6}
            >
              <Icon active={active} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
