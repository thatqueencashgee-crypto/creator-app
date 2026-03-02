import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppState } from "@/lib/app-state";
import { CREATOR } from "@/lib/data";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

type SessionDuration = { label: string; minutes: number; price: number };
type TimeSlot = { id: string; time: string; available: boolean };

const DURATIONS: SessionDuration[] = [
  { label: "15 min", minutes: 15, price: 19.99 },
  { label: "30 min", minutes: 30, price: 34.99 },
  { label: "60 min", minutes: 60, price: 59.99 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = ["3", "4", "5", "6", "7", "8", "9"];

const TIME_SLOTS: TimeSlot[] = [
  { id: "t1", time: "10:00 AM", available: true },
  { id: "t2", time: "11:00 AM", available: false },
  { id: "t3", time: "1:00 PM", available: true },
  { id: "t4", time: "2:00 PM", available: true },
  { id: "t5", time: "3:00 PM", available: false },
  { id: "t6", time: "5:00 PM", available: true },
  { id: "t7", time: "6:00 PM", available: true },
  { id: "t8", time: "7:00 PM", available: false },
];

export default function BookSessionScreen() {
  const router = useRouter();
  const { walletBalance, sendTip } = useAppState();
  const [selectedDuration, setSelectedDuration] = useState<SessionDuration>(DURATIONS[0]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (!selectedSlot) {
      Alert.alert("Select a Time", "Please choose an available time slot.");
      return;
    }
    if (walletBalance < selectedDuration.price) {
      Alert.alert(
        "Insufficient Balance",
        `You need $${selectedDuration.price.toFixed(2)} to book this session. Please top up your wallet.`
      );
      return;
    }
    Alert.alert(
      "Confirm Booking",
      `Book a ${selectedDuration.label} session with ${CREATOR.name} on ${DAYS[selectedDay]} at ${selectedSlot.time} for $${selectedDuration.price.toFixed(2)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Book — $${selectedDuration.price.toFixed(2)}`,
          onPress: () => {
            sendTip(selectedDuration.price, `${selectedDuration.label} 1-on-1 session with ${CREATOR.name}`);
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setBooked(true);
          },
        },
      ]
    );
  };

  if (booked) {
    return (
      <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Session Booked!</Text>
          <Text style={styles.successSub}>
            Your {selectedDuration.label} session with {CREATOR.name} is confirmed for{" "}
            {DAYS[selectedDay]} at {selectedSlot?.time}.
          </Text>
          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Creator</Text>
              <Text style={styles.successValue}>{CREATOR.name}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Duration</Text>
              <Text style={styles.successValue}>{selectedDuration.label}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Date</Text>
              <Text style={styles.successValue}>{DAYS[selectedDay]}, Mar {DATES[selectedDay]}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Time</Text>
              <Text style={styles.successValue}>{selectedSlot?.time}</Text>
            </View>
            <View style={[styles.successRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.successLabel}>Paid</Text>
              <Text style={[styles.successValue, { color: "#FFD600" }]}>${selectedDuration.price.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={styles.successNote}>
            A video call link will be sent to your messages 15 minutes before the session.
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.doneBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
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
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <IconSymbol name="arrow.left" size={22} color="#F5F5F5" />
        </Pressable>
        <Text style={styles.headerTitle}>Book a Session</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Creator Info */}
        <View style={styles.creatorBanner}>
          <View style={styles.creatorAvatar}>
            <Text style={{ fontSize: 28 }}>{CREATOR.avatar}</Text>
          </View>
          <View>
            <Text style={styles.creatorName}>{CREATOR.name}</Text>
            <Text style={styles.creatorSub}>1-on-1 Private Video Session</Text>
          </View>
          <View style={styles.onlinePill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Available</Text>
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Duration</Text>
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => (
              <Pressable
                key={d.label}
                onPress={() => setSelectedDuration(d)}
                style={({ pressed }) => [
                  styles.durationCard,
                  selectedDuration.label === d.label && styles.durationCardActive,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.durationLabel, selectedDuration.label === d.label && styles.durationLabelActive]}>
                  {d.label}
                </Text>
                <Text style={[styles.durationPrice, selectedDuration.label === d.label && styles.durationPriceActive]}>
                  ${d.price}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Date Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Text style={styles.monthLabel}>March 2026</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
            {DAYS.map((day, i) => (
              <Pressable
                key={day}
                onPress={() => { setSelectedDay(i); setSelectedSlot(null); }}
                style={({ pressed }) => [
                  styles.dayCard,
                  selectedDay === i && styles.dayCardActive,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.dayName, selectedDay === i && styles.dayNameActive]}>{day}</Text>
                <Text style={[styles.dayDate, selectedDay === i && styles.dayDateActive]}>{DATES[i]}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Times</Text>
          <View style={styles.slotsGrid}>
            {TIME_SLOTS.map((slot) => (
              <Pressable
                key={slot.id}
                onPress={() => slot.available && setSelectedSlot(slot)}
                style={({ pressed }) => [
                  styles.slotBtn,
                  !slot.available && styles.slotBtnUnavailable,
                  selectedSlot?.id === slot.id && styles.slotBtnActive,
                  pressed && slot.available && { opacity: 0.8 },
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    !slot.available && styles.slotTextUnavailable,
                    selectedSlot?.id === slot.id && styles.slotTextActive,
                  ]}
                >
                  {slot.time}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* What to Expect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Expect</Text>
          <View style={styles.expectCard}>
            {[
              { icon: "🎥", text: "Private 1-on-1 video call via the app" },
              { icon: "💬", text: "Chat link sent 15 min before session" },
              { icon: "🔒", text: "Session is private and confidential" },
              { icon: "💛", text: "100% of payment goes to the creator" },
            ].map((item) => (
              <View key={item.text} style={styles.expectRow}>
                <Text style={styles.expectIcon}>{item.icon}</Text>
                <Text style={styles.expectText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Book Button */}
      <View style={styles.bookBar}>
        <View>
          <Text style={styles.bookBarLabel}>Total</Text>
          <Text style={styles.bookBarPrice}>${selectedDuration.price.toFixed(2)}</Text>
        </View>
        <Pressable
          onPress={handleBook}
          style={({ pressed }) => [styles.bookBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
        >
          <Text style={styles.bookBtnText}>
            {selectedSlot ? `Book ${selectedDuration.label} Session` : "Select a Time Slot"}
          </Text>
        </Pressable>
      </View>
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
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#F5F5F5",
    fontSize: 17,
    fontWeight: "700",
  },
  creatorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  creatorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD600",
  },
  creatorName: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "700",
  },
  creatorSub: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  onlinePill: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#0d1f0d",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: "#4CAF50",
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  onlineText: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "700",
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
  durationRow: {
    flexDirection: "row",
    gap: 10,
  },
  durationCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  durationCardActive: {
    borderColor: "#FFD600",
    backgroundColor: "#1a1500",
  },
  durationLabel: {
    color: "#888",
    fontSize: 14,
    fontWeight: "700",
  },
  durationLabelActive: {
    color: "#F5F5F5",
  },
  durationPrice: {
    color: "#555",
    fontSize: 13,
    fontWeight: "600",
  },
  durationPriceActive: {
    color: "#FFD600",
  },
  monthLabel: {
    color: "#888",
    fontSize: 13,
    marginBottom: 10,
  },
  daysRow: {
    gap: 8,
    paddingRight: 8,
  },
  dayCard: {
    width: 52,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  dayCardActive: {
    backgroundColor: "#FFD600",
    borderColor: "#FFD600",
  },
  dayName: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
  },
  dayNameActive: {
    color: "#0A0A0A",
  },
  dayDate: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "800",
  },
  dayDateActive: {
    color: "#0A0A0A",
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  slotBtn: {
    width: "47%",
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  slotBtnUnavailable: {
    opacity: 0.35,
  },
  slotBtnActive: {
    backgroundColor: "#1a1500",
    borderColor: "#FFD600",
  },
  slotText: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "600",
  },
  slotTextUnavailable: {
    color: "#555",
    textDecorationLine: "line-through",
  },
  slotTextActive: {
    color: "#FFD600",
  },
  expectCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  expectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  expectIcon: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },
  expectText: {
    color: "#AAAAAA",
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },
  bookBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 28,
    backgroundColor: "#0A0A0A",
    borderTopWidth: 0.5,
    borderTopColor: "#2A2A2A",
    gap: 16,
  },
  bookBarLabel: {
    color: "#888",
    fontSize: 12,
  },
  bookBarPrice: {
    color: "#FFD600",
    fontSize: 22,
    fontWeight: "900",
  },
  bookBtn: {
    flex: 1,
    backgroundColor: "#FFD600",
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: "center",
  },
  bookBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 15,
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
  },
  successNote: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  doneBtn: {
    backgroundColor: "#FFD600",
    borderRadius: 28,
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginTop: 8,
  },
  doneBtnText: {
    color: "#0A0A0A",
    fontWeight: "800",
    fontSize: 16,
  },
});
