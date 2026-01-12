import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={cycleTheme}
      className='rounded-full border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-all'
      title={`Theme: ${theme}`}
    >
      {theme === 'system' && <Monitor className='h-5 w-5' />}
      {theme === 'light' && <Sun className='h-5 w-5' />}
      {theme === 'dark' && <Moon className='h-5 w-5' />}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
