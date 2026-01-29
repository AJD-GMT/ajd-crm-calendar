'use client';

import { useAuthContext } from '@/providers/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, session, loading } = useAuthContext();
  const supabase = createClient();
  const router = useRouter();

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/login');
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    signUp,
  };
}
