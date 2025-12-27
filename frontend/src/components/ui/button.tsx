import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50'
  const widthStyles = fullWidth ? 'w-full' : ''
  
  const variantStyles = {
    primary: 'bg-linear-to-r from-[#674188] to-[#C3ACD0]  text-white hover:bg-secondary',
    secondary: 'bg-[#674188]/50  text-primary hover:bg-light',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  return (
    <button
      className={`${baseStyles} ${widthStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}