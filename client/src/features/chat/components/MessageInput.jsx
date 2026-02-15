import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui';

export const MessageInput = ({ onSend }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const inputRef = useRef(null);

  const handleInput = (e) => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${e.target.scrollHeight + 2}px`;

      e.target.scrollTop = e.target.scrollHeight;
      setIsDisabled(inputRef.current.value.trim() === '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = inputRef.current.value;
    if (!content?.trim()) return;

    onSend(content);
    inputRef.current.value = '';
    inputRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <footer>
      <form onSubmit={handleSubmit} className='flex items-end mt-2 p-4 gap-2'>
        <div className='flex-1 flex rounded-lg overflow-hidden'>
          <textarea
            ref={inputRef}
            id='message'
            name='message'
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            spellCheck='false'
            autoComplete='off'
            className='w-full px-4 py-2 max-h-[90px] rounded-lg resize-none border border-border bg-input outline-none focus:inset-ring-1 focus:inset-ring-primary overflow-y-auto scrollbar'
          />
        </div>
        <Button
          type='submit'
          variant='primary'
          size='md'
          disabled={isDisabled}
          extra='rounded-xl max-h-max flex gap-2 font-semibold'>
          <Send size={20} strokeWidth={3} />
          Send
        </Button>
      </form>
    </footer>
  );
};
