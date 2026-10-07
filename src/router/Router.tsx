import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
  query: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;

    if (to !== window.location.pathname) {
      window.history.pushState({}, '', to);
      setCurrentPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Parse path and params
  const [params, setParams] = useState<Record<string, string>>({});
  const [query, setQuery] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Parse query params
    const searchParams = new URLSearchParams(window.location.search);
    const parsedQuery: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      parsedQuery[key] = value;
    });
    setQuery(parsedQuery);

    // Simple parametric pattern extraction
    const segments = currentPath.split('/').filter(Boolean);
    const newParams: Record<string, string> = {};

    if (segments[0] === 'urun' && segments[1]) {
      newParams.slug = segments[1];
    } else if (segments[0] === 'kategori' && segments[1]) {
      newParams.slug = segments[1];
    } else if (segments[0] === 'yangin-cami' && segments[1]) {
      const val = segments[1].toLowerCase();
      if (['istanbul', 'ankara', 'izmir', 'bursa', 'antalya'].includes(val)) {
        newParams.city = val;
      } else {
        newParams.fireClass = segments[1];
      }
    } else if (segments[0] === 'sehir' && segments[1]) {
      newParams.city = segments[1];
    } else if (segments[0] === 'yasal' && segments[1]) {
      newParams.legalSlug = segments[1];
    }

    setParams(newParams);
  }, [currentPath]);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params, query }}>
      {children}
    </RouterContext.Provider>
  );
};
