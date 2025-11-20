"use client";

import { createContext, useContext } from "react";
import type { NAVBAR_QUERYResult } from "@/sanity/types";

const NavbarContext = createContext<NAVBAR_QUERYResult | null>(null);

export function NavbarProvider({
  children,
  navbarData,
}: {
  children: React.ReactNode;
  navbarData: NAVBAR_QUERYResult | null;
}) {
  return (
    <NavbarContext.Provider value={navbarData}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  return useContext(NavbarContext);
}
