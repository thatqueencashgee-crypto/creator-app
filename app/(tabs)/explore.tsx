import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { CREATOR, POSTS, SUBSCRIPTION_TIERS } from "@/lib/data";
import { useAppState } from "@/lib/app-state";

const TRENDING_TAGS = ["#exclusive", "#vip", "#behindthescenes", "#studio", "#lifestyle", "#vlog"];

export default function ExploreScreen() {
  const router = useRouter();
  const { subscription } = useAppState();

  const topPosts = [...POSTS].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSub}>Discover exclusive content</Text>
        </View>

        {/* Featured Creator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Creator</Text>
          <Pressable
            onPress={() => router.push("/(tabs)/profile" as any)}
            style={({ pressed }) => [styles.creatorCard, pressed && { opacity: 0.85 }]}
          >
            <View style={styles.creatorCardCover}>
              <Text style={styles.creatorCardCoverText}>CashGeeMoneyy</Text>
            </View>
            <View style={styles.creatorCardBody}>
              <View style={styles.creatorCardAvatar}>
                <Text style={{ fontSize: 28 }}>{CREATOR.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.creatorCardName}>{CREATOR.name}</Text>
                <Text style={styles.creatorCardUsername}>{CREATOR.username}</Text>
                <Text style={styles.creatorCardBio} numberOfLines={2}>{CREATOR.bio}</Text>
              </View>
            </View>
            <View style={styles.creatorCardStats}>
              <View style={styles.creatorStat}>
                <Text style={styles.creatorStatNum}>{(CREATOR.followers / 1000).toFixed(1)}K</Text>
                <Text style={styles.creatorStatLabel}>Followers</Text>
              </View>
              <View style={styles.creatorStat}>
                <Text style={styles.creatorStatNum}>{(CREATOR.subscribers / 1000).toFixed(1)}K</Text>
                <Text style={styles.creatorStatLabel}>Subscribers</Text>
              </View>
              <View style={styles.creatorStat}>
                <Text style={styles.creatorStatNum}>{CREATOR.totalPosts}</Text>
                <Text style={styles.creatorStatLabel}>Posts</Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push("/subscriptions" as any)}
              style={({ pressed }) => [styles.subscribeBtn, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.subscribeBtnText}>
                {subscription === "free" ? "Subscribe Now" : "✓ Subscribed"}
              </Text>
            </Pressable>
          </Pressable>
        </View>

        {/* Trending Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Tags</Text>
          <View style={styles.tagsWrap}>
            {TRENDING_TAGS.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Posts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Top Posts</Text>
          <View style={styles.topPostsList}>
            {topPosts.map((post, index) => (
              <Pressable
                key={post.id}
                onPress={() => router.push(`/post/${post.id}` as any)}
                style={({ pressed }) => [styles.topPostRow, pressed && { opacity: 0.75 }]}
              >
                <Text style={styles.topPostRank}>#{index + 1}</Text>
                <View style={styles.topPostThumb}>
                  <Text style={{ fontSize: 26 }}>{post.preview}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topPostTitle} numberOfLines={1}>{post.title}</Text>
                  <View style={styles.topPostMeta}>
                    <IconSymbol name="heart.fill" size={12} color="#FFD600" />
                    <Text style={styles.topPostMetaText}>{post.likes.toLocaleString()}</Text>
                  </View>
                </View>
                {post.price > 0 && (
                  <View style={styles.ppvBadge}>
                    <Text style={styles.ppvText}>${post.price}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Subscription Plans Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          <View style={styles.plansRow}>
            {SUBSCRIPTION_TIERS.filter((t) => t.id !== "free").map((tier) => (
              <Pressable
                key={tier.id}
                onPress={() => router.push("/subscriptions" as any)}
                style={({ pressed }) => [styles.planCard, pressed && { opacity: 0.85 }]}
              >
                <Text style={styles.planEmoji}>{tier.emoji}</Text>
                <Text style={styles.planName}>{tier.name}</Text>
                <Text style={styles.planPrice}>${tier.price}/mo</Text>
                <Text style={styles.planPerks}>{tier.perks.length} perks included</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  headerTitle: {
    color: "#F5F5F5",
    fontSize: 24,
    fontWeight: "800",
  },
  headerSub: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  creatorCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  creatorCardCover: {
    height: 80,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  creatorCardCoverText: {
    color: "#FFD600",
    fontSize: 22,
    fontWeight: "900",
    opacity: 0.2,
    letterSpacing: -1,
  },
  creatorCardBody: {
    flexDirection: "row",
    padding: 14,
    gap: 12,
    alignItems: "flex-start",
  },
  creatorCardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD600",
    marginTop: -28,
  },
  creatorCardName: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "800",
  },
  creatorCardUsername: {
    color: "#888",
    fontSize: 12,
    marginTop: 1,
  },
  creatorCardBio: {
    color: "#AAAAAA",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  creatorCardStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  creatorStat: {
    alignItems: "center",
    gap: 2,
  },
  creatorStatNum: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "800",
  },
  creatorStatLabel: {
    color: "#888",
    fontSize: 11,
  },
  subscribeBtn: {
    margin: 14,
    backgroundColor: "#FFD600",
    borderRadius: 28,
    paddingVertical: 12,
    alignItems: "center",
  },
  subscribeBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 14,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  tagChipText: {
    color: "#FFD600",
    fontSize: 13,
    fontWeight: "600",
  },
  topPostsList: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  topPostRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  topPostRank: {
    color: "#FFD600",
    fontSize: 14,
    fontWeight: "800",
    width: 24,
  },
  topPostThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  topPostTitle: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "600",
  },
  topPostMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  topPostMetaText: {
    color: "#888",
    fontSize: 12,
  },
  ppvBadge: {
    backgroundColor: "#1a1500",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: "#FFD600",
  },
  ppvText: {
    color: "#FFD600",
    fontSize: 11,
    fontWeight: "700",
  },
  plansRow: {
    flexDirection: "row",
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  planEmoji: {
    fontSize: 28,
  },
  planName: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "800",
  },
  planPrice: {
    color: "#FFD600",
    fontSize: 13,
    fontWeight: "700",
  },
  planPerks: {
    color: "#888",
    fontSize: 11,
    textAlign: "center",
  },
});
