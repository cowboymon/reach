import { createBrowserRouter } from 'react-router';
import { Home } from './screens/Home';
import { PostContact } from './screens/PostContact';
import { ContactProfile } from './screens/ContactProfile';
import { Rhythm } from './screens/Rhythm';
import { OnboardingThree } from './screens/OnboardingThree';
import { OnboardingSwipe } from './screens/OnboardingSwipe';
import { Contacts } from './screens/Contacts';
import { Profile } from './screens/Profile';
import { ReachOut } from './screens/ReachOut';
import { Settings } from './screens/Settings';
import { RootRedirect } from './screens/RootRedirect';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootRedirect,
  },
  {
    path: '/onboarding',
    Component: OnboardingThree,
  },
  {
    path: '/onboarding/swipe',
    Component: OnboardingSwipe,
  },
  {
    path: '/home',
    Component: Home,
  },
  {
    path: '/reach-out',
    Component: ReachOut,
  },
  {
    path: '/post-contact',
    Component: PostContact,
  },
  {
    path: '/contact',
    Component: ContactProfile,
  },
  {
    path: '/rhythm',
    Component: Rhythm,
  },
  {
    path: '/contacts',
    Component: Contacts,
  },
  {
    path: '/profile',
    Component: Profile,
  },
  {
    path: '/settings',
    Component: Settings,
  },
]);