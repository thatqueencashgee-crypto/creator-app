import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SubscriptionTier, Transaction } from "./data";

interface AppState {
  subscription: SubscriptionTier;
  unlockedPosts: string[];
  walletBalance: number;
  transactions: Transaction[];
  setSubscription: (tier: SubscriptionTier) => void;
  unlockPost: (postId: string, price: number) => boolean;
  sendTip: (amount: number, description: string) => boolean;
  isPostUnlocked: (postId: string, requiredTier: SubscriptionTier, price: number) => boolean;
}

const AppStateContext = createContext<AppState | null>(null);

const STORAGE_KEYS = {
  subscription: "cp_subscription",
  unlockedPosts: "cp_unlocked_posts",
  walletBalance: "cp_wallet_balance",
  transactions: "cp_transactions",
};

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscriptionState] = useState<SubscriptionTier>("free");
  const [unlockedPosts, setUnlockedPosts] = useState<string[]>([]);
  const [walletBalance, setWalletBalance] = useState(50.0); // Start with $50 demo balance
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "t0", type: "subscription", amount: -9.99, description: "Fan Subscription", date: "Feb 28, 2026" },
    { id: "t1", type: "tip", amount: -5.0, description: "Tip to CashGeeMoneyy", date: "Mar 1, 2026" },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const [sub, posts, balance, txns] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.subscription),
          AsyncStorage.getItem(STORAGE_KEYS.unlockedPosts),
          AsyncStorage.getItem(STORAGE_KEYS.walletBalance),
          AsyncStorage.getItem(STORAGE_KEYS.transactions),
        ]);
        if (sub) setSubscriptionState(sub as SubscriptionTier);
        if (posts) setUnlockedPosts(JSON.parse(posts));
        if (balance) setWalletBalance(parseFloat(balance));
        if (txns) setTransactions(JSON.parse(txns));
      } catch {}
    })();
  }, []);

  const setSubscription = async (tier: SubscriptionTier) => {
    const prices: Record<SubscriptionTier, number> = { free: 0, fan: 9.99, vip: 24.99 };
    const price = prices[tier];
    if (price > 0 && walletBalance < price) return;

    const newBalance = price > 0 ? walletBalance - price : walletBalance;
    const newTxn: Transaction = {
      id: `t${Date.now()}`,
      type: "subscription",
      amount: -price,
      description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Subscription`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const newTxns = price > 0 ? [newTxn, ...transactions] : transactions;
    setSubscriptionState(tier);
    setWalletBalance(newBalance);
    setTransactions(newTxns);

    await AsyncStorage.setItem(STORAGE_KEYS.subscription, tier);
    await AsyncStorage.setItem(STORAGE_KEYS.walletBalance, String(newBalance));
    await AsyncStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(newTxns));
  };

  const unlockPost = (postId: string, price: number): boolean => {
    if (walletBalance < price) return false;
    const newBalance = walletBalance - price;
    const newPosts = [...unlockedPosts, postId];
    const newTxn: Transaction = {
      id: `t${Date.now()}`,
      type: "unlock",
      amount: -price,
      description: `Unlocked post`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    const newTxns = [newTxn, ...transactions];

    setWalletBalance(newBalance);
    setUnlockedPosts(newPosts);
    setTransactions(newTxns);

    AsyncStorage.setItem(STORAGE_KEYS.walletBalance, String(newBalance));
    AsyncStorage.setItem(STORAGE_KEYS.unlockedPosts, JSON.stringify(newPosts));
    AsyncStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(newTxns));
    return true;
  };

  const sendTip = (amount: number, description: string): boolean => {
    if (walletBalance < amount) return false;
    const newBalance = walletBalance - amount;
    const newTxn: Transaction = {
      id: `t${Date.now()}`,
      type: "tip",
      amount: -amount,
      description: description || `Tip to CashGeeMoneyy`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    const newTxns = [newTxn, ...transactions];

    setWalletBalance(newBalance);
    setTransactions(newTxns);

    AsyncStorage.setItem(STORAGE_KEYS.walletBalance, String(newBalance));
    AsyncStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(newTxns));
    return true;
  };

  const tierRank: Record<SubscriptionTier, number> = { free: 0, fan: 1, vip: 2 };

  const isPostUnlocked = (postId: string, requiredTier: SubscriptionTier, price: number): boolean => {
    if (tierRank[subscription] >= tierRank[requiredTier]) {
      if (price === 0) return true;
      return unlockedPosts.includes(postId);
    }
    return false;
  };

  return (
    <AppStateContext.Provider
      value={{
        subscription,
        unlockedPosts,
        walletBalance,
        transactions,
        setSubscription,
        unlockPost,
        sendTip,
        isPostUnlocked,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
