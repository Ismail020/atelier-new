"use client";

import { NavArrowWhite } from "@/components/Icons";
import TransitionLink from "@/components/utils/TransitionLink";
import Balancer from "react-wrap-balancer";
import { usePathname } from "next/navigation";

export default function GlobalNotFound() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  return (
    <div
      className="relative mt-[-62px] flex min-h-screen items-center justify-center"
      style={{
        background:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), url(/Header.png) lightgray -0.789px -88.486px / 99.638% 110.093% no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 flex flex-col gap-2 text-center md:gap-6">
        <h1 className="h1-display text-white">
          <Balancer>{isEnglish ? "Oops, page not found!" : "Oups, page introuvable!"}</Balancer>
        </h1>
        <TransitionLink
          href={isEnglish ? "/en" : "/"}
          className="nav m-auto flex items-center gap-1.5 text-center text-white"
        >
          {isEnglish ? "Go to homepage" : "Aller à l'accueil"} <NavArrowWhite />
        </TransitionLink>
      </div>
    </div>
  );
}
