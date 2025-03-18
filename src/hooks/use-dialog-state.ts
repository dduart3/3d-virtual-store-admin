import { useState } from 'react'

/**
 * Custom hook for managing dialog state
 * @param initialState The initial state of the dialog
 * @returns [state, setState] tuple
 */
export default function useDialogState<T>(initialState: T | null = null) {
  const [state, setState] = useState<T | null>(initialState)

  const setDialogState = (value: T | null) => {
    if (state === value) {
      setState(null)
    } else {
      setState(value)
    }
  }

  return [state, setDialogState] as const
}