import { createContext, useContext, useState, ReactNode } from "react";

// Role enum 타입 정의
export type Role = "USER" | "ADMIN";

interface UserContextType {
  userId: number | null; // userId는 숫자 또는 null
  role: Role | null; // role은 "USER" 또는 "ADMIN" 또는 null
  setUserInfo: React.Dispatch<React.SetStateAction<{ userId: number | null; role: Role | null }>>; // userId와 role 설정
}

const defaultUserContext: UserContextType = {
  userId: null,
  role: null,
  setUserInfo: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<{ userId: number | null; role: Role | null }>(defaultUserContext);

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
