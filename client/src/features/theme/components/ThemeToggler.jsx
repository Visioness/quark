import { MonitorCog, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/features/theme/context';
import { ThemeOption } from '@/features/theme/components';

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const slider_position =
    theme === 'dark'
      ? 'translate-x-0'
      : theme === 'light'
      ? 'translate-x-8.5'
      : 'translate-x-17';

  return (
    <div className='theme-toggler relative sm:h-9 w-26 h-9 flex items-center rounded-lg bg-card border border-border overflow-hidden'>
      <div
        className={`theme-slider absolute w-8.5 h-full bg-muted ${slider_position} transition-transform z-10`}></div>
      <ThemeOption onClick={() => setTheme('dark')}>
        <Moon
          className={`w-full h-full p-2 relative z-20 ${
            theme === 'dark'
              ? 'text-secondary-foreground'
              : 'text-muted-foreground'
          }`}
        />
      </ThemeOption>
      <ThemeOption onClick={() => setTheme('light')}>
        <Sun
          className={`w-full h-full p-2 relative z-20 ${
            theme === 'light'
              ? 'text-secondary-foreground'
              : 'text-muted-foreground'
          }`}
        />
      </ThemeOption>
      <ThemeOption onClick={() => setTheme('system')}>
        <MonitorCog
          className={`w-full h-full p-2 relative z-20 ${
            theme === 'system'
              ? 'text-secondary-foreground'
              : 'text-muted-foreground'
          }`}
        />
      </ThemeOption>
    </div>
  );
}
