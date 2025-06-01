
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User, Provider } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  isDoctor: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => ({ error: null }) as { error: any },
  signUp: async () => ({ error: null }) as { error: any },
  signOut: async () => ({ error: null }) as { error: any },
  signInWithGoogle: async () => ({ error: null }) as { error: any },
  isDoctor: () => false,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession ? 'Has session' : 'No session');
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    const initSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', currentSession ? 'Has session' : 'No session');
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };
    
    initSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign in error:', error);
      } else {
        console.log('Sign in successful');
      }
      return { error };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      if (error) {
        console.error('Sign up error:', error);
      } else {
        console.log('Sign up successful');
      }
      return { error };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error };
    }
  };

  const signOut = async (): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
      return { error };
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      return { error };
    }
  };
  
  const signInWithGoogle = async (): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        console.error('Google sign in error:', error);
      } else {
        console.log('Google sign in initiated');
      }
      return { error };
    } catch (error) {
      console.error('Unexpected Google sign in error:', error);
      return { error };
    }
  };
  
  // Helper function to check if the current user is a doctor
  const isDoctor = (): boolean => {
    return !!user?.user_metadata?.doctor;
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    isDoctor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
