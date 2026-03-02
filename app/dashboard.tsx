import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { POSTS, CREATOR } from "@/lib/data";
import { useAppState } from "@/lib/app-state";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 32;
const CHART_HEIGHT = 140;

type Period = "7d" | "30d" | "90d";

const EARNINGS_DATA: Record<Period, { label: string; value: number }[]> = {
  "7d": [
    { label: "Mon", value: 42 },
    { label: "Tue", value: 78 },
    { label: "Wed", value: 55 },
    { label: "Thu", value: 120 },
    { label: "Fri", value: 95 },
    { label: "Sat", value: 180 },
    { label: "Sun", value: 140 },
  ],
  "30d": [
    { label: "W1", value: 320 },
    { label: "W2", value: 480 },
    { label: "W3", value: 390 },
    { label: "W4", value: 620 },
  ],
  "90d": [
    { label: "Jan", value: 1200 },
    { label: "Feb", value: 1850 },
    { label: "Mar", value: 980 },
  ],
};

const SUBSCRIBER_DATA: Record<Period, { label: string; value: number }[]> = {
  "7d": [
    { label: "Mon", value: 210 },
    { label: "Tue", value: 215 },
    { label: "Wed", value: 218 },
    { label: "Thu", value: 230 },
    { label: "Fri", value: 228 },
    { label: "Sat", value: 245 },
    { label: "Sun", value: 252 },
  ],
  "30d": [
    { label: "W1", value: 200 },
    { label: "W2", value: 218 },
    { label: "W3", value: 235 },
    { label: "W4", value: 252 },
  ],
  "90d": [
    { label: "Jan", value: 180 },
    { label: "Feb", value: 220 },
    { label: "Mar", value: 252 },
  ],
};

