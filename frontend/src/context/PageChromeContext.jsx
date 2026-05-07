import { createContext, useContext, useState } from 'react';

const PageChromeContext = createContext({ hideNavbar: false, setHideNavbar: () => {} });

export function PageChromeProvider({ children }) {
  const [hideNavbar, setHideNavbar] = useState(false);
  return (
    <PageChromeContext.Provider value={{ hideNavbar, setHideNavbar }}>
      {children}
    </PageChromeContext.Provider>
  );
}

export function usePageChrome() {
  return useContext(PageChromeContext);
}
