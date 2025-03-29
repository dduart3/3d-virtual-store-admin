import { CreateUserDialog } from './create-user-dialog'
import { DeleteUserDialog } from './delete-user-dialog'
import { UpdateUserDialog } from './update-user-dialog'

export function UsersDialogs() {
  return (
    <>
      <CreateUserDialog />
      <UpdateUserDialog />
      <DeleteUserDialog />
    </>
  )
}
