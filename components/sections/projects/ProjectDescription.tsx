import TransitionLink from "@/components/utils/TransitionLink";
import { getLocalizedValue } from "@/utils/getLocalizedValue";
import Balancer from "react-wrap-balancer";
import { SETTINGS_QUERYResult } from "@/sanity/types";

interface ProjectDescriptionProps {
  data: {
    projectDescription:
      | Array<{ _key: string; _type: string; value?: string }>
      | string
      | null
      | undefined;
  };
  lng: string;
  settings?: SETTINGS_QUERYResult;
}

export default function ProjectDescription({ data, lng, settings }: ProjectDescriptionProps) {
  const contactButton = settings?.contactUsButton;
  const buttonText = contactButton?.text ? getLocalizedValue(contactButton.text, lng) : null;

  const contactPageSlug =
    lng === "en"
      ? contactButton?.contactPages?.english?.slug?.current
      : contactButton?.contactPages?.french?.slug?.current;

  return (
    <div className="flex max-w-[500px] flex-col gap-8 px-2.5 pt-6 md:px-5 md:pt-10">
      <p className="body">
        <Balancer>{getLocalizedValue(data.projectDescription, lng)}</Balancer>
      </p>

      {contactButton && buttonText && contactPageSlug && (
        <TransitionLink href={`/${contactPageSlug}`} className="button buttons">
          {buttonText}
        </TransitionLink>
      )}
    </div>
  );
}
