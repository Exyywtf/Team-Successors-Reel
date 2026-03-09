const BRAND_DISPLAY_NAME = "Successors";

const BRAND_PATTERNS = [
  /\bteam\s*successors\b/gi,
  /\bteamsuccessors\b/gi,
  /\bteam[-_]?successors\b/gi,
];

function looksLikeUrlOrPath(text: string): boolean {
  const trimmed = text.trim();

  if (!trimmed) {
    return false;
  }

  if (/^(https?:\/\/|www\.|mailto:|tel:)/i.test(trimmed)) {
    return true;
  }

  return /[\\/]/.test(trimmed) && !/\s/.test(trimmed);
}

export function normalizeBrandText(text: string): string {
  if (!text || text.includes("@") || looksLikeUrlOrPath(text)) {
    return text;
  }

  return BRAND_PATTERNS.reduce(
    (normalized, pattern) => normalized.replace(pattern, BRAND_DISPLAY_NAME),
    text,
  );
}

export function normalizeBrandValue<T>(value: T): T {
  if (typeof value === "string") {
    return normalizeBrandText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeBrandValue(item)) as T;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, nestedValue]) => [key, normalizeBrandValue(nestedValue)],
    );

    return Object.fromEntries(entries) as T;
  }

  return value;
}
