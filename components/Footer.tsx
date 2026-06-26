"use client";

import { ChevronUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-surface border-t border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-12 font-body-md text-body-md">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs space-y-4">
            <Link href="/" className="font-display-lg text-headline-md text-primary tracking-tighter block hover:opacity-80 transition-opacity">Opinion Matters</Link>
            <p className="text-secondary font-body-md text-body-md">Building a more thoughtful digital landscape through critical observation and intentional design.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-6">
            <div className="flex flex-col gap-4">
              <h4 className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Sitemap</h4>
              <Link href="/all-articles" className="text-on-surface-variant hover:text-primary transition-colors text-body-md">Articles</Link>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">About</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">Newsletter</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Social</h4>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">Twitter</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">Instagram</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">LinkedIn</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Legal</h4>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">Privacy</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">Terms</a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-secondary font-label-sm text-label-sm">© 2024 Opinion Matters. Built for the digital observer.</p>
          <div className="flex items-center gap-6">
            <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest">Designed for clarity</span>
            <button onClick={scrollToTop} className="text-secondary cursor-pointer hover:text-primary transition-colors">
              <ChevronUp size={24} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
