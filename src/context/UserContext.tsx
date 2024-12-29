import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userId: number | null; // userId는 숫자 또는 null이어야 합니다.
  setUserInfo: React.Dispatch<React.SetStateAction<{ userId: number | null }>>; // setUserInfo는 userId만 받아야 합니다.
}

const defaultUserContext: UserContextType = {
  userId: null,
  setUserInfo: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<{ userId: number | null }>(defaultUserContext);

  return (
    <UserContext.Provider value={{ ...userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
