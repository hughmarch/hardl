import {useState, useEffect, Dispatch, SetStateAction} from "react";
import {getStorageValue, setStorageValue} from "../storage";

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