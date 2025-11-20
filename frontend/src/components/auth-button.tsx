"use client";

import { useAuth } from "@crossmint/client-sdk-react-ui";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { login, logout, jwt } = useAuth();

  return !jwt ? (
    <Button type="button" onClick={login}>
      Login
    </Button>
  ) : (
    <Button type="button" onClick={logout}>
      Logout
    </Button>
  );
}
