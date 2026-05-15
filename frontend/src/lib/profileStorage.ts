import type { BackendUser } from "./backend";

const PROFILE_SETTINGS_KEY = "dabba_profile_settings";
const NOTIFICATION_SETTINGS_KEY = "dabba_notification_settings";
const PAYMENT_METHODS_KEY = "dabba_payment_methods";
const SECURITY_SETTINGS_KEY = "dabba_security_settings";

export type StoredProfileSettings = {
  displayName: string;
  phone: string;
  email: string;
  city: string;
  initials: string;
  updatedAt: string;
};

export type StoredNotificationSettings = {
  orderUpdates: boolean;
  offers: boolean;
  push: boolean;
};

export type StoredPaymentMethod = {
  id: string;
  type: "card" | "upi";
  label: string;
  subtitle: string;
  last4?: string;
  holderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault?: boolean;
};

export type StoredSecuritySettings = {
  passcode: string;
};

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

export const getUserDisplayName = (user?: BackendUser | null) => {
  const stored = readProfileSettings();
  return stored.displayName || user?.name || "Sushmita";
};

export const getUserInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
};

export const readProfileSettings = (user?: BackendUser | null): StoredProfileSettings => {
  const fallbackName = user?.name || "Sushmita";
  const fallbackPhone = user?.phone || "+91 7865432112";
  const fallback: StoredProfileSettings = {
    displayName: fallbackName,
    phone: fallbackPhone,
    email: "sushmitanagekar@gmail.com",
    city: "Bandra, Mumbai",
    initials: getUserInitials(fallbackName),
    updatedAt: new Date().toISOString(),
  };
  return safeParse(window.localStorage.getItem(PROFILE_SETTINGS_KEY), fallback);
};

export const writeProfileSettings = (settings: StoredProfileSettings) => {
  window.localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(settings));
};

export const readNotificationSettings = (): StoredNotificationSettings => {
  return safeParse(window.localStorage.getItem(NOTIFICATION_SETTINGS_KEY), {
    orderUpdates: true,
    offers: true,
    push: false,
  });
};

export const writeNotificationSettings = (settings: StoredNotificationSettings) => {
  window.localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
};

export const readPaymentMethods = (): StoredPaymentMethod[] => {
  return safeParse(window.localStorage.getItem(PAYMENT_METHODS_KEY), [
    {
      id: "card-1",
      type: "card",
      label: "Visa ending 4242",
      subtitle: "Primary card",
      last4: "4242",
      holderName: "Sushmita Joshi",
      expiryMonth: "08",
      expiryYear: "28",
      isDefault: true,
    },
    {
      id: "upi-1",
      type: "upi",
      label: "UPI • sushmita@upi",
      subtitle: "Default UPI",
      isDefault: false,
    },
  ]);
};

export const writePaymentMethods = (methods: StoredPaymentMethod[]) => {
  window.localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(methods));
};

export const readSecuritySettings = (): StoredSecuritySettings => {
  return safeParse(window.localStorage.getItem(SECURITY_SETTINGS_KEY), {
    passcode: "",
  });
};

export const writeSecuritySettings = (settings: StoredSecuritySettings) => {
  window.localStorage.setItem(SECURITY_SETTINGS_KEY, JSON.stringify(settings));
};

export const clearProfileStorage = () => {
  window.localStorage.removeItem(PROFILE_SETTINGS_KEY);
  window.localStorage.removeItem(NOTIFICATION_SETTINGS_KEY);
  window.localStorage.removeItem(PAYMENT_METHODS_KEY);
  window.localStorage.removeItem(SECURITY_SETTINGS_KEY);
};

