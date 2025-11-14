import type { TPlayerResource } from "./types";

export const PLAYER_RESOURCES: TPlayerResource[] = [
  {
    id: "gold",
    icon: "/src/assets/svg/currency-gold-c.svg",
    label: "Gold",
    amount: "250 K",
  },
  {
    id: "credits",
    icon: "/src/assets/svg/currency-credits-c.svg",
    label: "Credits",
    amount: "531.2 K",
  },
  {
    id: "free-xp",
    icon: "/src/assets/svg/currency-free-xp-c.svg",
    label: "Free XP",
    amount: "250 K",
    color: "var(--color-standard)",
    hasNew: true,
  },
  {
    id: "steel",
    icon: "/src/assets/svg/steel-c.svg",
    label: "Steel",
    amount: "50 K",
  },
  {
    id: "premium",
    icon: "/src/assets/svg/premium-c.svg",
    label: "Premium",
    amount: "359 DAYS",
    color: "var(--color-primary)",
  },
  {
    id: "lootboxes",
    icon: "/src/assets/svg/lootbox-c.svg",
    label: "Lootboxes",
    amount: "2",
    hasNew: true,
  },
];
