import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as auth from '../lib/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => auth.currentUser());

  const login = useCallback(async (email, password, remember) => {
    const u = await auth.signIn({ email, password });
    auth.startSession(u.id, remember);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const u = await auth.signUp(data);
    auth.startSession(u.id, true);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => { auth.endSession(); setUser(null); }, []);
  const update = useCallback((patch) => setUser(auth.updateUser(user.id, patch)), [user]);
  const changePassword = useCallback((cur, next) => auth.changePassword(user.id, cur, next), [user]);
  const deleteAccount = useCallback(() => { auth.deleteUser(user.id); setUser(null); }, [user]);

  const value = useMemo(() => ({ user, login, register, logout, update, changePassword, deleteAccount }), [user, login, register, logout, update, changePassword, deleteAccount]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
