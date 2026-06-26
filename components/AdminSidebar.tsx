"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Tag, LogOut, PenLine } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/blogs/new", label: "New Blog", icon: PenLine },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col z-40">
      <div className="p-6 border-b border-outline-variant/20">
        <Link href="/" className="font-display-lg text-xl text-primary tracking-tighter">
          Opinion Matters
        </Link>
        <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-sm text-label-sm transition-all ${
                isActive
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-all w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
