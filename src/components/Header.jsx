import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-[var(--bg-base)] text-[var(--text-heading)] border-b border-[var(--border-subtle)]">
      <div className="mx-auto px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-sm">Questrade</span>
          <span className="text-[var(--text-muted)] text-sm">QOffice 2.0</span>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs">&#128269;</span>
            <input
              type="text"
              placeholder="Search cases, accounts, users... (⌘K)"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border)] rounded-md text-[var(--text-body)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-[var(--text-secondary)] hover:text-[var(--text-heading)] text-sm px-2 py-1 rounded-md hover:bg-[var(--bg-elevated)] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-heading)] text-sm">&#9881;</button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-semibold text-white">
              AZ
            </div>
            <span className="text-xs text-[var(--text-body)]">Albert Zhang</span>
          </div>
        </div>
      </div>
    </header>
  );
}
