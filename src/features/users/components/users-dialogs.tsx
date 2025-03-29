import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUsersContext } from '../context/users-context'
import {
  createUserSchema,
  CreateUserInput,
  updateUserSchema,
  UpdateUserInput,
  userRoleOptions,
} from '../data/schema'
import { useUsers } from '../hooks/use-users'

export function UsersDialogs() {
  return (
    <>
      <UpdateUserDialog />
      <DeleteUserDialog />
    </>
  )
}



function UpdateUserDialog() {
  const { selectedUser, isUpdateUserOpen, setIsUpdateUserOpen } =
    useUsersContext()
  const { updateUser } = useUsers()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: '',
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      address: '',
      avatar_url: '',
      role_id: undefined,
    },
  })

  // Set form values when selected user changes
  useEffect(() => {
    if (selectedUser) {
      reset({
        id: selectedUser.id,
        username: selectedUser.username,
        email: selectedUser.email,
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        phone: selectedUser.phone || '',
        address: selectedUser.address || '',
        avatar_url: selectedUser.avatar_url || '',
        role_id: selectedUser.role_id,
      })
    }
  }, [selectedUser, reset])

  const onSubmit = async (data: UpdateUserInput) => {
    await updateUser.mutateAsync(data)
    setIsUpdateUserOpen(false)
  }

  const handleClose = () => {
    setIsUpdateUserOpen(false)
    reset()
  }

  return (
    <Dialog open={isUpdateUserOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Actualizar usuario</DialogTitle>
          <DialogDescription>
            Modifica los campos para actualizar la información del usuario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='first_name'>Nombre</Label>
                <Input id='first_name' {...register('first_name')} />
                {errors.first_name && (
                  <p className='text-sm text-red-500'>
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='last_name'>Apellido</Label>
                <Input id='last_name' {...register('last_name')} />
                {errors.last_name && (
                  <p className='text-sm text-red-500'>
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='username'>Nombre de usuario</Label>
              <Input id='username' {...register('username')} />
              {errors.username && (
                <p className='text-sm text-red-500'>
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Correo electrónico</Label>
              <Input
                id='email'
                type='email'
                {...register('email')}
                disabled
                className='opacity-70'
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Teléfono</Label>
              <Input id='phone' {...register('phone')} />
              {errors.phone && (
                <p className='text-sm text-red-500'>{errors.phone.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='address'>Dirección</Label>
              <Textarea id='address' {...register('address')} />
              {errors.address && (
                <p className='text-sm text-red-500'>{errors.address.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='avatar_url'>URL de avatar</Label>
              <Input
                id='avatar_url'
                {...register('avatar_url')}
                disabled
                className='opacity-70'
              />
              {errors.avatar_url && (
                <p className='text-sm text-red-500'>
                  {errors.avatar_url.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='role_id'>Rol</Label>
              <Select
                onValueChange={(value) => setValue('role_id', parseInt(value))}
                defaultValue={selectedUser?.role_id?.toString()}
                value={selectedUser?.role_id?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Seleccionar rol' />
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
                <p className='text-sm text-red-500'>{errors.role_id.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancelar
            </Button>
            <Button type='submit' disabled={updateUser.isPending}>
              {updateUser.isPending ? 'Actualizando...' : 'Actualizar usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteUserDialog() {
  const { selectedUser, isDeleteUserOpen, setIsDeleteUserOpen } =
    useUsersContext()
  const { deleteUser } = useUsers()

  const handleDelete = async () => {
    if (selectedUser?.id) {
      await deleteUser.mutateAsync(selectedUser.id)
      setIsDeleteUserOpen(false)
    }
  }

  const handleClose = () => {
    setIsDeleteUserOpen(false)
  }

  return (
    <Dialog open={isDeleteUserOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Eliminar usuario</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          {selectedUser && (
            <div className='space-y-2'>
              <p>
                <span className='font-semibold'>Nombre:</span>{' '}
                {selectedUser.first_name} {selectedUser.last_name}
              </p>
              <p>
                <span className='font-semibold'>Usuario:</span>{' '}
                {selectedUser.username}
              </p>
              <p>
                <span className='font-semibold'>Correo:</span>{' '}
                {selectedUser.email}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteUser.isPending}
          >
            {deleteUser.isPending ? 'Eliminando...' : 'Eliminar usuario'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
