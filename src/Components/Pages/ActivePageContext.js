// ActivePageContext.js
import React, { createContext, useState, useEffect } from 'react';

const ActivePageContext = createContext();

export const ActivePageProvider = ({ children }) => {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || '';
  });

  useEffect(() => {
    localStorage.setItem('activePage', activePage);
  }, [activePage]);

  return (
    <ActivePageContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </ActivePageContext.Provider>
  );
};

export const useActivePage = () => React.useContext(ActivePageContext);
