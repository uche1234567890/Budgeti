import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

//Upon calling the hook `useAuthContext`, the functionalities of `AuthContext.js` is invoked.
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be used in a AuthContextProvider");
  }
  return context;
};