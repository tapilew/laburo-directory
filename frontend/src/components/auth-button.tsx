"use client";

import { useAuth } from "@crossmint/client-sdk-react-ui";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { login, logout, user, jwt } = useAuth();

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg mt-4 bg-muted/10">
      {user == null ? (
        <Button onClick={login} className="w-full">Login</Button>
      ) : (
        <Button onClick={logout} variant="outline" className="w-full">Logout</Button>
      )}
      {user && (
        <div className="text-sm break-all space-y-2">
          <p><span className="font-bold">User:</span> {user.id}</p>
          <p><span className="font-bold">Email:</span> {user.email}</p>
          <p className="text-xs text-muted-foreground"><span className="font-bold">JWT:</span> {jwt?.slice(0, 20)}...</p>
        </div>
      )}
    </div>
  );
}
