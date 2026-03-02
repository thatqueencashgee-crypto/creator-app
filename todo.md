# CreatorPass TODO

## Branding
- [x] Generate app logo (black & yellow dollar sign neon)
- [x] Update theme colors (black & yellow)
- [x] Update app.config.ts with CashGeeMoneyy branding

## Navigation
- [x] Set up 5-tab bottom navigation (Feed, Explore, Messages, Wallet, Profile)
- [x] Add icon mappings for all tabs
- [x] Set up stack navigators for Feed→PostDetail, Messages→Chat

## Screens
- [x] Feed Screen (content cards, locked/unlocked, filter tabs)
- [x] Post Detail Screen (media, unlock CTA, comments)
- [x] Creator Profile Screen (cover, bio, tiers, grid)
- [x] Subscriptions Screen (tier cards, subscribe/upgrade)
- [x] Messages Screen (thread list)
- [x] Chat Screen (bubbles, tip button)
- [x] Wallet Screen (balance, tip amounts, history)
- [x] Settings Screen (profile, notifications, theme) — merged into Profile tab

## Data & State
- [x] Mock content data (posts, creator profile, messages)
- [x] Subscription state (free/fan/vip) with AsyncStorage
- [x] Unlocked posts tracking with AsyncStorage
- [x] Wallet balance state with AsyncStorage
- [x] Tip transaction history

## UI Polish
- [x] Blurred locked content overlay (dark overlay with lock badge)
- [x] Subscription tier badge on posts
- [x] Haptic feedback on key actions
- [x] Loading states and empty states
- [x] Regenerate logo with money sign symbol in black & yellow

## New Features (Round 2)
- [x] Book a Session screen (schedule & pay for 1-on-1 video call slot)
- [x] Creator Earnings Dashboard screen (revenue, subscribers, top posts)
- [x] New Post Upload flow (title, description, media, tier, PPV price)
- [x] Wire up navigation to all three new screens from Profile tab (Creator Tools section)
