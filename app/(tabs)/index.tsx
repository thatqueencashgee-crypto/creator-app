import { FlatList, Text, View, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppState } from "@/lib/app-state";
import { POSTS, CREATOR, type Post, type SubscriptionTier } from "@/lib/data";

const FILTERS = ["All", "Photos", "Videos", "Text"] as const;
type Filter = (typeof FILTERS)[number];

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, fan: 1, vip: 2 };

function PostCard({ post, onPress, isUnlocked }: { post: Post; onPress: () => void; isUnlocked: boolean }) {
  const locked = !isUnlocked;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      {/* Thumbnail */}
      <View style={styles.thumbnail}>
        <Text style={styles.thumbnailEmoji}>{post.preview}</Text>
        {locked && (
          <View style={styles.lockOverlay}>
            <View style={styles.lockBadge}>
              <IconSymbol name="lock.fill" size={16} color="#0A0A0A" />
              {post.price > 0 ? (
                <Text style={styles.lockPrice}>${post.price.toFixed(2)}</Text>
              ) : (
                <Text style={styles.lockPrice}>
                  {post.requiredTier === "fan" ? "Fan" : "VIP"}
                </Text>
              )}
            </View>
          </View>
        )}
        {/* Type badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {post.type === "photo" ? "📸" : post.type === "video" ? "🎬" : "📝"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{post.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{post.description}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <IconSymbol name="heart.fill" size={13} color="#FFD600" />
            <Text style={styles.metaText}>{post.likes.toLocaleString()}</Text>
          </View>
          <View style={styles.metaItem}>
            <IconSymbol name="bubble.left.fill" size={13} color="#555" />
            <Text style={styles.metaText}>{post.comments}</Text>
          </View>
          {post.price > 0 && !isUnlocked && (
            <View style={styles.ppvBadge}>
              <Text style={styles.ppvText}>PPV ${post.price.toFixed(2)}</Text>
            </View>
          )}
          {isUnlocked && post.price > 0 && (
            <View style={[styles.ppvBadge, { backgroundColor: "#1a2a1a" }]}>
              <Text style={[styles.ppvText, { color: "#4CAF50" }]}>✓ Unlocked</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function FeedScreen() {
  const router = useRouter();
  const { subscription, isPostUnlocked } = useAppState();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const filtered = POSTS.filter((p) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Photos") return p.type === "photo";
    if (activeFilter === "Videos") return p.type === "video";
    if (activeFilter === "Text") return p.type === "text";
    return true;
  });

  const tierLabel: Record<SubscriptionTier, string> = { free: "Free", fan: "⭐ Fan", vip: "👑 VIP" };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerBrand}>CashGeeMoneyy</Text>
          <Text style={styles.headerSub}>@cashgeemoneyy</Text>
        </View>
        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>{tierLabel[subscription]}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
          >
            <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Feed */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            isUnlocked={isPostUnlocked(item.id, item.requiredTier, item.price)}
            onPress={() => router.push(`/post/${item.id}` as any)}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFD600",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    color: "#555",
    marginTop: 1,
  },
  tierBadge: {
    backgroundColor: "#1A1A00",
    borderWidth: 1,
    borderColor: "#FFD600",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tierBadgeText: {
    color: "#FFD600",
    fontSize: 12,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
  },
  filterTabActive: {
    backgroundColor: "#FFD600",
  },
  filterTabText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
  },
  filterTabTextActive: {
    color: "#0A0A0A",
  },
  list: {
    padding: 12,
    gap: 12,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  thumbnail: {
    height: 180,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  thumbnailEmoji: {
    fontSize: 64,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFD600",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  lockPrice: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 14,
  },
  typeBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    padding: 4,
  },
  typeBadgeText: {
    fontSize: 14,
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardDesc: {
    color: "#888",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#888",
    fontSize: 12,
  },
  ppvBadge: {
    backgroundColor: "#1a1500",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: "auto",
  },
  ppvText: {
    color: "#FFD600",
    fontSize: 11,
    fontWeight: "700",
  },
});
