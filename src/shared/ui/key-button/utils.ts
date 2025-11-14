export type TKeyInput = string | string[] | undefined | null;

export function normalizeKeyboardKeys(keyboardKey: TKeyInput): string[] {
  if (!keyboardKey) {
    return [];
  }

  const keys = Array.isArray(keyboardKey) ? keyboardKey : [keyboardKey];

  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => key.toLowerCase());
}

export function isEditableTarget(target: HTMLElement | null): boolean {
  if (!target) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
    return true;
  }

  return target.getAttribute("role") === "textbox";
}
