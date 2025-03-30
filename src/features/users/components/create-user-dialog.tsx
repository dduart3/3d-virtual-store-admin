import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  CreateUserInput,
  userRoleOptions,
  UserRoles
} from "../data/schema";
import { useUsers } from "../hooks/use-users";
import { useUsersContext } from "../context/users-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AvatarCreator } from "../../avatar-creator";

export function CreateUserDialog() {
  const { isCreateUserOpen, setIsCreateUserOpen } = useUsersContext();
  const { createUser } = useUsers();
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateUserInput> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      avatar_url: "",
      role_id: UserRoles.USER,
    },
  });

  const avatarUrl = watch("avatar_url");

  // Restore form data when returning from avatar creator
  useEffect(() => {
    if (formData && isCreateUserOpen && !isAvatarCreatorOpen) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof CreateUserInput, value);
        }
      });
      setFormData(null);
    }
  }, [isCreateUserOpen, isAvatarCreatorOpen, formData, setValue]);

  const onSubmit = async (data: CreateUserInput) => {
    await createUser.mutateAsync(data);
    setIsCreateUserOpen(false);
    reset();
  };

  const handleClose = () => {
    setIsCreateUserOpen(false);
    reset();
  };

  const handleOpenAvatarCreator = () => {
    // Save current form data
    setFormData(getValues());
    
    // Close the create user dialog
    setIsCreateUserOpen(false);
    
    // Open avatar creator
    setTimeout(() => {
      setIsAvatarCreatorOpen(true);
    }, 100);
  };

  // Update the handleAvatarCreated function in CreateUserDialog
  const handleAvatarCreated = (avatarUrl: string) => {
    // Close avatar creator
    setIsAvatarCreatorOpen(false);
    
    // Only update the avatar URL if a non-empty URL was provided
    if (avatarUrl) {
      setFormData(prev => prev ? { ...prev, avatar_url: avatarUrl } : { avatar_url: avatarUrl });
    }
    
    // Reopen create user dialog
    setTimeout(() => {
      setIsCreateUserOpen(true);
    }, 100);
  };

  return (
    <>
      <Dialog open={isCreateUserOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
            <DialogDescription>
              Completa los campos para crear un nuevo usuario en el sistema.
            </DialogDescription>
          </DialogHeader>
          
          {/* Add a scrollable container for the form */}
          <div className="overflow-y-auto pr-1 flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Nombre</Label>
                    <Input id="first_name" {...register("first_name")} />
                    {errors.first_name && (
                      <p className="text-sm text-red-500">{errors.first_name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Apellido</Label>
                    <Input id="last_name" {...register("last_name")} />
                    {errors.last_name && (
                      <p className="text-sm text-red-500">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input id="username" {...register("username")} />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" {...register("phone")} />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea id="address" {...register("address")} />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="avatar_url"
                      {...register("avatar_url")}
                      placeholder="https://models.readyplayer.me/[id].glb"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleOpenAvatarCreator}
                    >
                      Crear
                    </Button>
                  </div>
                  {errors.avatar_url && (
                    <p className="text-sm text-red-500">{errors.avatar_url.message}</p>
                  )}
                  
                  {/* Avatar preview */}
                  {avatarUrl && (
                    <div className="mt-2 flex justify-center">
                      <img
                        src={avatarUrl.replace('.glb', '.png')}
                        alt="Avatar preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role_id">Rol</Label>
                  <Select
                    onValueChange={(value) => setValue("role_id", parseInt(value))}
                    defaultValue={UserRoles.USER.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value.toString()}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role_id && (
                    <p className="text-sm text-red-500">{errors.role_id.message}</p>
                  )}
                </div>
              </div>
              
              <DialogFooter className="mt-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createUser.isPending}>
                  {createUser.isPending ? "Creando..." : "Crear usuario"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Completely separate avatar creator dialog */}
      {isAvatarCreatorOpen && (
        <AvatarCreator
          open={isAvatarCreatorOpen}
          onOpenChange={setIsAvatarCreatorOpen}
          onAvatarCreated={handleAvatarCreated}
        />
      )}
    </>
  );
}
