import type { ReactNode } from 'react';
import { AppContextProvider } from './app-context';
import { SettingContextProvider } from './setting-context';

export default function ContextWrapper({ children }: { children: ReactNode }) {
    return (
        <AppContextProvider>
            <SettingContextProvider>
                {children}
            </SettingContextProvider>
        </AppContextProvider>
    )
}
