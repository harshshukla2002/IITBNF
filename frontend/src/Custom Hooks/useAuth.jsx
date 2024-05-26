import { useEffect, useState } from "react";

export const useAuth = () => {
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem("token")) ? true : false
  );

  useEffect(() => {
    localStorage.setItem("auth", auth);
  }, [auth]);

  return { auth, setAuth };
};