function BarChart({ data, color = "#FFD600" }: { data: { label: string; value: number }[]; color?: string }) {
  const maxVal = Math.max(...data.map((d) => d.value));
  const barWidth = (CHART_WIDTH - (data.length - 1) * 6) / data.length;

  return (
    <View style={{ width: CHART_WIDTH, height: CHART_HEIGHT + 24 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", height: CHART_HEIGHT, gap: 6 }}>
        {data.map((d) => {
          const barH = Math.max(4, (d.value / maxVal) * CHART_HEIGHT);
          return (
            <View key={d.label} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
              <View
                style={{
                  width: "100%",
                  height: barH,
                  backgroundColor: color,
                  borderRadius: 6,
                  opacity: 0.9,
                }}
              />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", marginTop: 6, gap: 6 }}>
        {data.map((d) => (
          <Text
            key={d.label}
            style={{ flex: 1, textAlign: "center", color: "#555", fontSize: 10, fontWeight: "600" }}
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { transactions } = useAppState();
  const [period, setPeriod] = useState<Period>("7d");

  const earningsData = EARNINGS_DATA[period];
  const subscriberData = SUBSCRIBER_DATA[period];
  const totalEarnings = earningsData.reduce((s, d) => s + d.value, 0);
  const currentSubs = subscriberData[subscriberData.length - 1].value;
  const prevSubs = subscriberData[0].value;
  const subGrowth = (((currentSubs - prevSubs) / prevSubs) * 100).toFixed(1);

  const topPosts = [...POSTS].sort((a, b) => b.likes - a.likes);

  const recentTxns = transactions.slice(0, 5);

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
        <Text style={styles.headerTitle}>Creator Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Period Selector */}
        <View style={styles.periodRow}>
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              style={({ pressed }) => [
                styles.periodBtn,
                period === p && styles.periodBtnActive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { flex: 1 }]}>
            <Text style={styles.kpiLabel}>Total Earnings</Text>
            <Text style={styles.kpiValue}>${totalEarnings.toLocaleString()}</Text>
            <Text style={styles.kpiSub}>+12.4% vs prev period</Text>
          </View>
          <View style={[styles.kpiCard, { flex: 1 }]}>
            <Text style={styles.kpiLabel}>Subscribers</Text>
            <Text style={styles.kpiValue}>{currentSubs}</Text>
            <Text style={styles.kpiSub}>+{subGrowth}% growth</Text>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { flex: 1 }]}>
            <Text style={styles.kpiLabel}>Sessions Booked</Text>
            <Text style={styles.kpiValue}>14</Text>
            <Text style={styles.kpiSub}>+3 this week</Text>
          </View>
          <View style={[styles.kpiCard, { flex: 1 }]}>
            <Text style={styles.kpiLabel}>PPV Unlocks</Text>
            <Text style={styles.kpiValue}>87</Text>
            <Text style={styles.kpiSub}>$432 earned</Text>
          </View>
        </View>

        {/* Earnings Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.chartCard}>
            <Text style={styles.chartTotal}>${totalEarnings.toLocaleString()}</Text>
            <Text style={styles.chartSubLabel}>Total for period</Text>
            <BarChart data={earningsData} color="#FFD600" />
          </View>
        </View>

        {/* Subscriber Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Subscriber Growth</Text>
          <View style={styles.chartCard}>
            <Text style={styles.chartTotal}>{currentSubs}</Text>
            <Text style={styles.chartSubLabel}>Active subscribers</Text>
            <BarChart data={subscriberData} color="#4CAF50" />
          </View>
        </View>

        {/* Revenue Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          <View style={styles.breakdownCard}>
            {[
              { label: "Subscriptions", pct: 58, color: "#FFD600" },
              { label: "PPV Content", pct: 24, color: "#4CAF50" },
              { label: "1-on-1 Sessions", pct: 12, color: "#2196F3" },
              { label: "Tips", pct: 6, color: "#FF9800" },
            ].map((item) => (
              <View key={item.label} style={styles.breakdownRow}>
                <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <View style={styles.breakdownBarBg}>
                  <View style={[styles.breakdownBarFill, { width: `${item.pct}%`, backgroundColor: item.color }]} />
                </View>
                <Text style={styles.breakdownPct}>{item.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Performing Posts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Top Performing Posts</Text>
          <View style={styles.topPostsList}>
            {topPosts.map((post, index) => (
              <View key={post.id} style={styles.topPostRow}>
                <Text style={styles.topPostRank}>#{index + 1}</Text>
                <View style={styles.topPostThumb}>
                  <Text style={{ fontSize: 22 }}>{post.preview}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topPostTitle} numberOfLines={1}>{post.title}</Text>
                  <View style={styles.topPostMeta}>
                    <IconSymbol name="heart.fill" size={11} color="#FFD600" />
                    <Text style={styles.topPostMetaText}>{post.likes.toLocaleString()} likes</Text>
                    <Text style={styles.topPostMetaDot}>·</Text>
                    <Text style={styles.topPostMetaText}>{post.comments} comments</Text>
                  </View>
                </View>
                {post.price > 0 && (
                  <View style={styles.ppvBadge}>
                    <Text style={styles.ppvText}>${post.price}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTxns.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            <View style={styles.txnList}>
              {recentTxns.map((txn) => (
                <View key={txn.id} style={styles.txnRow}>
                  <View style={styles.txnIconBox}>
                    <Text style={{ fontSize: 18 }}>
                      {txn.type === "tip" ? "💛" : txn.type === "subscription" ? "⭐" : txn.type === "unlock" ? "🔓" : "💰"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
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
  periodRow: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  periodBtnActive: {
    backgroundColor: "#FFD600",
  },
  periodText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
  },
  periodTextActive: {
    color: "#0A0A0A",
    fontWeight: "800",
  },
  kpiRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },
  kpiCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    gap: 4,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  kpiLabel: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  kpiValue: {
    color: "#F5F5F5",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -1,
  },
  kpiSub: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "600",
  },
  chartSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
    gap: 4,
  },
  chartTotal: {
    color: "#F5F5F5",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
  },
  chartSubLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  breakdownCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  breakdownDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownLabel: {
    color: "#AAAAAA",
    fontSize: 13,
    width: 110,
  },
  breakdownBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#2A2A2A",
    borderRadius: 3,
    overflow: "hidden",
  },
  breakdownBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  breakdownPct: {
    color: "#888",
    fontSize: 12,
    fontWeight: "700",
    width: 32,
    textAlign: "right",
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
    fontSize: 13,
    fontWeight: "800",
    width: 22,
  },
  topPostThumb: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  topPostTitle: {
    color: "#F5F5F5",
    fontSize: 13,
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
    fontSize: 11,
  },
  topPostMetaDot: {
    color: "#555",
    fontSize: 11,
  },
  ppvBadge: {
    backgroundColor: "#1a1500",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: "#FFD600",
  },
  ppvText: {
    color: "#FFD600",
    fontSize: 11,
    fontWeight: "700",
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
    padding: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A2A2A",
  },
  txnIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  txnDesc: {
    color: "#F5F5F5",
    fontSize: 13,
    fontWeight: "600",
  },
  txnDate: {
    color: "#555",
    fontSize: 11,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: "800",
  },
  txnDebit: {
    color: "#F44336",
  },
  txnCredit: {
    color: "#4CAF50",
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#555",
    fontSize: 14,
  },
});
