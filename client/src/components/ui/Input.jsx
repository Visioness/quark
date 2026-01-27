import { AlertCircle } from 'lucide-react';

export const Input = (props) => {
  const isValid = !props.validationError && props.value?.length > 0;

  return (
    <div className='input-group relative'>
      <label htmlFor={props.name} className='block text-sm font-medium mb-1'>
        {props.children}
      </label>
      <input
        id={props.name}
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        className={`w-full p-2 rounded-md border bg-input outline-none focus:ring-1 ${
          props.validationError
            ? 'border-destructive/50 focus:ring-destructive/60'
            : isValid
            ? 'border-green-500/50 focus:ring-green-500/60'
            : 'border-border focus:ring-foreground'
        } text-foreground placeholder:text-muted-foreground`}
        placeholder={props.placeholder}
      />
      <div
        className={`validation-error mt-0.5 sm:mt-1 flex items-center gap-1 font-semibold text-[10px]/3 sm:text-[12px]/3 text-rose-400 transition-transform origin-center ${
          props.validationError ? 'scale-y-100' : 'scale-y-0'
        }`}>
        {props.validationError && (
          <>
            <AlertCircle className='w-3 min-w-3 h-3' />
            <span className='message'>{props.validationError}</span>
          </>
        )}
      </div>
    </div>
  );
};
