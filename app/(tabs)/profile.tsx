import { ScrollView, Text, View, Pressable, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppState } from "@/lib/app-state";
import { CREATOR, POSTS, SUBSCRIPTION_TIERS } from "@/lib/data";

export default function ProfileScreen() {
  const router = useRouter();
  const { subscription } = useAppState();

  const currentTier = SUBSCRIPTION_TIERS.find((t) => t.id === subscription)!;

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Cover */}
        <View style={styles.cover}>
          <View style={styles.coverGradient} />
          <Text style={styles.coverText}>CashGeeMoneyy</Text>
        </View>

        {/* Avatar + Stats Row */}
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 36 }}>{CREATOR.avatar}</Text>
            </View>
            {CREATOR.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={{ fontSize: 10 }}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatCount(CREATOR.totalPosts)}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatCount(CREATOR.followers)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatCount(CREATOR.subscribers)}</Text>
              <Text style={styles.statLabel}>Subscribers</Text>
            </View>
          </View>
        </View>

        {/* Name + Bio */}
        <View style={styles.bioSection}>
          <View style={styles.nameRow}>
            <Text style={styles.creatorName}>{CREATOR.name}</Text>
            <View style={[styles.tierBadge, { borderColor: currentTier.color }]}>
              <Text style={[styles.tierBadgeText, { color: currentTier.color }]}>
                {currentTier.emoji} {currentTier.name}
              </Text>
            </View>
          </View>
          <Text style={styles.username}>{CREATOR.username}</Text>
          <Text style={styles.bio}>{CREATOR.bio}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => router.push("/subscriptions" as any)}
            style={({ pressed }) => [styles.subscribeBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.subscribeBtnText}>
              {subscription === "free" ? "Subscribe" : "Manage Subscription"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/chat/conv_1" as any)}
            style={({ pressed }) => [styles.messageBtn, pressed && { opacity: 0.8 }]}
          >
            <IconSymbol name="message.fill" size={18} color="#FFD600" />
          </Pressable>
        </View>

        {/* Current Plan */}
        <View style={styles.planCard}>
          <View style={styles.planLeft}>
            <Text style={styles.planEmoji}>{currentTier.emoji}</Text>
            <View>
              <Text style={styles.planName}>{currentTier.name} Plan</Text>
              <Text style={styles.planPrice}>
                {currentTier.price === 0 ? "Free" : `$${currentTier.price.toFixed(2)}/month`}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/subscriptions" as any)}
            style={({ pressed }) => [styles.upgradeBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.upgradeBtnText}>
              {subscription === "vip" ? "Manage" : "Upgrade"}
            </Text>
          </Pressable>
        </View>

        {/* Content Grid */}
        <View style={styles.gridSection}>
          <Text style={styles.sectionTitle}>Content</Text>
          <View style={styles.grid}>
            {POSTS.map((post) => (
              <Pressable
                key={post.id}
                onPress={() => router.push(`/post/${post.id}` as any)}
                style={({ pressed }) => [styles.gridItem, pressed && { opacity: 0.75 }]}
              >
                <Text style={styles.gridEmoji}>{post.preview}</Text>
                {post.requiredTier !== "free" && (
                  <View style={styles.gridLock}>
                    <IconSymbol name="lock.fill" size={10} color="#0A0A0A" />
                  </View>
                )}
                {post.price > 0 && (
                  <View style={styles.gridPrice}>
                    <Text style={styles.gridPriceText}>${post.price}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 160,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFD600",
    opacity: 0.12,
  },
  coverText: {
    color: "#FFD600",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
    opacity: 0.15,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginTop: -28,
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFD600",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFD600",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0A0A0A",
  },
  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 8,
    paddingLeft: 12,
  },
  statItem: {
    alignItems: "center",
    gap: 2,
  },
  statNumber: {
    color: "#F5F5F5",
    fontSize: 17,
    fontWeight: "800",
  },
  statLabel: {
    color: "#888",
    fontSize: 11,
  },
  bioSection: {
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  creatorName: {
    color: "#F5F5F5",
    fontSize: 20,
    fontWeight: "800",
  },
  tierBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  username: {
    color: "#888",
    fontSize: 13,
  },
  bio: {
    color: "#AAAAAA",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 14,
  },
  subscribeBtn: {
    flex: 1,
    backgroundColor: "#FFD600",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  subscribeBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 14,
  },
  messageBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  planCard: {
    marginHorizontal: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  planLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  planEmoji: {
    fontSize: 28,
  },
  planName: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "700",
  },
  planPrice: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  upgradeBtn: {
    backgroundColor: "#FFD600",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  upgradeBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 13,
  },
  gridSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  gridItem: {
    width: "32%",
    aspectRatio: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  gridEmoji: {
    fontSize: 36,
  },
  gridLock: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFD600",
    alignItems: "center",
    justifyContent: "center",
  },
  gridPrice: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  gridPriceText: {
    color: "#FFD600",
    fontSize: 10,
    fontWeight: "700",
  },
});
