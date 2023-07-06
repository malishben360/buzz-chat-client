import { useState, createContext, ReactNode, useEffect } from "react";
import axios from "axios";

interface UserContextProps {
  id: string | null;
  username: string | null;
  setId: (id: string | null) => void;
  setUsername: (username: string | null) => void;
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextProps>({
  id: null,
  username: null,
  setId: () => {
    return;
  },
  setUsername: () => {
    return;
  },
});

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    axios.get("/profile").then((res) => {
      const { data } = res;
      setId(data.id);
      setUsername(data.username);
    });
  }, []);
  return (
    <UserContext.Provider value={{ id, username, setId, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
