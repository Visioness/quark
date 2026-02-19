import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Trash2, X } from 'lucide-react';
import {
  getInvites,
  createInvite,
  deleteInvite,
} from '@/services/conversation.service';
import { Button, LoadingSpinner } from '@/components/ui';

const DURATIONS = [
  { label: '1 hour', value: 3_600_000 },
  { label: '24 hours', value: 86_400_000 },
  { label: '7 days', value: 604_800_000 },
  { label: 'No expiry', value: null },
];

const getTimeRemaining = (expiresAt) => {
  if (!expiresAt) return 'No expiry';

  const remaining = new Date(expiresAt) - Date.now();
  if (remaining <= 0) return 'Expired';

  const minutes = Math.floor(remaining / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h ${minutes % 60}m left`;
  return `${minutes}m left`;
};

export const Invites = ({ conversationId, open, onClose }) => {
  const dialogRef = useRef(null);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  const fetchInvites = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getInvites(conversationId);
      if (result.success) setInvites(result.invites);
    } catch {
      setInvites([]);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (open) fetchInvites();
  }, [open, fetchInvites]);

  const handleCreate = async (duration) => {
    try {
      await createInvite(conversationId, duration);
      await fetchInvites();
    } catch {
      // Silently fail — backend returns descriptive errors via toast if needed
    }
  };

  const handleDelete = async (code) => {
    try {
      await deleteInvite(code);
      setInvites((prev) => prev.filter((invite) => invite.code !== code));
    } catch {
      // no-op
    }
  };

  const handleCopy = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <dialog ref={dialogRef}>
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <div className='bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-card-foreground'>
              Invite Links
            </h2>
            <Button
              variant='transparent'
              size='sm'
              extra='rounded-xl w-9 h-9'
              onClick={onClose}>
              <X className='h-5 w-5' />
            </Button>
          </div>

          <div className='space-y-2 max-h-64 overflow-y-auto mb-4'>
            {loading ? (
              <div className='flex justify-center py-4'>
                <LoadingSpinner size='sm' />
              </div>
            ) : invites.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-4'>
                No invite links yet.
              </p>
            ) : (
              invites.map((invite) => (
                <div
                  key={invite.code}
                  className='flex items-center justify-between p-3 rounded-xl border border-border bg-secondary'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-mono text-card-foreground truncate'>
                      {invite.code}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {invite.creator.username} &middot;{' '}
                      {getTimeRemaining(invite.expiresAt)}
                    </p>
                  </div>
                  <div className='flex items-center gap-1 ml-2'>
                    <Button
                      variant='transparent'
                      size='sm'
                      extra='rounded-lg w-8 h-8'
                      onClick={() => handleCopy(invite.code)}>
                      {copiedCode === invite.code ? (
                        <Check className='h-4 w-4 text-green-500' />
                      ) : (
                        <Copy className='h-4 w-4 text-muted-foreground' />
                      )}
                    </Button>
                    <Button
                      variant='transparent'
                      size='sm'
                      extra='rounded-lg w-8 h-8'
                      onClick={() => handleDelete(invite.code)}>
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className='border-t border-border pt-4'>
            <p className='text-sm font-medium text-card-foreground mb-2'>
              Create New Invite
            </p>
            <div className='flex flex-wrap gap-2'>
              {DURATIONS.map((d) => (
                <Button
                  key={d.label}
                  variant='secondary'
                  size='sm'
                  extra='rounded-xl'
                  onClick={() => handleCreate(d.value)}>
                  {d.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
