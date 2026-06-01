import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [usuarioBD, setUsuarioBD] = useState(null);
  return (
    <UserContext.Provider value={{ usuarioBD, setUsuarioBD }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsuarioBD() {
  return useContext(UserContext);
}