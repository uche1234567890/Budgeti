import { useAuthContext } from "./useAuthContext";
// import { useCaloryContext } from "./useCaloryContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  // const { dispatch: dispatchCalory } = useCaloryContext();

  const logout = () => {
    //Remove user from local storage
    localStorage.removeItem("user");

    //Dispatch Logout function
    dispatch({ type: "LOGOUT" });
    // dispatchCalory({ type: "SET_CALORY", payload: null });
  };
  return { logout };
};