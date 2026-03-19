REACH
UI / UX Developer Handoff
A quiet practice.
This document is the complete UI/UX handoff for the Reach app. It covers navigation structure, screen-by-screen specifications, locked copy, colour system, and interaction notes. Build to this spec. Flag anything ambiguous rather than inventing solutions silently.


1. Navigation
Three tabs only. No fourth tab. Three tabs, each earning its place — nothing exists because apps are supposed to have four tabs.

Home
Today’s person. The primary action screen. Reached from anywhere.
This week
Your constellation this week. Names, days, feeling dots. A record, not a scorecard.
Your people
All people in the constellation. Tiers, last contact, manage.


Settings lives as a small gear icon top right of the Home screen. Not a tab. Add new person lives as a + button on the Your people screen. Not a tab.


2. Screen specifications
2.1  Home screen
✓  LOCKED: Copy, layout, memory note in italic, tier label — all locked.

Name
Large, bold, warm. The person’s full name. Generous whitespace above.
Tier label
Small, muted, below name. One of: Drifted / Reconnecting / Familiar / Back.
Memory note
Last note from journal in italic below tier. Muted colour. e.g. “She just started a new job in April.”
Last contact
Very small, muted. e.g. “Last reached out 3 weeks ago.”
Primary action
Gold button, full width: “Reach out”
Defer
Small quiet underlined text link below the button — NOT a full button. Copy: “Not today”


Not today — defer interaction
When the user taps “Not today”, the card is replaced with a soft rotating message. Three messages, cycling randomly:

“Some days aren’t the day. Tomorrow might be.”
“They’ll still be there tomorrow.”
“Still there. Try tomorrow.”

No button to dismiss. Just the message sitting quietly. Home resets tomorrow. The defer link should feel like an escape valve, not a choice — which is why it must never have the visual weight of a full button.


2.2  Format screen
✓  LOCKED: This entire screen is locked. Do not change anything.

Headline
Person’s name. Large, bold.
Subhead
“A text, a call. Whatever comes naturally.” Italic, muted.
Option 1
Outlined button with phone icon: “A call”
Option 2
Outlined button with message icon: “A message”
Primary action
Gold button, full width: “I’ve reached out”


“I’ve reached out” is past tense and self-reported by design. The app never verifies. The format buttons (A call / A message) log the format used and feed into the check-in screen. I’ve reached out fires regardless of which format was selected.


2.3  Check-in screen
✓  LOCKED: Good · Quiet · Hard — locked. Do not change.

Headline
“How did it go?” Italic, generous spacing.
Three options
Equal-width tap targets in a row: Good · Quiet · Hard
Optional note
Label: “What were they up to?” Placeholder: “A few words. Just for you.” Free text. Max 140 chars.
Optional label
“Optional” in very small muted text below the field.
Primary action
“Done” button — inactive until a feeling is tapped, then activates.


The check-in must be completable in one tap. If the user never types anything, that is fine. The feeling tap is the minimum. Done becomes active the moment a feeling is selected.


2.4  Contact profile
✓  LOCKED: Layout, tier description copy, interaction history format — all locked.

Name
Large, bold. Top of screen.
Tier pill
Coloured pill below name. See tier colour system in Section 3.
Tier description
Small italic copy below pill. One line per tier — see copy table below.
Interaction history
Left-border entries. Each entry: date (top left), format type (top right), feeling (bold), memory note (italic below).
Edit tier
Ghost button at bottom of screen.


Tier description copy
Drifted
You’ve been meaning to reach out.
Reconnecting
The door’s open again.
Familiar
We’re finding our rhythm again. No pressure, just presence.
Back
Just there. Like always.



2.5  Your people
List of all people in the constellation. Clean, readable, no clutter.

Heading
“Your people” — warm, plain, no metaphor overload.
Each row
Name (bold), time since last contact (muted), tier pill (right aligned).
Add button
+ button top right or bottom of list. Opens add new person flow.
Tap row
Opens contact profile for that person.


