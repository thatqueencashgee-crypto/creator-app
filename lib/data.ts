// Mock data for CreatorPass app

export type SubscriptionTier = "free" | "fan" | "vip";

export interface Creator {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverColor: string;
  followers: number;
  subscribers: number;
  totalPosts: number;
  verified: boolean;
}

export interface Post {
  id: string;
  creatorId: string;
  type: "photo" | "video" | "text";
  title: string;
  preview: string; // emoji or placeholder
  description: string;
  likes: number;
  comments: number;
  price: number; // 0 = free, >0 = PPV
  requiredTier: SubscriptionTier; // minimum tier to view
  createdAt: string;
  tags: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isCreator: boolean;
}

export interface Conversation {
  id: string;
  creatorId: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
}

export interface Transaction {
  id: string;
  type: "tip" | "subscription" | "unlock";
  amount: number;
  description: string;
  date: string;
}

export const CREATOR: Creator = {
  id: "creator_1",
  name: "CashGeeMoneyy",
  username: "@cashgeemoneyy",
  bio: "✨ Exclusive content, behind-the-scenes, and more. Subscribe to unlock the full experience. New posts every day!",
  avatar: "🌟",
  coverColor: "#FFD600",
  followers: 48200,
  subscribers: 3840,
  totalPosts: 247,
  verified: true,
};

export const POSTS: Post[] = [
  {
    id: "p1",
    creatorId: "creator_1",
    type: "photo",
    title: "Golden Hour Shoot 🌅",
    preview: "🌅",
    description: "Behind the scenes from today's golden hour photoshoot. The lighting was absolutely perfect!",
    likes: 1240,
    comments: 87,
    price: 0,
    requiredTier: "free",
    createdAt: "2026-03-02T18:00:00Z",
    tags: ["photography", "behindthescenes"],
  },
  {
    id: "p2",
    creatorId: "creator_1",
    type: "video",
    title: "Exclusive Vlog — Day in My Life 🎬",
    preview: "🎬",
    description: "A full day with me — morning routine, studio session, and more. Fan subscribers only!",
    likes: 3210,
    comments: 204,
    price: 0,
    requiredTier: "fan",
    createdAt: "2026-03-01T14:30:00Z",
    tags: ["vlog", "lifestyle"],
  },
  {
    id: "p3",
    creatorId: "creator_1",
    type: "photo",
    title: "Studio Session — Unreleased Set 📸",
    preview: "📸",
    description: "Full studio session photos — 42 exclusive shots from last week's private shoot.",
    likes: 5670,
    comments: 412,
    price: 4.99,
    requiredTier: "fan",
    createdAt: "2026-02-28T10:00:00Z",
    tags: ["exclusive", "studio"],
  },
  {
    id: "p4",
    creatorId: "creator_1",
    type: "video",
    title: "VIP Only — Full Uncut Video 🔥",
    preview: "🔥",
    description: "The full uncut version. VIP members get access to everything, no limits.",
    likes: 8920,
    comments: 731,
    price: 9.99,
    requiredTier: "vip",
    createdAt: "2026-02-27T20:00:00Z",
    tags: ["vip", "exclusive"],
  },
  {
    id: "p5",
    creatorId: "creator_1",
    type: "text",
    title: "Thank You Note 💛",
    preview: "💛",
    description: "A personal message to all my amazing supporters. You mean the world to me!",
    likes: 2100,
    comments: 156,
    price: 0,
    requiredTier: "free",
    createdAt: "2026-02-26T12:00:00Z",
    tags: ["personal"],
  },
  {
    id: "p6",
    creatorId: "creator_1",
    type: "photo",
    title: "New Look — Exclusive Preview 👀",
    preview: "👀",
    description: "First look at my new style. Fan subscribers get early access!",
    likes: 4450,
    comments: 330,
    price: 2.99,
    requiredTier: "fan",
    createdAt: "2026-02-25T16:00:00Z",
    tags: ["fashion", "exclusive"],
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv_1",
    creatorId: "creator_1",
    lastMessage: "Thank you so much for subscribing! 💛",
    lastMessageTime: "2m ago",
    unread: 1,
    messages: [
      { id: "m1", senderId: "user", text: "Hey! Just subscribed to the Fan tier 🙌", timestamp: "10:32 AM", isCreator: false },
      { id: "m2", senderId: "creator_1", text: "Thank you so much for subscribing! 💛", timestamp: "10:34 AM", isCreator: true },
      { id: "m3", senderId: "creator_1", text: "You'll get access to all my exclusive content right away. Let me know if you have any questions!", timestamp: "10:34 AM", isCreator: true },
    ],
  },
];

export const SUBSCRIPTION_TIERS = [
  {
    id: "free" as SubscriptionTier,
    name: "Free",
    price: 0,
    emoji: "👀",
    color: "#888888",
    perks: ["Access to public posts", "Follow creator updates", "Comment on free posts"],
  },
  {
    id: "fan" as SubscriptionTier,
    name: "Fan",
    price: 9.99,
    emoji: "⭐",
    color: "#FFD600",
    perks: ["Everything in Free", "Exclusive Fan-only posts", "Direct messaging", "Early access to content", "Subscriber badge"],
  },
  {
    id: "vip" as SubscriptionTier,
    name: "VIP",
    price: 24.99,
    emoji: "👑",
    color: "#FFD600",
    perks: ["Everything in Fan", "VIP-only content", "Priority DM responses", "Monthly video call access", "Name in credits", "Exclusive VIP badge"],
  },
];
