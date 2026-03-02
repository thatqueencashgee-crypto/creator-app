import { FlatList, Text, View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { CONVERSATIONS, CREATOR } from "@/lib/data";
import { useAppState } from "@/lib/app-state";

export default function MessagesScreen() {
  const router = useRouter();
  const { subscription } = useAppState();
  const canMessage = subscription !== "free";

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {canMessage ? (
        <FlatList
          data={CONVERSATIONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/chat/${item.id}` as any)}
              style={({ pressed }) => [styles.convoRow, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.avatar}>
                <Text style={{ fontSize: 22 }}>{CREATOR.avatar}</Text>
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.convoInfo}>
                <View style={styles.convoTopRow}>
                  <Text style={styles.convoName}>{CREATOR.name}</Text>
                  <Text style={styles.convoTime}>{item.lastMessageTime}</Text>
                </View>
                <Text style={styles.convoLast} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </Pressable>
          )}
          ListHeaderComponent={
            <View style={styles.dmBanner}>
              <Text style={styles.dmBannerEmoji}>💬</Text>
              <Text style={styles.dmBannerText}>Direct messaging is available for Fan & VIP subscribers.</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedEmoji}>🔒</Text>
          <Text style={styles.lockedTitle}>Messaging Locked</Text>
          <Text style={styles.lockedSub}>
            Subscribe to the Fan or VIP tier to send direct messages to CashGeeMoneyy.
          </Text>
          <Pressable
            onPress={() => router.push("/subscriptions" as any)}
            style={({ pressed }) => [styles.unlockBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] }]}
          >
            <Text style={styles.unlockBtnText}>View Subscription Plans</Text>
          </Pressable>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  headerTitle: {
    color: "#F5F5F5",
    fontSize: 24,
    fontWeight: "800",
  },
  list: {
    paddingVertical: 8,
  },
  dmBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  dmBannerEmoji: {
    fontSize: 20,
  },
  dmBannerText: {
    color: "#888",
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  convoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1A1A1A",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD600",
    position: "relative",
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#0A0A0A",
  },
  convoInfo: {
    flex: 1,
    gap: 4,
  },
  convoTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  convoName: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "700",
  },
  convoTime: {
    color: "#555",
    fontSize: 12,
  },
  convoLast: {
    color: "#888",
    fontSize: 13,
  },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFD600",
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#0A0A0A",
    fontSize: 11,
    fontWeight: "800",
  },
  lockedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 14,
  },
  lockedEmoji: {
    fontSize: 56,
  },
  lockedTitle: {
    color: "#F5F5F5",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  lockedSub: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  unlockBtn: {
    backgroundColor: "#FFD600",
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 8,
  },
  unlockBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 15,
  },
});
