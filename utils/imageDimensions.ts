"use client";

import { useEffect, useState } from "react";

export interface ImageDimensionsConfig {
  // Aspect ratios for different screen sizes
  mobileAspectRatio?: { width: number; height: number };
  desktopAspectRatio?: { width: number; height: number };

  // Grid configuration
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;

  // Container settings
  mobilePadding?: number;
  desktopPadding?: number;
  gap?: number;

  // Fallback dimensions for SSR
  fallbackWidth?: number;
  fallbackHeight?: number;

  // Breakpoints
  tabletBreakpoint?: number;
  desktopBreakpoint?: number;
}

/**
 * Calculate dynamic image dimensions based on container size and aspect ratios
 */
export function calculateImageDimensions(config: ImageDimensionsConfig = {}) {
  const {
    mobileAspectRatio = { width: 373.043, height: 240.176 },
    desktopAspectRatio = { width: 463, height: 619 },
    mobileColumns = 1,
    tabletColumns = 2,
    desktopColumns = 3,
    mobilePadding = 40,
    desktopPadding = 80,
    gap = 32,
    fallbackWidth = 800,
    fallbackHeight = 600,
    tabletBreakpoint = 768,
    desktopBreakpoint = 1024,
  } = config;

  if (typeof window === "undefined") {
    // Server-side fallback
    return { width: fallbackWidth, height: fallbackHeight };
  }

  const vw = window.innerWidth;
  const containerPadding = vw < tabletBreakpoint ? mobilePadding : desktopPadding;

  if (vw < tabletBreakpoint) {
    // Mobile
    const availableWidth = vw - containerPadding;
    const gaps = (mobileColumns - 1) * gap;
    const containerWidth = (availableWidth - gaps) / mobileColumns;
    const aspectRatio = mobileAspectRatio.width / mobileAspectRatio.height;
    const height = Math.round(containerWidth / aspectRatio);
    return { width: Math.round(containerWidth), height };
  } else if (vw < desktopBreakpoint) {
    // Tablet
    const availableWidth = vw - containerPadding;
    const gaps = (tabletColumns - 1) * gap;
    const containerWidth = (availableWidth - gaps) / tabletColumns;
    const aspectRatio = desktopAspectRatio.width / desktopAspectRatio.height;
    const height = Math.round(containerWidth * aspectRatio);
    return { width: Math.round(containerWidth), height };
  } else {
    // Desktop
    const availableWidth = vw - containerPadding;
    const gaps = (desktopColumns - 1) * gap;
    const containerWidth = (availableWidth - gaps) / desktopColumns;
    const aspectRatio = desktopAspectRatio.width / desktopAspectRatio.height;
    const height = Math.round(containerWidth * aspectRatio);
    return { width: Math.round(containerWidth), height };
  }
}

/**
 * Hook for dynamic image dimensions with resize listener
 */
export function useDynamicImageDimensions(config?: ImageDimensionsConfig) {
  const [dimensions, setDimensions] = useState(() => calculateImageDimensions(config));

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions(calculateImageDimensions(config));
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [config]);

  return dimensions;
}

// Preset configurations for common use cases
export const imageConfigs = {
  relatedProjects: {
    mobileAspectRatio: { width: 373.043, height: 240.176 },
    desktopAspectRatio: { width: 463, height: 619 },
    mobileColumns: 1,
    tabletColumns: 2,
    desktopColumns: 3,
  },
  projectGrid: {
    mobileAspectRatio: { width: 285, height: 386 },
    desktopAspectRatio: { width: 285, height: 386 },
    mobileColumns: 3,
    tabletColumns: 4,
    desktopColumns: 5,
  },
  hero: {
    mobileAspectRatio: { width: 16, height: 9 },
    desktopAspectRatio: { width: 21, height: 9 },
    mobileColumns: 1,
    tabletColumns: 1,
    desktopColumns: 1,
    fallbackWidth: 1200,
    fallbackHeight: 600,
  },
} satisfies Record<string, ImageDimensionsConfig>;
