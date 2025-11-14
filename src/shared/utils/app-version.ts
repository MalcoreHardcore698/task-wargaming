import { TokenStorage, MockUserStorage } from "@/shared/api";
import {
  APP_VERSION,
  APP_VERSION_STORAGE_KEY,
} from "@/shared/constants/common";

let isVersionEnsured = false;

export function ensureAppVersion(): void {
  if (isVersionEnsured) {
    return;
  }

  isVersionEnsured = true;

  if (
    typeof window === "undefined" ||
    typeof window.localStorage === "undefined"
  ) {
    return;
  }

  const storedVersion: string | null = window.localStorage.getItem(
    APP_VERSION_STORAGE_KEY
  );
  if (storedVersion && storedVersion !== APP_VERSION) {
    resetAppData();
  }

  window.localStorage.setItem(APP_VERSION_STORAGE_KEY, APP_VERSION);
}

function resetAppData(): void {
  TokenStorage.clearAll();
  MockUserStorage.clearAll();
  window.localStorage.clear();
}
