"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface PageThemeWrapperProps {
  children: React.ReactNode;
}

export default function PageThemeWrapper({ children }: PageThemeWrapperProps) {
  const pathname = usePathname();
  const isAtelierPage = pathname === "/l-atelier" || pathname === "/en/atelier";

  useEffect(() => {
    if (isAtelierPage) {
      document.body.className = "bg-[#140D01] text-[#F9F7F6]";
      document.documentElement.className = "bg-[#140D01] text-[#F9F7F6]";
    } else {
      document.body.className = "bg-[#F9F7F6] text-[#140D01]";
      document.documentElement.className = "bg-[#F9F7F6] text-[#140D01]";
    }

    return () => {
      document.body.className = "";
      document.documentElement.className = "";
    };
  }, [isAtelierPage]);

  return <div className={isAtelierPage ? "bg-[#140D01] text-[#F9F7F6]" : "bg-[#F9F7F6] text-[#140D01]"}>{children}</div>;
}