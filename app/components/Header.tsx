'use client';

import Link from 'next/link';

type HeaderProps = {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const navBase =
    'px-5 py-2 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5';

  const navHover =
    theme === 'dark'
      ? 'text-white hover:bg-white/10'
      : 'text-gray-800 hover:bg-black/5';

  return (
    <div
      className={`max-w-[1400px] mx-auto mb-5 flex justify-between items-center p-4 rounded-2xl ${
        theme === 'dark'
          ? 'bg-linear-to-br from-gray-800 to-gray-700 border border-gray-600'
          : 'bg-linear-to-br from-white to-gray-50 border border-gray-300 shadow-md'
      }`}
    >
      {/* Navigation */}
      <div className="flex gap-5 items-center">
        <Link href="/dashboard" className={`${navBase} ${navHover}`}>
          Dashboard
        </Link>

        <Link href="/docter" className={`${navBase} ${navHover}`}>
          หมอ
        </Link>

        <Link href="/profile" className={`${navBase} ${navHover}`}>
          โปรไฟล์ หน้าผู้ใช้
        </Link>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 ${
          theme === 'dark'
            ? 'bg-linear-to-br from-gray-600 to-gray-500 text-white'
            : 'bg-linear-to-br from-white to-gray-200 text-gray-800 shadow-md'
        }`}
      >
        {theme === 'dark' ? 'Dark mode' : 'Light mode'}
      </button>
    </div>
  );
}
