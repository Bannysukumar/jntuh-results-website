"use client";
import { createContext, useState, ReactNode, useContext, useCallback, useMemo } from "react";

interface NavbarContextprops {
  navbar: boolean;
  togglenavbar: () => void;
}

const NavbarContext = createContext<NavbarContextprops | undefined>(undefined);

export const NavBarProvider = ({ children }: { children: ReactNode }) => {
  const [navbar, setNavBar] = useState<boolean>(true);

  const togglenavbar = useCallback(() => {
    setNavBar((prev) => !prev);
  }, []);

  const value = useMemo<NavbarContextprops>(
    () => ({ navbar, togglenavbar }),
    [navbar, togglenavbar]
  );

  return (
    <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
  );
};
export const useNavBarContext = () => {
  const sidebar = useContext(NavbarContext);

  if (sidebar == undefined) {
    throw new Error("useSidecontext must be used with SidebarContext");
  }

  return sidebar;
};
