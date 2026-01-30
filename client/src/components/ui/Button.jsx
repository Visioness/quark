import { LoadingSpinner } from './LoadingSpinner';

const variants = {
  primary: 'bg-primary text-primary-foreground border border-border',
  secondary:
    'bg-card text-secondary-foreground border border-border hover:bg-secondary',
  transparent: 'text-foreground hover:bg-muted border border-border',
};

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = ({
  type,
  variant,
  size,
  disabled,
  extra,
  loading,
  onClick,
  children,
}) => {
  const variantClass = variants[variant] ?? variants.primary;
  const sizeClass = sizes[size] ?? sizes.md;

  return (
    <button
      type={type ?? 'button'}
      disabled={loading || disabled}
      onClick={onClick}
      className={`button flex justify-center items-center cursor-pointer transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none ${variantClass} ${sizeClass} ${extra} ${
        type === 'submit' ? 'w-full' : ''
      } `}>
      {loading ? <LoadingSpinner size={size} /> : children}
    </button>
  );
};
