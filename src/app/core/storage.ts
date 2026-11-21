import { Preferences } from '@capacitor/preferences';

/** Kleine Hülle um Capacitor Preferences (nativ persistent, im Web localStorage). */
export async function loadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const { value } = await Preferences.get({ key });
    return value ? { ...fallback, ...JSON.parse(value) } : fallback;
  } catch {
    return fallback;
  }
}

export async function loadJsonArray<T>(key: string): Promise<T[]> {
  try {
    const { value } = await Preferences.get({ key });
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function saveJson(key: string, value: unknown): Promise<void> {
  try {
    await Preferences.set({ key, value: JSON.stringify(value) });
  } catch {
    // Speichern ist Komfort; die App funktioniert auch ohne.
  }
}
