import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Clair' },
    { value: 'dark', icon: Moon, label: 'Sombre' },
    { value: 'system', icon: Monitor, label: 'Système' }
  ] as const;

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <div className="relative">
      <motion.button
        onClick={() => {
          const currentIndex = themes.findIndex(t => t.value === theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          setTheme(themes[nextIndex].value);
        }}
        className={`
          relative flex items-center gap-2 px-3 py-2 rounded-lg
          bg-white/10 dark:bg-black/20 backdrop-blur-xl
          border border-white/20 dark:border-white/10
          hover:bg-white/20 dark:hover:bg-black/30
          transition-all duration-300
          shadow-lg hover:shadow-xl
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          {currentTheme && <currentTheme.icon size={18} />}
        </motion.div>
        
        <span className="hidden sm:block font-medium text-sm">
          {currentTheme?.label}
        </span>

        {/* Indicateur de mode actuel */}
        <motion.div
          className="-top-1 -right-1 absolute rounded-full w-3 h-3"
          animate={{
            backgroundColor: isDark ? '#1f2937' : '#fbbf24',
            boxShadow: isDark 
              ? '0 0 10px rgba(31, 41, 55, 0.5)' 
              : '0 0 10px rgba(251, 191, 36, 0.5)'
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </div>
  );
};

export default ThemeToggle; 