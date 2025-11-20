"use client";

import HeroSection from "./sections/HeroSection";
import Navbar from "./Navbar";
import { useNavbar } from "./NavbarContext";

interface PageComponent {
  _type: string;
  _key: string;
  [key: string]: any;
}

interface ComponentRendererProps {
  components: PageComponent[];
  isHomePage?: boolean;
  currentLanguage?: "en" | "fr";
}

export default function ComponentRenderer({
  components,
  isHomePage = false,
  currentLanguage = "fr",
}: ComponentRendererProps) {
  const navbarData = useNavbar();
  if (!components || components.length === 0) {
    return null;
  }

  const renderComponents = () => {
    const elements: React.ReactElement[] = [];

    components.forEach((component: PageComponent, index: number) => {
      // Render the component
      switch (component._type) {
        case "heroSection":
          elements.push(
            <HeroSection
              key={component._key || index}
              images={component.images}
              logo={component.logo}
            />
          );
          break;
        default:
          elements.push(
            <div
              key={component._key || index}
              className="h-screen bg-red-600"
            ></div>
          );
          break;
      }

      // Insert navbar after first component on home pages
      if (isHomePage && index === 0 && navbarData) {
        elements.push(
          <Navbar
            key="navbar"
            data={navbarData}
            currentLanguage={currentLanguage}
          />
        );
      }
    });

    return elements;
  };

  return <>{renderComponents()}</>;
}
