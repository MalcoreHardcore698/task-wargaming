import currencyGoldIcon from "@/assets/svg/currency-gold-c.svg";
import currencyCreditsIcon from "@/assets/svg/currency-credits-c.svg";
import currencyFreeXpIcon from "@/assets/svg/currency-free-xp-c.svg";
import steelIcon from "@/assets/svg/steel-c.svg";
import premiumIcon from "@/assets/svg/premium-c.svg";
import lootboxIcon from "@/assets/svg/lootbox-c.svg";

import type { TPlayerResource } from "./types";

export const PLAYER_RESOURCES: TPlayerResource[] = [
  {
    id: "gold",
    icon: currencyGoldIcon,
    label: "Gold",
    value: 250_000,
    format: "currency",
  },
  {
    id: "credits",
    icon: currencyCreditsIcon,
    label: "Credits",
    value: 531_200,
    format: "currency",
  },
  {
    id: "free-xp",
    icon: currencyFreeXpIcon,
    label: "Free XP",
    value: 250_000,
    format: "currency",
    color: "var(--color-standard)",
    hasNew: true,
  },
  {
    id: "steel",
    icon: steelIcon,
    label: "Steel",
    value: 50_000,
    format: "currency",
  },
  {
    id: "premium",
    icon: premiumIcon,
    label: "Premium",
    value: 359,
    format: "days",
    color: "var(--color-primary)",
  },
  {
    id: "lootboxes",
    icon: lootboxIcon,
    label: "Lootboxes",
    value: 2,
    format: "currency",
    hasNew: true,
  },
];
