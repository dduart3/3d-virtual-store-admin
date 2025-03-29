import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../data/schema";

interface UsersContextType {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  isUpdateUserOpen: boolean;
  setIsUpdateUserOpen: (isOpen: boolean) => void;
  isDeleteUserOpen: boolean;
  setIsDeleteUserOpen: (isOpen: boolean) => void;
  isCreateUserOpen: boolean;
  setIsCreateUserOpen: (isOpen: boolean) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  return (
    <UsersContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        isCreateUserOpen,
        setIsCreateUserOpen,
        isUpdateUserOpen,
        setIsUpdateUserOpen,
        isDeleteUserOpen,
        setIsDeleteUserOpen,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useUsersContext() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsersContext must be used within a UsersProvider");
  }
  return context;
}

export default UsersProvider;
