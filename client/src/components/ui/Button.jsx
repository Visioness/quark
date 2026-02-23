import { LoadingSpinner } from './LoadingSpinner';

const variants = {
  primary:
    'bg-primary/80 text-primary-foreground border border-border hover:bg-primary',
  secondary:
    'bg-card text-secondary-foreground/60 border border-border hover:bg-secondary hover:text-secondary-foreground',
  transparent: 'text-foreground hover:bg-muted',
  destructive: 'text-destructive hover:bg-muted border border-border',
};

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = ({
  type = 'button',
  variant = 'secondary',
  size = 'md',
  extra,
  disabled,
  loading,
  onClick,
  children,
}) => {
  const variantClass = variants[variant] ?? variant;
  const sizeClass = sizes[size] ?? size;

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`button flex justify-center items-center cursor-pointer font-semibold transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none ${variantClass} ${sizeClass} ${extra}`}>
      {loading ?
        <LoadingSpinner size={size} />
      : children}
    </button>
  );
};
