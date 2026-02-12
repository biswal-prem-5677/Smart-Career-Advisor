import React, { createContext, useState, useContext, useEffect } from 'react';

const VisualEffectsContext = createContext();

export const useVisualEffects = () => {
    return useContext(VisualEffectsContext);
};

export const VisualEffectsProvider = ({ children }) => {
    const [isSnowing, setIsSnowing] = useState(false);
    const [isAntiGravity, setIsAntiGravity] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        const storedSnow = localStorage.getItem('isSnowing');
        const storedAntiGravity = localStorage.getItem('isAntiGravity');
        if (storedSnow === 'true') setIsSnowing(true);
        if (storedAntiGravity === 'true') setIsAntiGravity(true);
    }, []);

    const toggleSnow = () => {
        setIsSnowing(prev => {
            const newState = !prev;
            localStorage.setItem('isSnowing', newState);
            return newState;
        });
    };

    const toggleAntiGravity = () => {
        setIsAntiGravity(prev => {
            const newState = !prev;
            localStorage.setItem('isAntiGravity', newState);
            return newState;
        });
    };

    return (
        <VisualEffectsContext.Provider value={{ isSnowing, isAntiGravity, toggleSnow, toggleAntiGravity }}>
            {children}
        </VisualEffectsContext.Provider>
    );
};
