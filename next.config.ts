import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      {
        source: "/château",
        destination: "/projets/chateau",
        permanent: true,
      },
      {
        source: "/ch%C3%A2teau",
        destination: "/projets/chateau",
        permanent: true,
      },
      {
        source: "/conditions-générales-de-vente",
        destination: "/conditions-generales",
        permanent: true,
      },
      {
        source: "/conditions-g%C3%A9n%C3%A9rales-de-vente",
        destination: "/conditions-generales",
        permanent: true,
      },
      {
        source: "/prestations",
        destination: "/l-atelier",
        permanent: true,
      },
      {
        source: "/portrait",
        destination: "/l-atelier",
        permanent: true,
      },
      {
        source: "/general-4",
        destination: "/l-atelier",
        permanent: true,
      },
      {
        source: "/pauline",
        destination: "/projets/pauline",
        permanent: true,
      },
      {
        source: "/grange",
        destination: "/projets/grange",
        permanent: true,
      },
      {
        source: "/jaurès",
        destination: "/projets/jaures",
        permanent: true,
      },
      {
        source: "/jaur%C3%A8s",
        destination: "/projets/jaures",
        permanent: true,
      },
      {
        source: "/abbesses",
        destination: "/projets/abbesses",
        permanent: true,
      },
      {
        source: "/tréport",
        destination: "/projets/treport",
        permanent: true,
      },
      {
        source: "/tr%C3%A9port",
        destination: "/projets/treport",
        permanent: true,
      },
      {
        source: "/caron",
        destination: "/projets/caron",
        permanent: true,
      },
      {
        source: "/baigneur",
        destination: "/projets/baigneur",
        permanent: true,
      },
      {
        source: "/marais",
        destination: "/projets/marais",
        permanent: true,
      },
      {
        source: "/friedel",
        destination: "/projets/friedel",
        permanent: true,
      },
      {
        source: "/poteau",
        destination: "/projets/poteau",
        permanent: true,
      },
      {
        source: "/lilas",
        destination: "/projets/lilas",
        permanent: true,
      },
      {
        source: "/barneville",
        destination: "/projets/barneville",
        permanent: true,
      },
      {
        source: "/canalsaintmartin",
        destination: "/projets/canal",
        permanent: true,
      },
      {
        source: "/chaptal",
        destination: "/projets/chaptal",
        permanent: true,
      },
      {
        source: "/malebranche",
        destination: "/projets/malebranche",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
    qualities: [75, 85, 95],
  },
};

export default nextConfig;
