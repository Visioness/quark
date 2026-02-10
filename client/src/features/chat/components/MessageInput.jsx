import { useRef } from 'react';
import { Button } from '@/components/ui';

export const MessageInput = ({ onSend }) => {
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleInput = (e) => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${e.target.scrollHeight + 2}px`;
      wrapperRef.current.style.height = 'auto';
      wrapperRef.current.style.height = `${e.target.scrollHeight + 2}px`;

      e.target.scrollTop = e.target.scrollHeight;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = inputRef.current.value.trim();
    if (!content) return;

    onSend(content);
    inputRef.current.value = '';
    inputRef.current.style.height = 'auto';
    wrapperRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <footer className='mt-8'>
      <form onSubmit={handleSubmit} className='flex h-min gap-2'>
        <div
          ref={wrapperRef}
          className='flex-1 h-[42px] rounded-lg max-h-[90px] overflow-hidden'>
          <textarea
            ref={inputRef}
            id='message'
            name='message'
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            spellCheck='false'
            autoComplete='off'
            className='w-full h-full px-4 py-2 max-h-[90px] rounded-lg resize-none border border-border bg-input outline-none focus:inset-ring-1 focus:inset-ring-primary overflow-y-auto scrollbar'
          />
        </div>
        <Button type='submit' variant='primary' size='md' extra='rounded-xl'>
          Send
        </Button>
      </form>
    </footer>
  );
};
