import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";

const TOKEN_KEY = "payment_token";
const USER_KEY = "payment_user";

const readStoredUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  } catch {
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const currentToken = sessionStorage.getItem(TOKEN_KEY);
    const legacyToken = localStorage.getItem("token");

    if (!currentToken && legacyToken) {
      sessionStorage.setItem(TOKEN_KEY, legacyToken);
      localStorage.removeItem("token");
      return legacyToken;
    }

    return currentToken;
  });
  const [user, setUser] = useState(readStoredUser);

  const establishSession = useCallback((nextToken, nextUser) => {
    sessionStorage.setItem(TOKEN_KEY, nextToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser || null));
    setToken(nextToken);
    setUser(nextUser || null);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener("payment:unauthorized", signOut);
    return () => window.removeEventListener("payment:unauthorized", signOut);
  }, [signOut]);

  const value = useMemo(() => ({
    isAuthenticated: Boolean(token),
    user,
    establishSession,
    signOut,
  }), [establishSession, signOut, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
