'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type HeaderProps = {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const pathname = usePathname() || '';

  const navBase =
    'px-5 py-2 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5';

  const navHover =
    theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/5';

  const activeClass = (path: string) =>
    pathname.startsWith(path)
      ? theme === 'dark'
        ? 'px-5 py-2 rounded-full font-bold bg-gradient-to-br from-gray-600 to-gray-500 text-green-400'
        : 'px-5 py-2 rounded-full font-bold bg-gradient-to-br from-blue-600 to-blue-800 text-white'
      : `${navBase} ${navHover}`;

  return (
    <div
      className={`max-w-[1400px] mx-auto mb-5 flex justify-between items-center p-4 rounded-2xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600'
          : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-md'
      }`}
    >
      <div className="flex gap-5 items-center flex-wrap">
        <Link href="/dashboard" className={activeClass('/dashboard')}>
          Dashboard
        </Link>

        <Link href="/" className={activeClass('/docter')}>
          หมอ
        </Link>

        <Link href="/profile" className={activeClass('/profile')}>
          โปรไฟล์ หน้าผู้ใช้
        </Link>
      </div>

      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-600 to-gray-500 text-white'
            : 'bg-gradient-to-br from-blue-600 to-blue-800 text-white'
        }`}
      >
        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}
