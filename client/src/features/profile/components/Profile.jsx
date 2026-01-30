import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context';
import { getProfile } from '@/services/profile.service';
import { LoadingSpinner } from '@/components/ui';

export const Profile = () => {
  const { accessToken, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const result = await getProfile(user.username, accessToken);
        if (result.success) {
          setProfile(result.profile);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [accessToken, user]);

  return (
    <div className='w-full h-full flex flex-col items-center px-8 py-4 space-y-4'>
      <h3 className='text-2xl text-center font-medium mb-4'>Profile</h3>
      <div className='flex-1 flex justify-center items-center'>
        {loading && <LoadingSpinner size='md' />}

        {error && (
          <div className='p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive'>
            {error.message || 'Failed to load profile'}
          </div>
        )}

        {profile && !loading && (
          <div className='sm:min-w-xs max-w-sm p-6 rounded-lg border bg-card border-border'>
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Username
                </label>
                <p className='text-lg font-semibold'>{profile.username}</p>
              </div>

              {profile.email && (
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Email
                  </label>
                  <p className='text-lg'>{profile.email}</p>
                </div>
              )}

              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Member Since
                </label>
                <p className='text-lg'>
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Last Updated
                </label>
                <p className='text-lg'>
                  {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
