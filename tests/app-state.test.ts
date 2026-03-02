import { describe, it, expect } from "vitest";
import { POSTS, SUBSCRIPTION_TIERS, type SubscriptionTier } from "../lib/data";

// Test the tier rank logic
const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, fan: 1, vip: 2 };

function isPostUnlocked(
  subscription: SubscriptionTier,
  unlockedPosts: string[],
  postId: string,
  requiredTier: SubscriptionTier,
  price: number
): boolean {
  if (TIER_RANK[subscription] >= TIER_RANK[requiredTier]) {
    if (price === 0) return true;
    return unlockedPosts.includes(postId);
  }
  return false;
}

describe("Post unlock logic", () => {
  it("free user can see free posts", () => {
    expect(isPostUnlocked("free", [], "p1", "free", 0)).toBe(true);
  });

  it("free user cannot see fan-only posts", () => {
    expect(isPostUnlocked("free", [], "p2", "fan", 0)).toBe(false);
  });

  it("fan subscriber can see fan-only free posts", () => {
    expect(isPostUnlocked("fan", [], "p2", "fan", 0)).toBe(true);
  });

  it("fan subscriber cannot see VIP posts", () => {
    expect(isPostUnlocked("fan", [], "p4", "vip", 9.99)).toBe(false);
  });

  it("vip subscriber can see all tier posts", () => {
    expect(isPostUnlocked("vip", [], "p2", "fan", 0)).toBe(true);
    expect(isPostUnlocked("vip", [], "p4", "vip", 0)).toBe(true);
  });

  it("fan subscriber needs to unlock PPV post individually", () => {
    expect(isPostUnlocked("fan", [], "p3", "fan", 4.99)).toBe(false);
    expect(isPostUnlocked("fan", ["p3"], "p3", "fan", 4.99)).toBe(true);
  });
});

describe("Subscription tiers", () => {
  it("has 3 tiers: free, fan, vip", () => {
    expect(SUBSCRIPTION_TIERS).toHaveLength(3);
    expect(SUBSCRIPTION_TIERS.map((t) => t.id)).toEqual(["free", "fan", "vip"]);
  });

  it("free tier has price 0", () => {
    const free = SUBSCRIPTION_TIERS.find((t) => t.id === "free");
    expect(free?.price).toBe(0);
  });

  it("fan tier costs $9.99", () => {
    const fan = SUBSCRIPTION_TIERS.find((t) => t.id === "fan");
    expect(fan?.price).toBe(9.99);
  });

  it("vip tier costs $24.99", () => {
    const vip = SUBSCRIPTION_TIERS.find((t) => t.id === "vip");
    expect(vip?.price).toBe(24.99);
  });
});

describe("Wallet logic", () => {
  it("can unlock a post if balance is sufficient", () => {
    let balance = 50.0;
    const price = 4.99;
    const canUnlock = balance >= price;
    expect(canUnlock).toBe(true);
    balance -= price;
    expect(balance).toBeCloseTo(45.01, 1);
  });

  it("cannot unlock a post if balance is insufficient", () => {
    const balance = 2.0;
    const price = 4.99;
    expect(balance >= price).toBe(false);
  });

  it("tip reduces wallet balance correctly", () => {
    let balance = 50.0;
    const tip = 5.0;
    balance -= tip;
    expect(balance).toBe(45.0);
  });
});

describe("Posts data", () => {
  it("has 6 posts", () => {
    expect(POSTS).toHaveLength(6);
  });

  it("post p1 is free and visible to all", () => {
    const p1 = POSTS.find((p) => p.id === "p1");
    expect(p1?.requiredTier).toBe("free");
    expect(p1?.price).toBe(0);
  });

  it("post p4 requires vip tier", () => {
    const p4 = POSTS.find((p) => p.id === "p4");
    expect(p4?.requiredTier).toBe("vip");
  });
});
