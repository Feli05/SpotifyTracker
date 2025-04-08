// This is a simplified auth helper - in a real application, 
// you would integrate with your actual authentication system
// like NextAuth.js, Clerk, Auth0, etc.

// Mock user data for development
const mockUser = {
  id: "user123",
  name: "Test User",
  email: "test@example.com",
  image: "https://i.pravatar.cc/150?u=test@example.com"
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type Session = {
  user: User;
};

/**
 * Get the current user session
 * In a real app, this would check cookies, JWT tokens, etc.
 */
export async function getSession(): Promise<Session | null> {
  // For development purposes, we're always returning a session
  // In a real app, you would check if the user is authenticated
  
  return {
    user: mockUser
  };
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
} 