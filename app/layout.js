"use client";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Loading from "./components/Loading";
import { Suspense, createContext } from "react";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import MobileMenu from "./components/MobileMenu";
import { IconMenu2 } from "@tabler/icons-react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { theme } from "./lib/theme";
import "./globals.css";
import "@mantine/core/styles.css";

export const DeviceContext = createContext();
export const AccordionContext = createContext();
export default function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(true);
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const [openContainers, setOpenContainers] = useState([]);
  const [itemsVisible, setItemsVisible] = useState("");
  const [containerToggle, setContainerToggle] = useState(0);
  const { width, height } = useViewportSize();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setDimensions({ width, height });
    setIsMobile(width < 1024);
  }, [width, height]);

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <UserProvider>
          <MantineProvider
            theme={theme}
            withCssVariables
            withGlobalClasses
            withStaticClasses
          >
            <AccordionContext.Provider
              value={{
                itemsVisible,
                setItemsVisible,
                openContainers,
                setOpenContainers,
                containerToggle,
                setContainerToggle,
              }}
            >
              <DeviceContext.Provider value={{ isMobile, dimensions }}>
                <Toaster />

                <div className="flex w-full justify-end h-fit pt-6 px-6 lg:hidden absolute">
                  <IconMenu2
                    size={30}
                    strokeWidth={2.4}
                    aria-label="Menu"
                    onClick={opened ? close : open}
                  />
                </div>
                {isMobile ? (
                  <MobileMenu open={open} close={close} opened={opened} />
                ) : (
                  <Sidebar />
                )}
                <div className="lg:w-[60px] absolute left-0 top-0 bg-slate-100 h-screen z-0" />
                <div className="lg:pl-[60px]">
                  <Suspense fallback={<Loading />}>
                    <main className="w-full  px-6 xl:p-8 pt-6">{children}</main>
                  </Suspense>
                </div>
              </DeviceContext.Provider>
            </AccordionContext.Provider>
          </MantineProvider>
        </UserProvider>
      </body>
    </html>
  );
}
