import {useState, useEffect, Dispatch, SetStateAction} from "react";
import {getStorageValue, setStorageValue} from "../storage";

/**
 * A persistent version of useState using localStorage. If a page is refreshed, any
 * state using this hook instead of useState will be preserved.
 * @param key the key to keep the state in localStorage.
 * @param defaultValue Initial value if the key wasn't in local storage.
 */
export const useLocalStorage =
        <T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {

    const initialValue = getStorageValue<T>(key, defaultValue);
    const [value, setValue] = useState<T>(initialValue);

    useEffect(() => {
        // storing input name
        setStorageValue(key, value);
    }, [key, value]);

    return [value, setValue];
};