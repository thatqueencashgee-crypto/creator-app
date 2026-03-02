import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "person.fill": "person",
  "message.fill": "chat-bubble",
  "wallet.pass.fill": "account-balance-wallet",
  "magnifyingglass": "search",
  "lock.fill": "lock",
  "lock.open.fill": "lock-open",
  "star.fill": "star",
  "crown.fill": "workspace-premium",
  "heart.fill": "favorite",
  "bubble.left.fill": "chat",
  "photo.fill": "photo",
  "video.fill": "videocam",
  "text.alignleft": "article",
  "xmark": "close",
  "checkmark": "check",
  "arrow.left": "arrow-back",
  "bell.fill": "notifications",
  "gear": "settings",
  "plus": "add",
  "minus": "remove",
  "dollarsign.circle.fill": "monetization-on",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
