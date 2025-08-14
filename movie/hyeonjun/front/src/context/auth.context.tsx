import React from 'react';
import { tokenStore, Reason } from '../utils/auth/token.store';

type AuthContextValue = {
  token: string | null;
  isAuthed: boolean;
  reason: Reason | null;
  login: (t: string) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = React.useState<string | null>(() => tokenStore.get());
  const [reason, setReason] = React.useState<Reason | null>(null);

  React.useEffect(() => {
    const unsub = tokenStore.subscribe((r, tk) => {
      setReason(r);
      setToken(tk || null);
    });
    return () => {
      unsub();
    };
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthed: !!token,
      reason,
      login: (t: string) => tokenStore.set(t),
      logout: () => tokenStore.clear(),
    }),
    [token, reason]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
/* eslint-disable react-refresh/only-export-components */
export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
