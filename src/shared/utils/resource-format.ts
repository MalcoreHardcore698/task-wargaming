import type { TPlayerResourceFormat } from "@/services/player/types";

const CURRENCY_DIVISORS: Array<{
  threshold: number;
  divisor: number;
  suffix: string;
}> = [
  { threshold: 1_000_000_000_000, divisor: 1_000_000_000_000, suffix: "T" },
  { threshold: 1_000_000_000, divisor: 1_000_000_000, suffix: "B" },
  { threshold: 1_000_000, divisor: 1_000_000, suffix: "M" },
  { threshold: 1_000, divisor: 1_000, suffix: "K" },
];

function removeTrailingZeros(value: string): string {
  return value.replace(/\.0(?=\b)/, "");
}

export function formatResourceValue(
  value: number,
  format: TPlayerResourceFormat
): string {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;

  if (format === "days") {
    const days = Math.round(safeValue);
    return `${days} DAYS`;
  }

  const absolute = Math.abs(safeValue);

  for (const { threshold, divisor, suffix } of CURRENCY_DIVISORS) {
    if (absolute >= threshold) {
      const scaled = absolute / divisor;
      const formatted = scaled.toFixed(1);
      const normalized = removeTrailingZeros(formatted);
      const sign = safeValue < 0 ? "-" : "";
      return `${sign}${normalized} ${suffix}`;
    }
  }

  return `${Math.round(safeValue)}`;
}
