import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  tabIndex?: number;
  className?: string;
}

export function ThemeToggle({ tabIndex = 0, className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-black/15 bg-black/[0.02] text-[#000000] transition-all duration-200 hover:border-[#880021] hover:bg-[#880021] hover:text-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-2 dark:border-white/20 dark:bg-white/[0.04] dark:text-[#ffffff] dark:hover:border-[#d43b5c] dark:hover:bg-[#880021] dark:hover:text-[#ffffff] dark:focus-visible:ring-[#d43b5c] dark:focus-visible:ring-offset-[#000000] ${className}`}
    >
      <motion.span
        key={isDark ? 'sun' : 'moon'}
        initial={{ rotate: -25, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center justify-center"
      >
        {isDark ? (
          <Sun
            className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12"
            aria-hidden="true"
          />
        ) : (
          <Moon
            className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-12"
            aria-hidden="true"
          />
        )}
      </motion.span>
    </button>
  );
}
