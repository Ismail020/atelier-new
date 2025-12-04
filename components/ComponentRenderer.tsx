"use client";

import Navbar from "./Navbar";
import { useNavbar } from "./NavbarContext";
import { usePathname } from "next/navigation";
import { Language } from "@/types/TranslationsData";
import HeroSection, { HeroSectionData } from "./sections/HeroSection";
import HeadlineSection, { HeadlineSectionData } from "./sections/HeadlineSection";
import ProjectsSection, { ProjectsSectionData } from "./sections/ProjectsSection";
import AllProjectsSection, { AllProjectsSectionData } from "./sections/AllProjectsSection";
import ContentSection, { ContentSectionData } from "./sections/ContentSection";
import PressCoverageSection, { PressCoverageSectionData } from "./sections/PressCoverageSection";

interface BaseComponent {
  _type: string;
  _key: string;
}

type PageComponent =
  | HeroSectionData
  | HeadlineSectionData
  | ProjectsSectionData
  | AllProjectsSectionData
  | (BaseComponent & { _type: string });

interface ComponentRendererProps {
  components: PageComponent[];
  isHomePage?: boolean;
  lng: Language;
}

export default function ComponentRenderer({
  components,
  isHomePage = false,
  lng,
}: ComponentRendererProps) {
  const navbarData = useNavbar();
  const pathname = usePathname();
  const isAtelierPage = pathname === "/l-atelier" || pathname === "/en/atelier";
  const theme = isAtelierPage ? "black" : "white";

  if (!components || components.length === 0) {
    return null;
  }

  const renderComponents = () => {
    const elements: React.ReactElement[] = [];
    components.forEach((component: PageComponent, index: number) => {
      switch (component._type) {
        case "heroSection":
          elements.push(
            <HeroSection key={component._key || index} data={component as HeroSectionData} />,
          );
          break;

        case "headlineSection":
          elements.push(
            <HeadlineSection
              key={component._key || index}
              data={component as HeadlineSectionData}
              lng={lng}
            />,
          );
          break;

        case "projectsSection":
          elements.push(
            <ProjectsSection
              key={component._key || index}
              data={component as Extract<PageComponent, { _type: "projectsSection" }>}
              lng={lng}
            />,
          );
          break;

        case "allProjectsSection":
          elements.push(
            <AllProjectsSection
              key={component._key || index}
              data={component as AllProjectsSectionData}
              lng={lng}
            />,
          );
          break;

        case "contentSection":
          elements.push(
            <ContentSection
              key={component._key || index}
              data={component as ContentSectionData}
              lng={lng}
            />,
          );
          break;

        case "pressCoverageSection":
          elements.push(
            <PressCoverageSection
              key={component._key || index}
              data={component as PressCoverageSectionData}
              lng={lng}
            />,
          );
          break;

        default:
          return null;
          break;
      }

      if (isHomePage && index === 0 && navbarData) {
        elements.push(<Navbar key="navbar" data={navbarData} lng={lng} theme={theme} />);
      }
    });

    return elements;
  };

  return <>{renderComponents()}</>;
}
