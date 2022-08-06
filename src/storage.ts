export const getStorageValue = <T>(key: string, defaultValue: T): T => {
    // getting stored value
    const saved = localStorage.getItem(key);

    if (saved !== null) {
        return JSON.parse(saved);
    }
    return defaultValue;
}

export const setStorageValue = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
}