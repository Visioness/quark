import { Link } from 'react-router';
import { ThemeToggler } from '@/features/theme/components';

export const LandingPage = () => {
  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300'>
      <header className='flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50'>
        <div className='flex items-center gap-2'>
          <div className='h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold'>
            Q
          </div>
          <span className='text-xl font-bold tracking-tight'>Quark</span>
        </div>

        <div className='flex items-center gap-2 sm:gap-6'>
          <div className='hidden sm:block h-full'>
            <ThemeToggler />
          </div>
          <nav className='flex items-center gap-4'>
            <Link
              to='/auth/log-in'
              className='text-sm font-medium hover:text-primary transition-colors hidden sm:block'>
              Log In
            </Link>
            <Link
              to='/auth/sign-up'
              className='bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity shadow-sm'>
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className='flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden'>
        {/* Background Decorative Elements */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10' />

        <div className='max-w-3xl space-y-8 relative z-10'>
          <div className='inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground'>
            <span className='flex h-2 w-2 rounded-full bg-primary mr-2'></span>
            v1.0 is now live
          </div>

          <h1 className='text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-balance'>
            Connect at the <br className='hidden sm:block' />
            <span className='text-primary'>speed of light</span>.
          </h1>

          <p className='text-lg sm:text-xl text-muted-foreground text-balance max-w-2xl mx-auto'>
            Quark redefines how you chat. Simple, secure, and blazing fast
            messaging for everyone, everywhere.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'>
            <Link
              to='/auth/sign-up'
              className='w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25 active:scale-95'>
              Get Started Free
            </Link>
            <Link
              to='/auth/log-in'
              className='w-full sm:w-auto px-8 py-3.5 bg-card border text-card-foreground border-border rounded-lg font-semibold text-lg hover:bg-accent hover:text-accent-foreground transition-all active:scale-95'>
              Log In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='py-8 border-t border-border bg-card/30'>
        <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground'>
          <p>&copy; {new Date().getFullYear()} Quark. All rights reserved.</p>
          <div className='flex gap-6'>
            <a href='#' className='hover:text-foreground transition-colors'>
              Privacy
            </a>
            <a href='#' className='hover:text-foreground transition-colors'>
              Terms
            </a>
            <a href='#' className='hover:text-foreground transition-colors'>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
