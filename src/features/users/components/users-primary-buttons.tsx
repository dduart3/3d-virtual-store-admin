import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useUsersContext } from "../context/users-context";

export function UsersPrimaryButtons() {
  const { setIsCreateUserOpen } = useUsersContext();

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={() => setIsCreateUserOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Nuevo usuario
      </Button>
    </div>
  );
}
