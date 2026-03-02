import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/data";
import * as Haptics from "expo-haptics";

type ContentType = "photo" | "video" | "text";

const MEDIA_PLACEHOLDERS: Record<ContentType, string[]> = {
  photo: ["🌅", "🎨", "📸", "🌟", "💫", "✨"],
  video: ["🎬", "🎥", "📹", "🎞️", "🎭", "🎪"],
  text: ["📝", "✍️", "📖", "💬", "🗒️", "📄"],
};

export default function NewPostScreen() {
  const router = useRouter();
  const [contentType, setContentType] = useState<ContentType>("photo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("free");
  const [isPPV, setIsPPV] = useState(false);
  const [ppvPrice, setPpvPrice] = useState("4.99");
  const [selectedEmoji, setSelectedEmoji] = useState("🌅");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handleEmojiSelect = (emoji: string) => setSelectedEmoji(emoji);

  const handlePublish = () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please add a title for your post.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Missing Description", "Please add a description.");
      return;
    }
    if (isPPV && (isNaN(parseFloat(ppvPrice)) || parseFloat(ppvPrice) <= 0)) {
      Alert.alert("Invalid Price", "Please enter a valid PPV price.");
      return;
    }

    const tierData = SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)!;
    const priceText = isPPV ? ` · $${parseFloat(ppvPrice).toFixed(2)} PPV` : "";
    Alert.alert(
      "Publish Post?",
      `"${title.trim()}"\n\nVisible to: ${tierData.name}${priceText}\nType: ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Publish",
          onPress: () => {
            setPublishing(true);
            setTimeout(() => {
              if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setPublishing(false);
              setPublished(true);
            }, 1200);
          },
        },
      ]
    );
  };

  if (published) {
    return (
      <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🚀</Text>
          <Text style={styles.successTitle}>Post Published!</Text>
          <Text style={styles.successSub}>
            Your post "{title}" is now live for your {SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)?.name} subscribers.
          </Text>
          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Title</Text>
              <Text style={styles.successValue} numberOfLines={1}>{title}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Type</Text>
              <Text style={styles.successValue}>{contentType.charAt(0).toUpperCase() + contentType.slice(1)}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Audience</Text>
              <Text style={styles.successValue}>{SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)?.name}</Text>
            </View>
            <View style={[styles.successRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.successLabel}>PPV Price</Text>
              <Text style={[styles.successValue, { color: isPPV ? "#FFD600" : "#555" }]}>
                {isPPV ? `$${parseFloat(ppvPrice).toFixed(2)}` : "Free to subscribers"}
              </Text>
            </View>
          </View>
          <View style={styles.successBtns}>
            <Pressable
              onPress={() => {
                setPublished(false);
                setTitle("");
                setDescription("");
                setSelectedTier("free");
                setIsPPV(false);
                setPpvPrice("4.99");
                setSelectedEmoji("🌅");
                setContentType("photo");
              }}
              style={({ pressed }) => [styles.newPostBtn, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.newPostBtnText}>Create Another</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.doneBtn, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.headerBtnText}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <Pressable
          onPress={handlePublish}
          style={({ pressed }) => [styles.publishBtn, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.publishBtnText}>{publishing ? "Publishing..." : "Publish"}</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Content Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content Type</Text>
            <View style={styles.typeRow}>
              {(["photo", "video", "text"] as ContentType[]).map((type) => (
                <Pressable
                  key={type}
                  onPress={() => {
                    setContentType(type);
                    setSelectedEmoji(MEDIA_PLACEHOLDERS[type][0]);
                  }}
                  style={({ pressed }) => [
                    styles.typeBtn,
                    contentType === type && styles.typeBtnActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.typeEmoji}>
                    {type === "photo" ? "📸" : type === "video" ? "🎬" : "📝"}
                  </Text>
                  <Text style={[styles.typeLabel, contentType === type && styles.typeLabelActive]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Media Picker (emoji placeholder) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Media Preview</Text>
            <View style={styles.mediaPreview}>
              <Text style={styles.mediaPreviewEmoji}>{selectedEmoji}</Text>
              <Text style={styles.mediaPreviewLabel}>Tap below to choose a preview</Text>
            </View>
            <View style={styles.emojiGrid}>
              {MEDIA_PLACEHOLDERS[contentType].map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => handleEmojiSelect(emoji)}
                  style={({ pressed }) => [
                    styles.emojiBtn,
                    selectedEmoji === emoji && styles.emojiBtnActive,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Give your post a title..."
              placeholderTextColor="#555"
              maxLength={80}
              returnKeyType="next"
            />
            <Text style={styles.charCount}>{title.length}/80</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your content..."
              placeholderTextColor="#555"
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          {/* Audience Tier */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who Can See This?</Text>
            <View style={styles.tierList}>
              {SUBSCRIPTION_TIERS.map((tier) => (
                <Pressable
                  key={tier.id}
                  onPress={() => setSelectedTier(tier.id)}
                  style={({ pressed }) => [
                    styles.tierRow,
                    selectedTier === tier.id && styles.tierRowActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.tierEmoji}>{tier.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tierName}>{tier.name}</Text>
                    <Text style={styles.tierDesc}>
                      {tier.id === "free"
                        ? "Visible to everyone"
                        : tier.id === "fan"
                        ? "Fan & VIP subscribers only"
                        : "VIP subscribers only"}
                    </Text>
                  </View>
                  <View style={[styles.radioOuter, selectedTier === tier.id && styles.radioOuterActive]}>
                    {selectedTier === tier.id && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* PPV Toggle */}
          <View style={styles.section}>
            <View style={styles.ppvHeader}>
              <View>
                <Text style={styles.sectionTitle}>Pay-Per-View</Text>
                <Text style={styles.ppvSubLabel}>Charge subscribers an extra unlock fee</Text>
              </View>
              <Pressable
                onPress={() => setIsPPV(!isPPV)}
                style={({ pressed }) => [styles.toggle, isPPV && styles.toggleActive, pressed && { opacity: 0.8 }]}
              >
                <View style={[styles.toggleThumb, isPPV && styles.toggleThumbActive]} />
              </Pressable>
            </View>

            {isPPV && (
              <View style={styles.ppvPriceRow}>
                <Text style={styles.ppvDollar}>$</Text>
                <TextInput
                  style={styles.ppvInput}
                  value={ppvPrice}
                  onChangeText={setPpvPrice}
                  keyboardType="decimal-pad"
                  placeholder="4.99"
                  placeholderTextColor="#555"
                  returnKeyType="done"
                />
                <Text style={styles.ppvPerUnlock}>per unlock</Text>
              </View>
            )}
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Post Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Type</Text>
                <Text style={styles.summaryValue}>{contentType.charAt(0).toUpperCase() + contentType.slice(1)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Audience</Text>
                <Text style={styles.summaryValue}>{SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)?.name}</Text>
              </View>
              <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.summaryLabel}>PPV Price</Text>
                <Text style={[styles.summaryValue, { color: isPPV ? "#FFD600" : "#555" }]}>
                  {isPPV ? `$${parseFloat(ppvPrice || "0").toFixed(2)}` : "None"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerBtn: {
    paddingHorizontal: 4,
  },
  headerBtnText: {
    color: "#888",
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#F5F5F5",
    fontSize: 17,
    fontWeight: "700",
  },
  publishBtn: {
    backgroundColor: "#FFD600",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  publishBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  typeBtnActive: {
    borderColor: "#FFD600",
    backgroundColor: "#1a1500",
  },
  typeEmoji: {
    fontSize: 24,
  },
  typeLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  typeLabelActive: {
    color: "#FFD600",
  },
  mediaPreview: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderStyle: "dashed",
    gap: 8,
    marginBottom: 12,
  },
  mediaPreviewEmoji: {
    fontSize: 64,
  },
  mediaPreviewLabel: {
    color: "#555",
    fontSize: 12,
  },
  emojiGrid: {
    flexDirection: "row",
    gap: 10,
  },
  emojiBtn: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  emojiBtnActive: {
    borderColor: "#FFD600",
    backgroundColor: "#1a1500",
  },
  emojiText: {
    fontSize: 24,
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 14,
    color: "#F5F5F5",
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  charCount: {
    color: "#555",
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
  },
  tierList: {
    gap: 8,
  },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  tierRowActive: {
    borderColor: "#FFD600",
    backgroundColor: "#1a1500",
  },
  tierEmoji: {
    fontSize: 26,
  },
  tierName: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "700",
  },
  tierDesc: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#FFD600",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFD600",
  },
  ppvHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ppvSubLabel: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2A2A2A",
    padding: 3,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: "#FFD600",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#555",
  },
  toggleThumbActive: {
    backgroundColor: "#0A0A0A",
    transform: [{ translateX: 22 }],
  },
  ppvPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 0.5,
    borderColor: "#FFD600",
  },
  ppvDollar: {
    color: "#FFD600",
    fontSize: 22,
    fontWeight: "800",
  },
  ppvInput: {
    flex: 1,
    color: "#F5F5F5",
    fontSize: 22,
    fontWeight: "700",
  },
  ppvPerUnlock: {
    color: "#888",
    fontSize: 13,
  },
  summaryCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  summaryTitle: {
    color: "#888",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    padding: 14,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  summaryLabel: {
    color: "#888",
    fontSize: 13,
  },
  summaryValue: {
    color: "#F5F5F5",
    fontSize: 13,
    fontWeight: "700",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    gap: 14,
  },
  successEmoji: {
    fontSize: 64,
  },
  successTitle: {
    color: "#F5F5F5",
    fontSize: 28,
    fontWeight: "900",
  },
  successSub: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  successCard: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
    marginTop: 8,
  },
  successRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  successLabel: {
    color: "#888",
    fontSize: 13,
  },
  successValue: {
    color: "#F5F5F5",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },
  successBtns: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },
  newPostBtn: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  newPostBtnText: {
    color: "#F5F5F5",
    fontWeight: "700",
    fontSize: 15,
  },
  doneBtn: {
    flex: 1,
    backgroundColor: "#FFD600",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 15,
  },
});
