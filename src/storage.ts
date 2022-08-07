/**
 * Gets a value from local storage given the key with the specified type.
 * @param key the given key
 * @param defaultValue returned if key not in local storage.
 */
export const getStorageValue = <T>(key: string, defaultValue: T): T => {
    // getting stored value
    const saved = localStorage.getItem(key);

    if (saved !== null) {
        return JSON.parse(saved);
    }
    return defaultValue;
}

/**
 * Saves the givevn object in local storage at the given key.
 * @param key the given key
 * @param value the given object
 */
export const setStorageValue = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
}