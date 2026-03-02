import { ScrollView, Text, View, Pressable, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppState } from "@/lib/app-state";
import { POSTS, CREATOR, SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/data";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, fan: 1, vip: 2 };

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { subscription, isPostUnlocked, unlockPost, walletBalance, setSubscription } = useAppState();

  const post = POSTS.find((p) => p.id === id);
  if (!post) return null;

  const unlocked = isPostUnlocked(post.id, post.requiredTier, post.price);
  const needsHigherTier = TIER_RANK[subscription] < TIER_RANK[post.requiredTier];
  const needsPPV = !unlocked && !needsHigherTier && post.price > 0;

  const handleUnlock = () => {
    if (needsHigherTier) {
      router.push("/subscriptions" as any);
      return;
    }
    if (needsPPV) {
      if (walletBalance < post.price) {
        Alert.alert("Insufficient Balance", "Please top up your wallet to unlock this post.", [{ text: "OK" }]);
        return;
      }
      Alert.alert(
        "Unlock Post",
        `Unlock "${post.title}" for $${post.price.toFixed(2)}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: `Unlock $${post.price.toFixed(2)}`,
            onPress: () => {
              const success = unlockPost(post.id, post.price);
              if (success && Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            },
          },
        ]
      );
    }
  };

  const tierInfo = SUBSCRIPTION_TIERS.find((t) => t.id === post.requiredTier);

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="arrow.left" size={22} color="#F5F5F5" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{post.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Media Area */}
        <View style={styles.mediaContainer}>
          {unlocked ? (
            <View style={styles.mediaUnlocked}>
              <Text style={styles.mediaEmoji}>{post.preview}</Text>
              <Text style={styles.mediaUnlockedLabel}>
                {post.type === "video" ? "▶ Video Playing" : post.type === "photo" ? "Full Resolution" : "Full Post"}
              </Text>
            </View>
          ) : (
            <View style={styles.mediaLocked}>
              <Text style={[styles.mediaEmoji, { opacity: 0.25 }]}>{post.preview}</Text>
              <View style={styles.lockedOverlay}>
                <View style={styles.lockIcon}>
                  <IconSymbol name="lock.fill" size={32} color="#0A0A0A" />
                </View>
                <Text style={styles.lockedTitle}>
                  {needsHigherTier
                    ? `${post.requiredTier.charAt(0).toUpperCase() + post.requiredTier.slice(1)} Subscribers Only`
                    : `Unlock for $${post.price.toFixed(2)}`}
                </Text>
                <Text style={styles.lockedSub}>
                  {needsHigherTier
                    ? `Subscribe to ${post.requiredTier.toUpperCase()} to access this content`
                    : `One-time pay-per-view purchase`}
                </Text>
                <Pressable
                  onPress={handleUnlock}
                  style={({ pressed }) => [styles.unlockBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] }]}
                >
                  <IconSymbol name={needsHigherTier ? "star.fill" : "lock.open.fill"} size={18} color="#0A0A0A" />
                  <Text style={styles.unlockBtnText}>
                    {needsHigherTier ? `Subscribe to ${post.requiredTier.toUpperCase()}` : `Unlock — $${post.price.toFixed(2)}`}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Post Info */}
        <View style={styles.infoSection}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <IconSymbol name="heart.fill" size={14} color="#FFD600" />
              <Text style={styles.metaText}>{post.likes.toLocaleString()} likes</Text>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol name="bubble.left.fill" size={14} color="#555" />
              <Text style={styles.metaText}>{post.comments} comments</Text>
            </View>
          </View>
          <Text style={styles.postDesc}>{post.description}</Text>

          {/* Tags */}
          <View style={styles.tags}>
            {post.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Creator Info */}
        <View style={styles.creatorSection}>
          <View style={styles.creatorAvatar}>
            <Text style={{ fontSize: 22 }}>{CREATOR.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.creatorName}>{CREATOR.name}</Text>
            <Text style={styles.creatorUsername}>{CREATOR.username}</Text>
          </View>
          <Pressable
            onPress={() => router.push("/subscriptions" as any)}
            style={({ pressed }) => [styles.subBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.subBtnText}>Subscribe</Text>
          </Pressable>
        </View>

        {/* Action Buttons */}
        {unlocked && (
          <View style={styles.actionRow}>
            <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}>
              <IconSymbol name="heart.fill" size={22} color="#FFD600" />
              <Text style={styles.actionText}>Like</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}>
              <IconSymbol name="bubble.left.fill" size={22} color="#888" />
              <Text style={styles.actionText}>Comment</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/chat/conv_1" as any)}
              style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
            >
              <IconSymbol name="dollarsign.circle.fill" size={22} color="#FFD600" />
              <Text style={styles.actionText}>Tip</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 8,
  },
  mediaContainer: {
    height: 280,
    backgroundColor: "#111",
  },
  mediaUnlocked: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  mediaEmoji: {
    fontSize: 80,
  },
  mediaUnlockedLabel: {
    color: "#4CAF50",
    fontSize: 13,
    fontWeight: "600",
  },
  mediaLocked: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFD600",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  lockedTitle: {
    color: "#F5F5F5",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  lockedSub: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  unlockBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFD600",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  unlockBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 15,
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  postTitle: {
    color: "#F5F5F5",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    color: "#888",
    fontSize: 13,
  },
  postDesc: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  tagText: {
    color: "#FFD600",
    fontSize: 12,
  },
  creatorSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  creatorAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD600",
  },
  creatorName: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "700",
  },
  creatorUsername: {
    color: "#888",
    fontSize: 12,
    marginTop: 1,
  },
  subBtn: {
    backgroundColor: "#FFD600",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  subBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 13,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: "#2A2A2A",
    marginTop: 8,
  },
  actionBtn: {
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: "#888",
    fontSize: 12,
  },
});
