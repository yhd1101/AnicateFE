import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextProps {
  gu: string;
  dong: string;
  setSearch: (gu: string, dong: string) => void;
}

const SearchContext = createContext<SearchContextProps>({
  gu: '',
  dong: '',
  setSearch: () => {},
});

interface SearchProviderProps {
  children: ReactNode; // ReactNode 타입으로 children 명시
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [search, setSearch] = useState({ gu: '', dong: '' });

  const updateSearch = (gu: string, dong: string) => setSearch({ gu, dong });

  return (
    <SearchContext.Provider value={{ ...search, setSearch: updateSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
