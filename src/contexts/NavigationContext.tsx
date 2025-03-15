import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  activeRoute: string;
  setActiveRoute: (route: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeRoute, setActiveRoute] = useState('/dashboard');

  return (
    <NavigationContext.Provider value={{ activeRoute, setActiveRoute }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation has to be used within <NavigationProvider>');
  }
  return context;
}
