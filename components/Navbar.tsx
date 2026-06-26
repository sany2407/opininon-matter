"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Moon, Sun, Menu } from 'lucide-react';

export default function Navbar({ toggleDarkMode, isDarkMode }: { toggleDarkMode: () => void, isDarkMode: boolean }) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = winHeightPx > 0 ? (scrollPx / winHeightPx) * 100 : 0;
      setReadingProgress(scrolled);
    };

    window.addEventListener("scroll", updateReadingProgress);
    updateReadingProgress();
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[2px] z-[100]">
        <div
          className="h-full bg-electric-blue transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 h-20">
        <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-full">
          <Link href="/" className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
            Opinion Matters
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link href="/all-articles" className="text-primary font-bold border-b-2 border-primary pb-1 font-label-sm text-label-sm hover:opacity-80 transition-opacity">Articles</Link>
            <a className="text-on-surface-variant hover:opacity-80 transition-opacity font-label-sm text-label-sm cursor-pointer" href="/#about">About</a>
            <div className="relative group">
              <span className="cursor-pointer active:scale-95 transition-transform select-none hover:opacity-80"><Search size={24} className="text-on-surface" /></span>
            </div>
            <span className="cursor-pointer active:scale-95 transition-transform select-none hover:opacity-80" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun size={24} className="text-on-surface" /> : <Moon size={24} className="text-on-surface" />}
            </span>
          </div>
          <div className="md:hidden flex items-center gap-4">
            <span className="cursor-pointer active:scale-95 transition-transform" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun size={24} className="text-on-surface" /> : <Moon size={24} className="text-on-surface" />}
            </span>
            <Menu size={24} className="text-on-surface cursor-pointer active:scale-95 transition-transform" />
          </div>
        </div>
      </nav>
    </>
  );
}
