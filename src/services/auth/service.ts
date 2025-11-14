import { TokenStorage } from "@/shared/api";
import type { TUser } from "@/shared/types";

const CURRENT_USER_KEY = "current_user";

class AuthService {
  private saveCurrentUser(user: TUser): void {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }

  private getCurrentUser(): TUser | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? (JSON.parse(raw) as TUser) : null;
    } catch {
      return null;
    }
  }

  private generateUserId(name: string): string {
    return `player_${name}_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2)}`;
  }

  async me(): Promise<TUser> {
    const user = this.getCurrentUser();
    if (user) {
      return user;
    }
    throw new Error("No current user");
  }

  async play(name: string): Promise<TUser> {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error("Name is required");
    }

    const existing = this.getCurrentUser();
    if (existing && existing.name === trimmed) {
      return existing;
    }

    const user: TUser = {
      id: this.generateUserId(trimmed),
      email: "",
      name: trimmed,
    };

    TokenStorage.createToken(user.id);
    this.saveCurrentUser(user);

    return user;
  }

  logout(): void {
    TokenStorage.clear();
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch {
      // ignore
    }
  }

  hasToken(): boolean {
    if (this.getCurrentUser()) return true;
    return TokenStorage.hasToken();
  }

  getToken(): string | null {
    return TokenStorage.getToken();
  }
}

const authService = new AuthService();

export default authService;
