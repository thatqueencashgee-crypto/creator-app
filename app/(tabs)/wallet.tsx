import { ScrollView, Text, View, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppState } from "@/lib/app-state";

const TOP_UP_AMOUNTS = [10, 25, 50, 100];

export default function WalletScreen() {
  const router = useRouter();
  const { walletBalance, transactions, sendTip } = useAppState();

  const handleTopUp = (amount: number) => {
    Alert.alert(
      "Top Up Wallet",
      `Add $${amount.toFixed(2)} to your wallet?\n\n(Demo mode — no real charge)`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Add $${amount}`,
          onPress: () => {
            Alert.alert("Success!", `$${amount.toFixed(2)} added to your wallet. 💛`);
          },
        },
      ]
    );
  };

  const handleQuickTip = (amount: number) => {
    if (walletBalance < amount) {
      Alert.alert("Insufficient Balance", "Please top up your wallet first.");
      return;
    }
    Alert.alert("Send Tip", `Send $${amount.toFixed(2)} tip to CashGeeMoneyy?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: `Send $${amount}`,
        onPress: () => sendTip(amount, `Tip to CashGeeMoneyy`),
      },
    ]);
  };

  const txnIcon = (type: string) => {
    if (type === "tip") return "💛";
    if (type === "subscription") return "⭐";
    if (type === "unlock") return "🔓";
    return "💰";
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${walletBalance.toFixed(2)}</Text>
          <Text style={styles.balanceSub}>Used for subscriptions, unlocks & tips</Text>
        </View>

        {/* Top Up */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Up</Text>
          <View style={styles.topUpGrid}>
            {TOP_UP_AMOUNTS.map((amount) => (
              <Pressable
                key={amount}
                onPress={() => handleTopUp(amount)}
                style={({ pressed }) => [styles.topUpBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }]}
              >
                <Text style={styles.topUpText}>${amount}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quick Tip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tip to CashGeeMoneyy 💛</Text>
          <View style={styles.tipGrid}>
            {[1, 5, 10, 20].map((amount) => (
              <Pressable
                key={amount}
                onPress={() => handleQuickTip(amount)}
                style={({ pressed }) => [styles.tipBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }]}
              >
                <Text style={styles.tipBtnText}>${amount}</Text>
                <Text style={styles.tipBtnSub}>tip</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            <View style={styles.txnList}>
              {transactions.map((txn) => (
                <View key={txn.id} style={styles.txnRow}>
                  <View style={styles.txnIcon}>
                    <Text style={{ fontSize: 20 }}>{txnIcon(txn.type)}</Text>
                  </View>
                  <View style={styles.txnInfo}>
                    <Text style={styles.txnDesc}>{txn.description}</Text>
                    <Text style={styles.txnDate}>{txn.date}</Text>
                  </View>
                  <Text style={[styles.txnAmount, txn.amount < 0 ? styles.txnDebit : styles.txnCredit]}>
                    {txn.amount < 0 ? "-" : "+"}${Math.abs(txn.amount).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
  balanceCard: {
    margin: 16,
    backgroundColor: "#FFD600",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 6,
  },
  balanceLabel: {
    color: "#0A0A0A",
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  balanceAmount: {
    color: "#0A0A0A",
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: -2,
  },
  balanceSub: {
    color: "#0A0A0A",
    fontSize: 12,
    opacity: 0.6,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  topUpGrid: {
    flexDirection: "row",
    gap: 10,
  },
  topUpBtn: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  topUpText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "700",
  },
  tipGrid: {
    flexDirection: "row",
    gap: 10,
  },
  tipBtn: {
    flex: 1,
    backgroundColor: "#1A1500",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD600",
    gap: 2,
  },
  tipBtnText: {
    color: "#FFD600",
    fontSize: 16,
    fontWeight: "800",
  },
  tipBtnSub: {
    color: "#888",
    fontSize: 10,
    fontWeight: "600",
  },
  txnList: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  txnRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  txnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  txnInfo: {
    flex: 1,
    gap: 3,
  },
  txnDesc: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "600",
  },
  txnDate: {
    color: "#555",
    fontSize: 12,
  },
  txnAmount: {
    fontSize: 15,
    fontWeight: "800",
  },
  txnDebit: {
    color: "#F44336",
  },
  txnCredit: {
    color: "#4CAF50",
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    color: "#555",
    fontSize: 14,
  },
});