No counts. No statistics. No “24 stars” or “17 conversations.” This is a list of people, not a dashboard.


2.6  This week
✓  LOCKED: Layout and closing line locked.

Heading
“Your constellation this week.”
Each row
Name (bold), day of week (muted right), feeling dot (coloured), feeling word below name.
Closing line
“A good week.” Always. Regardless of how many interactions. It’s a tone, not a calculation.
Empty state
“A quiet week. That’s okay.”


No counts. No numbers that reset. The closing line “A good week.” appears even if only one person was reached out to. It is not a reward for hitting a target — it’s a gentle acknowledgment that any connection is worth noting.


2.7  Settings screen
Accessed via gear icon top right of Home. Not a nav tab. Single quiet page — not a control panel.

Cadence
How often the app selects someone. Options: Daily / Every 2 days / Weekdays only. Default: Daily.
Notification time
What time the daily nudge arrives. Single time picker. Default: 9:00am.
Notifications
On/off toggle.
Add to constellation
Shortcut to the same + flow as Your people screen.


Four controls only. Nothing else. The app should not feel like it has opinions about how the user manages their life. These are practical utilities, kept minimal.


3. Colour system
The palette is locked. Do not introduce new colours. Do not use the gold decoratively — it belongs to active states, the constellation, and primary actions only.

Deep ink  #1C1814
Primary dark surface. Headlines on light backgrounds.
Linen  #FAF7F2
Primary light surface.
Warm gold  #E8A832
Hero accent. Primary buttons, active states, constellation nodes, tier pill for Back.
Amber  #F5C842
Secondary gold. Glow, feeling dot for Good.
Sage  #7AAE8E
Tier pill for Reconnecting. Feeling dot for Quiet/Okay.
Dusty rose  #D4847A
Tier pill for Drifted. Feeling dot for Hard.
Mauve  #B08FA8
Tier pill for Familiar.
Kraft  #E8DFD0
Card backgrounds, texture, dividers.
Muted  #8a8278
Secondary text, subheads, memory notes.


Tier pill colours

Drifted
Reconnecting
Familiar
Back


Feeling dot colours
Good
Amber  #F5C842
Quiet
Sage  #7AAE8E
Hard
Dusty rose  #D4847A



4. Typography
Headlines / names
Bold sans-serif. Large, generous. Arial or Helvetica.
Subheads
Italic. Muted colour. Smaller than headline.
Body / UI labels
Regular weight. Readable, never compressed.
Memory notes
Italic. Muted. Feels like handwriting — personal, not clinical.
Line height
Generous throughout. Nothing feels tight.

The app uses a serif display font in the current Figma designs (the rounded serif on names and headlines). If that typeface is confirmed in Figma, carry it through. If not available in code, fall back to Georgia or a system serif for headlines only.


5. Interaction notes
Transitions
Slow and deliberate. Page turns, not button pops. Nothing bounces or springs.
Haptics
Light haptic on feeling selection (Good/Quiet/Hard). Nothing else.
Buttons
Active on tap, not on press-hold. No bouncing animations.
Empty states
Always warm. Never “No data yet” — always a human line. See screen specs above.
Error states
Minimal. Soft. Never alarming.
Loading
No spinners where avoidable. Skeleton screens or instant.



6. What good looks like
The build is successful if a person can:

Complete onboarding in under 60 seconds.
Open the app, see who to reach out to, open WhatsApp/iMessage/phone with that contact, and return to log the interaction — in under 2 minutes total.
Come back the next day and feel like the app remembered what mattered.
After a week, feel like the app is helping them be the kind of person they want to be — not chasing them for compliance.

The build has failed if:

The check-in feels like a form.
The user feels guilty for missing a day.
The defer link looks like a button.
Any number or count appears on the This week or Your people screens.
Anything about the experience makes the user feel surveilled.
The app feels like a CRM or a task manager.


Reach — A quiet practice.
Show up. The people who matter are still there.
