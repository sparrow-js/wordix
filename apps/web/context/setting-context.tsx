import React, { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

export type SettingContextType = {
    componentName: string;
    setComponentName: Dispatch<SetStateAction<string>>;
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    
}

export const SettingContext = createContext<SettingContextType>({
    componentName: "",
    setComponentName: (componentName: string) => {},
    showModal: false,
    setShowModal: (showModal: boolean) => {},
});

export const SettingContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [componentName, setComponentName] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <SettingContext.Provider value={{
            componentName,
            setComponentName,
            showModal,
            setShowModal,
        }}>
            {children}
        </SettingContext.Provider>
    );
}