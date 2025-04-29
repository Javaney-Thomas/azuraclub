"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useGetCurrentUser } from "@/app/shared/hooks/useGetCurrentUser";
import { menuItems } from "../../utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { currentUser: user, logout } = useGetCurrentUser();

  // Define the navigation menu items with icons and their corresponding routes.

  if (!user || user.role !== "admin") {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex justify-center items-center h-full text-gray-600 text-xl">
          You are not authorized to access this page. Please log in as an admin.
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r shadow-xl bg-white">
        <Link
          href={"/"}
          className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xl border-b"
        >
          Azura
        </Link>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isDisabled = item.disable;

            return (
              <div key={item.name}>
                {isDisabled ? (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                    <item.icon className="w-6 h-6" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div
            onClick={logout}
            className="flex items-center gap-3 p-2 text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 ">
        {children || (
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome to Admin Dashboard
            </h1>
          </div>
        )}
      </main>
    </div>
  );
}
