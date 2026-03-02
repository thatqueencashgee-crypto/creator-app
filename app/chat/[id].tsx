import { FlatList, Text, View, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppState } from "@/lib/app-state";
import { CONVERSATIONS, CREATOR, type Message } from "@/lib/data";
import * as Haptics from "expo-haptics";

const TIP_AMOUNTS = [1, 5, 10, 20];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { sendTip, walletBalance } = useAppState();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    CONVERSATIONS.find((c) => c.id === id)?.messages ?? []
  );
  const [showTip, setShowTip] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: "user",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isCreator: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Simulate creator reply
    setTimeout(() => {
      const reply: Message = {
        id: `m${Date.now() + 1}`,
        senderId: "creator_1",
        text: "Thanks for the message! 💛 Stay tuned for new content dropping soon!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isCreator: true,
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const handleTip = (amount: number) => {
    if (walletBalance < amount) {
      Alert.alert("Insufficient Balance", "Please top up your wallet to send a tip.");
      return;
    }
    const success = sendTip(amount, `Tip to ${CREATOR.name}`);
    if (success) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const tipMsg: Message = {
        id: `m${Date.now()}`,
        senderId: "user",
        text: `💛 Sent a $${amount.toFixed(2)} tip!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isCreator: false,
      };
      setMessages((prev) => [...prev, tipMsg]);
      setShowTip(false);

      setTimeout(() => {
        const reply: Message = {
          id: `m${Date.now() + 1}`,
          senderId: "creator_1",
          text: `Omg thank you so much for the $${amount.toFixed(2)} tip!! You're amazing 💛🙏`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isCreator: true,
        };
        setMessages((prev) => [...prev, reply]);
      }, 1200);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="arrow.left" size={22} color="#F5F5F5" />
        </Pressable>
        <View style={styles.headerCreator}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 18 }}>{CREATOR.avatar}</Text>
          </View>
          <View>
            <Text style={styles.creatorName}>{CREATOR.name}</Text>
            <Text style={styles.creatorStatus}>🟢 Online</Text>
          </View>
        </View>
        <Pressable
          onPress={() => setShowTip(!showTip)}
          style={({ pressed }) => [styles.tipHeaderBtn, pressed && { opacity: 0.7 }]}
        >
          <IconSymbol name="dollarsign.circle.fill" size={20} color="#0A0A0A" />
          <Text style={styles.tipHeaderBtnText}>Tip</Text>
        </Pressable>
      </View>

      {/* Tip Panel */}
      {showTip && (
        <View style={styles.tipPanel}>
          <Text style={styles.tipPanelTitle}>Send a Tip 💛</Text>
          <Text style={styles.tipPanelBalance}>Balance: ${walletBalance.toFixed(2)}</Text>
          <View style={styles.tipAmounts}>
            {TIP_AMOUNTS.map((amount) => (
              <Pressable
                key={amount}
                onPress={() => handleTip(amount)}
                style={({ pressed }) => [styles.tipAmountBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]}
              >
                <Text style={styles.tipAmountText}>${amount}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.isCreator ? styles.bubbleCreator : styles.bubbleUser]}>
            {item.isCreator && (
              <View style={styles.bubbleAvatar}>
                <Text style={{ fontSize: 12 }}>{CREATOR.avatar}</Text>
              </View>
            )}
            <View style={[styles.bubbleContent, item.isCreator ? styles.bubbleContentCreator : styles.bubbleContentUser]}>
              <Text style={[styles.bubbleText, item.isCreator ? styles.bubbleTextCreator : styles.bubbleTextUser]}>
                {item.text}
              </Text>
              <Text style={styles.bubbleTime}>{item.timestamp}</Text>
            </View>
          </View>
        )}
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message CashGeeMoneyy..."
            placeholderTextColor="#555"
            returnKeyType="send"
            onSubmitEditing={handleSend}
            multiline
          />
          <Pressable
            onPress={handleSend}
            style={({ pressed }) => [styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled, pressed && { opacity: 0.8 }]}
          >
            <IconSymbol name="paperplane.fill" size={18} color={inputText.trim() ? "#0A0A0A" : "#555"} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "#1A1A1A",
  },
  headerCreator: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFD600",
  },
  creatorName: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "700",
  },
  creatorStatus: {
    color: "#888",
    fontSize: 11,
    marginTop: 1,
  },
  tipHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFD600",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tipHeaderBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 13,
  },
  tipPanel: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
    alignItems: "center",
    gap: 10,
  },
  tipPanelTitle: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "700",
  },
  tipPanelBalance: {
    color: "#888",
    fontSize: 12,
  },
  tipAmounts: {
    flexDirection: "row",
    gap: 10,
  },
  tipAmountBtn: {
    backgroundColor: "#FFD600",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  tipAmountText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 15,
  },
  messageList: {
    padding: 12,
    gap: 10,
    flexGrow: 1,
  },
  messageBubble: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 6,
  },
  bubbleCreator: {
    justifyContent: "flex-start",
  },
  bubbleUser: {
    justifyContent: "flex-end",
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFD600",
  },
  bubbleContent: {
    maxWidth: "75%",
    borderRadius: 18,
    padding: 12,
    gap: 4,
  },
  bubbleContentCreator: {
    backgroundColor: "#1A1A1A",
    borderBottomLeftRadius: 4,
  },
  bubbleContentUser: {
    backgroundColor: "#FFD600",
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextCreator: {
    color: "#F5F5F5",
  },
  bubbleTextUser: {
    color: "#0A0A0A",
  },
  bubbleTime: {
    fontSize: 10,
    color: "#888",
    alignSelf: "flex-end",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    gap: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#2A2A2A",
    backgroundColor: "#0A0A0A",
  },
  input: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#F5F5F5",
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFD600",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#1A1A1A",
  },
});
