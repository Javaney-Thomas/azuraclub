"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { menuItems } from "../../utils";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Define the navigation menu items with icons and their corresponding routes.

  return (
    <div>
      {" "}
      {/* Mobile Sidebar using shadcn's Sheet */}
      <div className="md:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTitle className="hidden"></SheetTitle>
          <SheetTrigger asChild>
            <Button variant="ghost" className="m-4">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xl border-b">
                Admin Panel
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t">
                <Link
                  href="/logout"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 p-2 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="font-medium">Logout</span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Header;
