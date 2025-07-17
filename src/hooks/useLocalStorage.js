import { useState } from "react";

export function useLocalStorage(key, defaultValue) {
    const [state, setState] = useState(() => {
        const cached = localStorage.getItem(key);
        return cached ? JSON.parse(cached) : defaultValue;
    })

    const setLocalStorage = (newVal) => {
        setState(newVal);
        localStorage.setItem(key, JSON.stringify(newVal));
    }

    return [state, setLocalStorage];
}