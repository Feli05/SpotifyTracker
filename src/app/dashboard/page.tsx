"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    loadUser();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Welcome to your Dashboard</h1>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
