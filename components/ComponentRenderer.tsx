"use client";

import HeroSection from "./sections/HeroSection";
import Navbar from "./Navbar";
import { useNavbar } from "./NavbarContext";
import HeadlineSection, { HeadlineSectionData } from "./sections/HeadlineSection";
import ProjectsSection from "./sections/ProjectsSection";
import AllProjectsSection, { AllProjectsSectionData } from "./sections/AllProjectsSection";

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
      switch (component._type) {
        case "heroSection":
          elements.push(
            <HeroSection
              key={component._key || index}
              images={component.images}
              logo={component.logo}
            />,
          );
          break;
        case "headlineSection":
          elements.push(
            <HeadlineSection
              key={component._key || index}
              data={component as HeadlineSectionData}
            />,
          );
          break;
        case "projectsSection":
          elements.push(
            <ProjectsSection
              key={component._key || index}
              data={component as Extract<PageComponent, { _type: "projectsSection" }>}
              currentLanguage={currentLanguage}
            />,
          );
          break;
        case "allProjectsSection":
          elements.push(
            <AllProjectsSection
              key={component._key || index}
              data={component as AllProjectsSectionData}
              currentLanguage={currentLanguage}
            />,
          );
          break;

        default:
          elements.push(
            <div key={component._key || index} className="h-screen bg-red-600">
              {component._type} Component
            </div>,
          );
          break;
      }

      if (isHomePage && index === 0 && navbarData) {
        elements.push(<Navbar key="navbar" data={navbarData} currentLanguage={currentLanguage} />);
      }
    });

    return elements;
  };

  return <>{renderComponents()}</>;
}
