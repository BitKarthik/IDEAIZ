# Vedic Astrology App - Design Guidelines

## Authentication & User Flow

**Auth Required**: YES
- **Implementation**: SSO preferred
  - Apple Sign-In (iOS required)
  - Google Sign-In
  - Email/password as fallback
- **Onboarding after signup**:
  1. Welcome screen explaining Vedic astrology principles
  2. Birth details collection (date picker, time picker, location search with autocomplete)
  3. Subscription paywall (free trial CTA prominent, subscription options below)
  4. Birth chart generation loading screen
- **Account Management**:
  - Profile screen with birth chart visualization
  - Subscription status and billing management
  - Privacy policy & terms of service links
  - Log out with confirmation
  - Delete account under Settings > Account > Delete (double confirmation)

## Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)
- **Tab 1 - Today**: Daily horoscope and predictions
- **Tab 2 - Ask** (center, elevated): Question interface (core action)
- **Tab 3 - Profile**: User profile, birth chart, settings

**Modal Screens**:
- Subscription management
- Birth chart detail view
- Notification settings
- Onboarding flow

## Screen Specifications

### Tab 1: Today Screen
**Purpose**: Daily personalized horoscope and astrological insights
**Layout**:
- Header: Transparent, title "Today", right button for calendar icon
- Root view: ScrollView
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)
**Components**:
- Date display with current planetary transits
- Daily horoscope card (expandable)
- Key astrological events section
- Auspicious times widget
- Planetary positions visualization (simple circular diagram)

### Tab 2: Ask Screen
**Purpose**: Chat interface for asking astrology questions
**Layout**:
- Header: Transparent, title "Ask Astrologer", right button for preset questions menu
- Root view: Chat interface (KeyboardAvoidingView)
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + keyboard awareness)
**Components**:
- Message bubbles (user: right-aligned, AI: left-aligned with mystical accent)
- Preset question chips at bottom (horizontally scrollable)
- Text input with send button
- Loading indicator with spiritual animation (lotus or mandala)
- Empty state: "Ask about your career, relationships, or life path"

### Tab 3: Profile Screen
**Purpose**: View birth chart, manage subscription, app settings
**Layout**:
- Header: Transparent, title "Profile", right button for settings gear icon
- Root view: ScrollView
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)
**Components**:
- User avatar (custom generated mystical avatars)
- Display name
- Birth details summary card (clickable to view full chart)
- Subscription status card with manage button
- Birth chart thumbnail (tappable for full view)
- Quick stats: questions asked, daily streak

### Modal: Preset Questions
**Purpose**: Browse and select common astrology questions
**Layout**:
- Header: Default navigation, title "Ask About", left: close button
- Root view: ScrollView or SectionList
- Safe area insets: top (Spacing.xl), bottom (insets.bottom + Spacing.xl)
**Components**:
- Category sections: Career, Love & Relationships, Health, Finance, Spirituality, General
- Question cards with category-specific icons
- Tap to populate chat input

### Modal: Subscription Management
**Purpose**: View plan details and manage billing
**Layout**:
- Header: Default navigation, title "Subscription", left: close button
- Root view: ScrollView
- Safe area insets: top (Spacing.xl), bottom (insets.bottom + Spacing.xl)
**Components**:
- Current plan status card
- Billing information
- Upgrade/downgrade options
- Cancel subscription link (confirmation required)
- Restore purchases button

### Modal: Birth Chart Detail
**Purpose**: Interactive birth chart visualization
**Layout**:
- Header: Default navigation, title "Your Birth Chart", left: close button, right: share button
- Root view: Zoomable chart view with bottom sheet
- Safe area insets: top (Spacing.xl), bottom (insets.bottom + Spacing.xl)
**Components**:
- Full circular birth chart (Vedic style - North/South Indian format selectable)
- Planetary positions list (bottom sheet, draggable)
- House interpretations (expandable sections)
- Dasha periods visualization

## Design System

