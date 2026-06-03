const AUTH_STORAGE_KEY = "energy-system-auth";

type AuthUser = {
  username: string;
};

export const login = (username: string, password: string): boolean => {
  const validUsername = username.trim().toLowerCase() === "admin";
  const validPassword = password === "admin123";

  if (validUsername && validPassword) {
    const user: AuthUser = { username: "admin" };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    return true;
  }

  return false;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => Boolean(getCurrentUser());
