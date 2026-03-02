import { ScrollView, Text, View, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppState } from "@/lib/app-state";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/data";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { subscription, setSubscription, walletBalance } = useAppState();

  const handleSubscribe = (tier: SubscriptionTier) => {
    if (tier === subscription) return;
    const tierData = SUBSCRIPTION_TIERS.find((t) => t.id === tier)!;
    if (tier === "free") {
      Alert.alert("Downgrade to Free", "You'll lose access to exclusive content.", [
        { text: "Cancel", style: "cancel" },
        { text: "Downgrade", style: "destructive", onPress: () => setSubscription("free") },
      ]);
      return;
    }
    if (walletBalance < tierData.price) {
      Alert.alert("Insufficient Balance", `You need $${tierData.price.toFixed(2)} to subscribe. Please top up your wallet.`);
      return;
    }
    Alert.alert(
      `Subscribe to ${tierData.name}`,
      `$${tierData.price.toFixed(2)}/month will be charged from your wallet.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Subscribe — $${tierData.price.toFixed(2)}/mo`,
          onPress: () => {
            setSubscription(tier);
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="xmark" size={20} color="#F5F5F5" />
        </Pressable>
        <Text style={styles.headerTitle}>Subscribe</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>💛</Text>
          <Text style={styles.heroTitle}>Support CashGeeMoneyy</Text>
          <Text style={styles.heroSub}>Choose a plan to unlock exclusive content and connect directly with the creator.</Text>
          <View style={styles.balancePill}>
            <IconSymbol name="wallet.pass.fill" size={14} color="#FFD600" />
            <Text style={styles.balanceText}>Wallet: ${walletBalance.toFixed(2)}</Text>
          </View>
        </View>

        {/* Tier Cards */}
        <View style={styles.tiersContainer}>
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isActive = subscription === tier.id;
            const isUpgrade =
              (tier.id === "fan" && subscription === "free") ||
              (tier.id === "vip" && (subscription === "free" || subscription === "fan"));

            return (
              <View key={tier.id} style={[styles.tierCard, isActive && styles.tierCardActive]}>
                {isActive && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>✓ Current Plan</Text>
                  </View>
                )}
                {tier.id === "vip" && !isActive && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>⭐ Most Popular</Text>
                  </View>
                )}

                <View style={styles.tierHeader}>
                  <Text style={styles.tierEmoji}>{tier.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tierName}>{tier.name}</Text>
                    <Text style={styles.tierPrice}>
                      {tier.price === 0 ? "Free" : `$${tier.price.toFixed(2)}/mo`}
                    </Text>
                  </View>
                </View>

                <View style={styles.perksList}>
                  {tier.perks.map((perk) => (
                    <View key={perk} style={styles.perkRow}>
                      <IconSymbol name="checkmark" size={14} color="#FFD600" />
                      <Text style={styles.perkText}>{perk}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  onPress={() => handleSubscribe(tier.id)}
                  style={({ pressed }) => [
                    styles.subscribeBtn,
                    isActive && styles.subscribeBtnActive,
                    pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <Text style={[styles.subscribeBtnText, isActive && styles.subscribeBtnTextActive]}>
                    {isActive ? "Current Plan" : isUpgrade ? `Upgrade to ${tier.name}` : tier.price === 0 ? "Downgrade to Free" : `Subscribe — $${tier.price.toFixed(2)}/mo`}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <Text style={styles.disclaimer}>
          Subscriptions are billed monthly from your CashGeeMoneyy wallet. Cancel anytime.
        </Text>
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
    fontSize: 17,
    fontWeight: "700",
  },
  hero: {
    alignItems: "center",
    padding: 28,
    gap: 8,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#F5F5F5",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  heroSub: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  balancePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
    marginTop: 4,
  },
  balanceText: {
    color: "#FFD600",
    fontSize: 13,
    fontWeight: "700",
  },
  tiersContainer: {
    paddingHorizontal: 16,
    gap: 14,
  },
  tierCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    position: "relative",
    overflow: "hidden",
  },
  tierCardActive: {
    borderColor: "#FFD600",
    borderWidth: 1.5,
  },
  activeBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#1a1500",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#FFD600",
  },
  activeBadgeText: {
    color: "#FFD600",
    fontSize: 11,
    fontWeight: "700",
  },
  popularBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#1a1500",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularBadgeText: {
    color: "#FFD600",
    fontSize: 11,
    fontWeight: "700",
  },
  tierHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  tierEmoji: {
    fontSize: 36,
  },
  tierName: {
    color: "#F5F5F5",
    fontSize: 20,
    fontWeight: "800",
  },
  tierPrice: {
    color: "#FFD600",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  perksList: {
    gap: 10,
    marginBottom: 18,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  perkText: {
    color: "#AAAAAA",
    fontSize: 14,
    flex: 1,
  },
  subscribeBtn: {
    backgroundColor: "#FFD600",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
  },
  subscribeBtnActive: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  subscribeBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 15,
  },
  subscribeBtnTextActive: {
    color: "#555",
  },
  disclaimer: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    lineHeight: 18,
  },
});