### Color Palette
**Primary Colors**:
- Primary: Deep Purple (#6B46C1) - spiritual, mystical
- Secondary: Golden Amber (#F59E0B) - auspicious, divine
- Accent: Teal (#14B8A6) - wisdom, clarity

**Neutrals**:
- Background: Off-white (#FAFAF9)
- Surface: White (#FFFFFF)
- Text Primary: Deep Gray (#1F2937)
- Text Secondary: Medium Gray (#6B7280)

**Semantic**:
- Success: Emerald (#10B981)
- Warning: Amber (#F59E0B)
- Error: Rose (#F43F5E)
- Info: Sky Blue (#0EA5E9)

**Gradients**:
- Mystical gradient: Deep Purple to Violet (#6B46C1 to #8B5CF6)
- Divine gradient: Golden to Amber (#FBBF24 to #F59E0B)

### Typography
**Font Family**: System default (SF Pro for iOS, Roboto for Android)
**Scale**:
- Heading 1: 32pt, Bold
- Heading 2: 24pt, Semibold
- Heading 3: 20pt, Semibold
- Body: 16pt, Regular
- Body Small: 14pt, Regular
- Caption: 12pt, Regular

### Component Specifications

**Cards**:
- Background: White with subtle drop shadow (shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4)
- Border radius: 16pt
- Padding: Spacing.lg (16pt)
- Touchable feedback: subtle scale (0.98) or background color shift

**Chat Bubbles**:
- User: Primary color background, white text, right-aligned, tail on right
- AI: Surface color with border, primary text, left-aligned, tail on left
- Border radius: 20pt
- Max width: 75% of screen
- Padding: Spacing.md (12pt)

**Preset Question Chips**:
- Background: Surface with subtle border
- Border radius: 24pt
- Padding: Spacing.sm horizontal, Spacing.xs vertical
- Icon: Feather icon matching category
- Press feedback: scale to 0.95

**Floating Action Elements**:
- Drop shadow: shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- Border radius: 50% for circular, 16pt for rectangular
- Elevation: sits above content

**Form Inputs**:
- Background: Surface
- Border: 1pt solid neutral-300, focus: primary color
- Border radius: 12pt
- Padding: Spacing.md
- Label: Caption size, text-secondary color, above input

**Buttons**:
- Primary: Primary color background, white text, bold
- Secondary: Transparent with primary border, primary text
- Border radius: 12pt
- Height: 48pt minimum
- Press feedback: opacity 0.8

### Visual Feedback
- All touchables: visual feedback on press (opacity, scale, or color shift)
- Loading states: subtle pulsing or rotating mandala icon
- Success states: brief checkmark animation with success color
- Error states: shake animation with error color

### Icons
- Use Feather icons from @expo/vector-icons
- Standard system icons for navigation (chevrons, x, settings)
- Custom mystical icons needed:
  - Zodiac signs (12 preset assets)
  - Planetary symbols (9 preset assets - Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
  - Lotus flower for loading states

### Critical Assets
**Generated Assets Required**:
1. User avatars (6 mystical/spiritual themed options): lotus, Om symbol, mandala, cosmic eye, star constellation, moon phases
2. Zodiac sign icons (12): Aries through Pisces in consistent style
3. Planet symbols (9): Vedic planetary glyphs
4. Birth chart background pattern (subtle, non-distracting)
5. Onboarding illustration (spiritual/cosmic theme, 3 images for onboarding steps)

**Asset Specifications**:
- Avatar size: 120x120pt (240x240px @2x)
- Icons: 24x24pt base size (48x48px @2x, 72x72px @3x)
- Style: Minimalist line art with mystical aesthetic, consistent stroke width
- Colors: Primary purple or golden amber

### Accessibility
- Minimum touch target: 44x44pt
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Support dynamic type sizing
- Semantic labels for all interactive elements
- VoiceOver/TalkBack optimized navigation
- Birth chart screen: provide text alternative for chart visualization

### Notifications
- Daily horoscope: personalized based on birth chart, sent at user-preferred time
- Icon: App icon with badge
- Sound: subtle chime
- Content: Brief prediction teaser, tap to view full reading