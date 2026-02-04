interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'purple';
  isLoading?: boolean;
  fullWidth?: boolean;
  loadingText?: string;
}

export const Button = ({
  variant = 'primary',
  isLoading,
  fullWidth = false,
  loadingText = 'Cargando...',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    purple: 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};