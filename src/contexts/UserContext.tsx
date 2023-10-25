import { createContext, useState, ReactNode, useEffect, useContext } from "react";

import { get as getUserRepository, UserResponse } from "../repositories/user";

const UserContext = createContext<{data: null|UserResponse, requestUpdate: () => void}>({data: null, requestUpdate: () => null});

const useGet = () => {
  const contextValue = useContext(UserContext);
  return contextValue.data;
};

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDirty, setIsDirty] = useState(true);
  const [userResponse, setUserResponse] = useState<null|UserResponse>(null)

  useEffect(() => {
    if (isDirty) {
      getUserRepository().then((res) => { setUserResponse(res); setIsDirty(false) });
    }
  }, [isDirty]);

  const value = {
    data: userResponse,
    requestUpdate: () => { setIsDirty(true); },
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

export { useGet };
