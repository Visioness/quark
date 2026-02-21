import { useEffect, useRef, useState } from 'react';

export const Dialog = ({ isVisible, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isVisible) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [isVisible]);

  return (
    <dialog ref={dialogRef}>
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        {children}
      </div>
    </dialog>
  );
};
