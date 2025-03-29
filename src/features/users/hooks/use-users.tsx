import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CreateUserInput, UpdateUserInput, User } from "../data/schema";
import { useToast } from "@/hooks/use-toast";

export function useUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as User[];
    },
  });

  // Create a new user
  const createUser = useMutation({
    mutationFn: async (newUser: CreateUserInput) => {
      // First, create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: "password123", // Default password, should be changed by user
        email_confirm: true,
      });

      if (authError) {
        throw new Error(`Error al crear usuario: ${authError.message}`);
      }

      // Then create profile
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          ...newUser,
          id: authData.user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error al crear perfil: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update an existing user
  const updateUser = useMutation({
    mutationFn: async (user: UpdateUserInput) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          address: user.address,
          avatar_url: user.avatar_url,
          role_id: user.role_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a user
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // First delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        throw new Error(`Error al eliminar usuario: ${authError.message}`);
      }

      // Then delete the profile
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        throw new Error(`Error al eliminar perfil: ${error.message}`);
      }

      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    createUser,
    updateUser,
    deleteUser,
  };
}
