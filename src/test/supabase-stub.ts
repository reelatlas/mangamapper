// Leaf module: imports NOTHING from src/ so vi.mock factories can pull it in
// without creating a cycle (factory -> stub -> app code -> mocked module).
export const supabaseAuthStub = () => ({
  auth: {
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    getSession: () => Promise.resolve({ data: { session: null } }),
    signUp: () => Promise.resolve({ error: null }),
    signInWithPassword: () => Promise.resolve({ error: null }),
    signInWithOAuth: () => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
});
