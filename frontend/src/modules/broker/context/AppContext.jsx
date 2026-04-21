import React, { createContext } from 'react';
export const AppContext = createContext();
export const AppProvider = ({ children }) => <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
