import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useSettings } from "@/components/SettingsContext";

interface ImageAsset {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
}

interface ContactInfo {
  headOfDesign?: {
    name: string;
    phone: string;
    email: string;
  };
  generalInquiries?: {
    email: string;
  };
}

interface SocialMedia {
  platform: string;
  url: string;
}

export interface ContactSectionData {
  _type: "contactSection";
  _key?: string;
  title: string;
  backgroundImage?: ImageAsset;
  contactUsImage?: ImageAsset;
  column1Title: string;
  column2Title: string;
  column3Title: string;
}

interface ContactSectionProps {
  data: ContactSectionData;
  lng: string;
}

export default function ContactSection({ data, lng }: ContactSectionProps) {
  const aspectRatio = 346 / 453.792;
  const settings = useSettings();

  return (
    <div className="flex flex-col gap-14 px-2.5 pt-16 md:px-5">
      <div className="flex justify-between gap-24">
        <div className="flex w-full flex-col justify-between gap-20">
          <h1 className="h1-desktop max-w-[465px]">{data.title}</h1>

          <div className="flex w-full flex-col gap-8 lg:flex-row">
            <ContactColumn
              title={data.column1Title}
              content={
                settings?.settingsContact?.headOfDesign ? (
                  <>
                    <p className="body-2">{settings.settingsContact.headOfDesign.name}</p>
                    <a
                      href={`tel:${settings.settingsContact.headOfDesign.phone}`}
                      className="body-2 transition-colors hover:text-[#140D01]"
                    >
                      {settings.settingsContact.headOfDesign.phone}
                    </a>
                    <a
                      href={`mailto:${settings.settingsContact.headOfDesign.email}`}
                      className="body-2 transition-colors hover:text-[#140D01]"
                    >
                      {settings.settingsContact.headOfDesign.email}
                    </a>
                  </>
                ) : (
                  <p className="body-2">No contact info available</p>
                )
              }
            />

            <ContactColumn
              title={data.column2Title}
              content={
                settings?.settingsContact?.generalInquiries?.email ? (
                  <a
                    href={`mailto:${settings.settingsContact.generalInquiries.email}`}
                    className="body-2 transition-colors hover:text-[#140D01]"
                  >
                    {settings.settingsContact.generalInquiries.email}
                  </a>
                ) : (
                  <p className="body-2">No email available</p>
                )
              }
            />

            <ContactColumn
              title={data.column3Title}
              content={
                settings?.settingsSocial && settings.settingsSocial.length > 0 ? (
                  <>
                    {settings.settingsSocial.map((social: SocialMedia) =>
                      social.url ? (
                        <a
                          key={social.platform}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="body-2 transition-colors hover:text-[#140D01]"
                        >
                          {social.platform}
                        </a>
                      ) : null,
                    )}
                  </>
                ) : (
                  <p className="body-2">No social media links available</p>
                )
              }
            />
          </div>
        </div>

        {data.backgroundImage?.asset && <RightSideImage image={data.backgroundImage} />}
      </div>

      <div>{data.contactUsImage?.asset && <BottomImage image={data.contactUsImage} />}</div>
    </div>
  );
}

function ContactColumn({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <h3 className="body text-[#CECECE]">{title}</h3>
      <div className="body flex flex-col gap-1.5 text-[#140D01]">{content}</div>
    </div>
  );
}

function RightSideImage({ image }: { image: ImageAsset }) {
  return (
    <div className="hidden md:block md:max-w-[300px] lg:max-w-[400px]">
      <Image
        src={urlFor(image).quality(80).url()}
        alt={image.alt || "Contact image"}
        width={346}
        height={454}
        className="h-auto w-full object-cover"
        unoptimized
      />
    </div>
  );
}

function BottomImage({ image }: { image: ImageAsset }) {
  return (
    <div className="hidden w-full md:block">
      <Image
        src={urlFor(image).quality(80).url()}
        alt={image.alt || "Contact image"}
        width={346}
        height={454}
        className="h-auto w-full object-cover"
        unoptimized
      />
    </div>
  );
}
