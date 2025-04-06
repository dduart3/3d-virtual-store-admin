import { useRef, useState, useEffect, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
}

export function OtpInput({
  value = '',
  onChange,
  length = 6,
  disabled = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(
    value.split('').concat(Array(length - value.length).fill(''))
  )
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Update parent component when OTP changes
  useEffect(() => {
    onChange(otp.join(''))
  }, [otp, onChange])

  // Update local state when value prop changes
  useEffect(() => {
    const valueArray = value.split('').slice(0, length)
    setOtp(valueArray.concat(Array(length - valueArray.length).fill('')))
  }, [value, length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value
    
    // Only accept numbers
    if (!/^\d*$/.test(newValue)) return
    
    // Update the current input and move to next input
    const newOtp = [...otp]
    
    // If pasting multiple digits
    if (newValue.length > 1) {
      // Fill as many inputs as we have digits
      const digits = newValue.split('').slice(0, length - index)
      
      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit
        }
      })
      
      setOtp(newOtp)
      
      // Focus on the next empty input or the last input
      const nextIndex = Math.min(index + digits.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
    } else {
      // Single digit input
      newOtp[index] = newValue
      setOtp(newOtp)
      
      // Move to next input if available
      if (newValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, move to previous input and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      }
    }
    
    // Handle left arrow key
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle right arrow key
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()
    
    // Only accept numbers
    if (!/^\d*$/.test(pastedData)) return
    
    const digits = pastedData.split('').slice(0, length - index)
    const newOtp = [...otp]
    
    digits.forEach((digit, i) => {
      if (index + i < length) {
        newOtp[index + i] = digit
      }
    })
    
    setOtp(newOtp)
    
    // Focus on the next empty input or the last input
    const nextIndex = Math.min(index + digits.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            // Correctly assign the ref without returning anything
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={otp[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          disabled={disabled}
          className={cn(
            "h-12 w-12 rounded-md border text-center text-lg font-semibold",
            "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
}
