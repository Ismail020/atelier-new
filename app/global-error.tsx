"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NavArrowWhite, Reload } from "@/components/Icons";
import { Balancer } from "react-wrap-balancer";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [isResetting, setIsResetting] = useState(false);

  // Detect language from URL
  const isEnglish = typeof window !== "undefined" && window.location.pathname.startsWith("/en");

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      reset();
    }, 300);
  };

  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          body {
            font-family: 'Poppins', sans-serif;
          }
        .h1-special {
  font-family: Poppins;
  font-size: 36px;
  font-style: normal;
  font-weight: 300;
  line-height: 130%; /* 46.8px */
  letter-spacing: -1.08px;
  margin: 0;
}

@media (min-width: 768px) {
  .h1-special {
    font-size: 80px;
    line-height: 120%;
    letter-spacing: -2.4px;
  }
}
          .nav {
            font-family: Poppins;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 180%;
            letter-spacing: -0.16px;
          }
          @media (min-width: 640px) {
            .button-container {
              flex-direction: row !important;
              gap: 1.75rem !important;
            }
          }
        `}</style>
      </head>
      <body
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), url(/Header.png) lightgray -0.789px -88.486px / 99.638% 110.093% no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          margin: 0,
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              gap: "1.75rem",
              textAlign: "center",
            }}
          >
            <h2 className="h1-special" style={{ color: "white" }}>
              <Balancer>
                {isEnglish ? "Oops, something went wrong" : "Oups, quelque chose s'est mal passé"}
              </Balancer>
            </h2>

            <div
              className="button-container"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="nav"
                style={{
                  display: "flex",
                  width: "fit-content",
                  cursor: isResetting ? "not-allowed" : "pointer",
                  alignItems: "center",
                  gap: "0.375rem",
                  textAlign: "center",
                  color: "white",
                  opacity: isResetting ? 0.7 : 1,
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                {isResetting ? (
                  <>
                    <span>{isEnglish ? "Trying again..." : "Nouvel essai..."}</span>
                    <div
                      style={{
                        display: "inline-block",
                        height: "1rem",
                        width: "1rem",
                        animation: "spin 1s linear infinite",
                        borderRadius: "50%",
                        border: "2px solid white",
                        borderRightColor: "transparent",
                      }}
                    />
                  </>
                ) : (
                  <>
                    {isEnglish ? "Try again" : "Réessayer"} <Reload />
                  </>
                )}
              </button>

              <Link
                href={isEnglish ? "/en" : "/"}
                className="nav"
                style={{
                  display: "flex",
                  width: "fit-content",
                  alignItems: "center",
                  gap: "0.375rem",
                  textAlign: "center",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                {isEnglish ? "Go to homepage" : "Aller à l'accueil"} <NavArrowWhite />
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
