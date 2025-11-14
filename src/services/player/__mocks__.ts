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
    amount: "250 K",
  },
  {
    id: "credits",
    icon: currencyCreditsIcon,
    label: "Credits",
    amount: "531.2 K",
  },
  {
    id: "free-xp",
    icon: currencyFreeXpIcon,
    label: "Free XP",
    amount: "250 K",
    color: "var(--color-standard)",
    hasNew: true,
  },
  {
    id: "steel",
    icon: steelIcon,
    label: "Steel",
    amount: "50 K",
  },
  {
    id: "premium",
    icon: premiumIcon,
    label: "Premium",
    amount: "359 DAYS",
    color: "var(--color-primary)",
  },
  {
    id: "lootboxes",
    icon: lootboxIcon,
    label: "Lootboxes",
    amount: "2",
    hasNew: true,
  },
];
