"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { useTransitionRouter } from "next-view-transitions";

interface TransitionLinkProps extends LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

export default function TransitionLink({ children, href, ...props }: TransitionLinkProps) {
  const router = useTransitionRouter();

  const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.push(href, {
      onTransitionReady: pageAnimation,
    });
  };

  return (
    <Link onClick={handleTransition} href={href} {...props}>
      {children}
    </Link>
  );
}

const pageAnimation = () => {
  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: "translateY(0)",
      },
      {
        opacity: 0.2,
        transform: "translateY(-35%)",
      },
    ],
    {
      duration: 1500,
      easing: "cubic-bezier(0.87, 0, 0.13, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    },
  );

  document.documentElement.animate(
    [
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      },
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      },
    ],
    {
      duration: 1500,
      easing: "cubic-bezier(0.87, 0, 0.13, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    },
  );
};
