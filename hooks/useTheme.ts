import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
    // Initialize state with a default, which will be corrected by useEffect
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const root = window.document.documentElement;
        const storedTheme = localStorage.getItem('theme') as Theme | null;

        const applyTheme = (newTheme: Theme) => {
            setTheme(newTheme);
            root.classList.toggle('dark', newTheme === 'dark');
        };

        if (storedTheme) {
            applyTheme(storedTheme);
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(systemPrefersDark ? 'dark' : 'light');
        }
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
        window.document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }, [theme]);

    return [theme, toggleTheme];
};
