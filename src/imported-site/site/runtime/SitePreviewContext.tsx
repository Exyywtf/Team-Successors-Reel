import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface SitePreviewContextValue {
  pathname: string;
  setPathname: (pathname: string) => void;
}

const SitePreviewContext = createContext<SitePreviewContextValue | null>(null);

export const SitePreviewProvider: React.FC<{
  pathname: string;
  children: React.ReactNode;
}> = ({ pathname, children }) => {
  const [activePathname, setActivePathname] = useState(pathname);

  useEffect(() => {
    setActivePathname(pathname);
  }, [pathname]);

  const value = useMemo(
    () => ({ pathname: activePathname, setPathname: setActivePathname }),
    [activePathname],
  );

  return (
    <SitePreviewContext.Provider value={value}>
      {children}
    </SitePreviewContext.Provider>
  );
};

export function useSitePreviewContext() {
  const value = useContext(SitePreviewContext);
  if (!value) {
    throw new Error("Site preview context is missing.");
  }

  return value;
}
