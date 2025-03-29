
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUsersContext } from '../context/users-context'
import { useUsers } from '../hooks/use-users'

export function DeleteUserDialog() {
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
  