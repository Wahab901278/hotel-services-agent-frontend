"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Search,
  CalendarCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  Hotel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/hotels", label: "Hotels", icon: Search },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/rfp", label: "RFP", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        sidebarOpen ? "w-60" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Hotel className="h-6 w-6 shrink-0 text-primary" />
        {sidebarOpen && (
          <span className="text-lg font-semibold tracking-tight">
            HotelAgent
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
