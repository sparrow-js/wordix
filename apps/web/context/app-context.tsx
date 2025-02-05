import { Theme } from "@/types/app"
import React, { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import useLocalStorage from "@/hooks/use-local-storage";

export type AppContextType = {
    theme: Theme
    setTheme: (theme: Theme) => void
    font: string;
    setFont: Dispatch<SetStateAction<string>>;
}
export const AppContext = createContext<AppContextType>({
    theme: Theme.light,
    setTheme: () => {},
    font: "Default",
    setFont: () => {},
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(Theme.light);
    const [font, setFont] = useLocalStorage<string>("novel__font", "Default");
    
    return (
        <AppContext.Provider value={{ 
            theme, 
            setTheme,
            font,
            setFont
        }}>
            {children}
        </AppContext.Provider>
    );
};

