# CreatorPass — Mobile App Design Plan

## Overview
CreatorPass is a mobile app for independent content creators to monetize their work. Fans can browse a creator's profile, subscribe to tiers, unlock exclusive posts (pay-per-view), send tips, and message the creator.

---

## Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| primary | #C2185B (deep rose) | #E91E8C (hot pink) | CTAs, active states, badges |
| background | #FFFFFF | #0D0D0D | Screen backgrounds |
| surface | #F8F8F8 | #1A1A1A | Cards, modals |
| foreground | #1A1A1A | #F5F5F5 | Primary text |
| muted | #757575 | #9E9E9E | Secondary text, captions |
| border | #E0E0E0 | #2A2A2A | Dividers, card borders |
| success | #4CAF50 | #66BB6A | Subscription active badge |
| warning | #FF9800 | #FFA726 | Low balance, expiry |
| error | #F44336 | #EF5350 | Errors |

Brand feel: Bold, intimate, premium. Dark-mode-first aesthetic with rose/pink accent.

---

## Screen List

1. **Feed Screen** (Home tab) — Scrollable content feed with locked/unlocked posts
2. **Post Detail Screen** — Full post view with unlock CTA for locked content
3. **Creator Profile Screen** — Bio, stats, subscription tiers, pinned content
4. **Subscriptions Screen** — Manage active subscriptions, tier selection
5. **Messages Screen** — Fan ↔ Creator DM thread list
6. **Chat Screen** — Individual message thread with tip button
7. **Wallet / Tips Screen** — Balance, tip history, top-up
8. **Settings Screen** — Notifications, theme, account

---

## Primary Content & Functionality

### Feed Screen
- Header: Creator avatar + name + "Subscribe" button
- Post cards: thumbnail (blurred if locked), title, price tag or "Subscriber only" badge
- Like, comment count, lock icon
- Infinite scroll (FlatList)
- Filter tabs: All | Photos | Videos | Text

### Post Detail Screen
- Full-resolution media (image/video) or blurred overlay with unlock prompt
- Unlock button: "Unlock for $X" (pay-per-view)
- Like, comment, share, tip buttons
- Comments section

### Creator Profile Screen
- Cover photo + avatar
- Name, bio, follower/subscriber count
- Subscription tier cards (Free / Fan / VIP)
- Content grid preview

### Subscriptions Screen
- Current plan badge
- Tier comparison cards: Free / Fan ($9.99/mo) / VIP ($24.99/mo)
- Subscribe / Upgrade / Cancel CTA
- Billing history list

### Messages Screen
- List of conversation threads
- Unread badge
- Last message preview

### Chat Screen
- Bubble-style messages
- Tip button in header ("Send Tip")
- Media attachment preview

### Wallet Screen
- Balance display (large)
- Quick tip amounts: $1, $5, $10, $20, Custom
- Transaction history

### Settings Screen
- Profile editing
- Notification toggles
- Theme (Light / Dark / System)
- Privacy & Security

---

## Key User Flows

### Subscribe Flow
Home Feed → Creator Profile → Subscription Tiers → Select Tier → Confirm → Subscribed ✓

### Unlock Post Flow
Feed → Tap locked post → Post Detail (blurred) → "Unlock for $X" → Confirm → Content revealed ✓

### Send Tip Flow
Chat Screen → Tap "Tip" → Wallet (quick amounts) → Confirm → Tip sent ✓

### Browse Free Content
Feed → Filter "All" → Tap unlocked post → Post Detail (full content) ✓

---

## Navigation Structure

Bottom Tab Bar (5 tabs):
1. Feed (home icon)
2. Discover / Explore (search icon)
3. Messages (chat bubble icon)
4. Wallet (wallet icon)
5. Profile / Settings (person icon)

Stack navigators:
- Feed → Post Detail
- Profile → Subscriptions
- Messages → Chat
