export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type UserDto = {
  email: string;
  name: string;
  nativeLang: string | null;
  avatarUrl: string | null;
};

export type AuthProvider = "google" | "github";
