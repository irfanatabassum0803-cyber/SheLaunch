import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_USER_ID } from '../lib/seed';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isDemoUser: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  loginDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILE: Profile = {
  id: DEMO_USER_ID,
  email: 'noor.alzahra@noorjewels.com',
  full_name: 'Noor Al-Zahra',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      // Check demo user in localStorage first
      const storedDemo = localStorage.getItem('shelaunch_demo_mode');
      if (storedDemo === 'true') {
        setUser(DEMO_PROFILE);
        setIsDemoUser(true);
        setLoading(false);
        return;
      }

      // Check stored custom local user
      const storedLocalUser = localStorage.getItem('shelaunch_local_user');
      if (storedLocalUser) {
        try {
          setUser(JSON.parse(storedLocalUser));
          setLoading(false);
          return;
        } catch {
          // ignore
        }
      }

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile as Profile);
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || 'Founder',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          }
        } catch (e) {
          console.warn('Supabase session load error:', e);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const loginDemo = () => {
    localStorage.setItem('shelaunch_demo_mode', 'true');
    localStorage.removeItem('shelaunch_local_user');
    setUser(DEMO_PROFILE);
    setIsDemoUser(true);
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) {
          setLoading(false);
          return { error: error.message };
        }
        if (data.user) {
          const newProfile: Profile = {
            id: data.user.id,
            email,
            full_name: fullName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await supabase.from('profiles').insert([newProfile]);
          setUser(newProfile);
          setLoading(false);
          return {};
        }
      }

      // Local offline fallback user
      const localProfile: Profile = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        email,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.removeItem('shelaunch_demo_mode');
      localStorage.setItem('shelaunch_local_user', JSON.stringify(localProfile));
      setUser(localProfile);
      setIsDemoUser(false);
      setLoading(false);
      return {};
    } catch (e: any) {
      setLoading(false);
      return { error: e?.message || 'Signup failed' };
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setLoading(false);
          return { error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          setUser(profile || {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || 'Founder',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          setIsDemoUser(false);
          setLoading(false);
          return {};
        }
      }

      // Local fallback match or auto-auth
      const localProfile: Profile = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        email,
        full_name: email.split('@')[0] || 'Founder',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.removeItem('shelaunch_demo_mode');
      localStorage.setItem('shelaunch_local_user', JSON.stringify(localProfile));
      setUser(localProfile);
      setIsDemoUser(false);
      setLoading(false);
      return {};
    } catch (e: any) {
      setLoading(false);
      return { error: e?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('shelaunch_demo_mode');
    localStorage.removeItem('shelaunch_local_user');
    setUser(null);
    setIsDemoUser(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemoUser, signUp, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
