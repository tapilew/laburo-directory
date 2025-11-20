"use client";

import { useAuth } from "@crossmint/client-sdk-react-ui";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { login, logout, user, jwt } = useAuth();

  return (
    <div className="flex-gap-4">
      {user == null ? (
        <Button onClick={login}>Login</Button>
      ) : (
        <Button onClick={logout}>Logout</Button>
      )}
      <p>User: {user?.id}</p>
      <p>Email: {user?.email}</p>
      <p>JWT: {jwt}</p>
    </div>
  );
}
