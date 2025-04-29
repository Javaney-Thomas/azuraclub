"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlignJustify, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Modal } from "@/app/shared/modal";
import { useGetCurrentUser } from "@/app/shared/hooks/useGetCurrentUser";
import { toast } from "sonner";
import Auth from "@/app/(landingPage)/(auth)";
import CartSheet from "./components/CartSheet";
import UserLocation from "./components/UserLocation";
import SearchBar from "./components/SearchBar";

const Navbar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { currentUser, logout } = useGetCurrentUser();

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logout successful!");
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full bg-gray-900 z-50 transition-all duration-300 ${
          isSticky ? "fixed top-0 shadow-md" : "relative"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">Azura</span>
          </Link>

          {/* Desktop Search: Use SearchBar component */}
          <SearchBar />

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center ml-auto space-x-6">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white hover:text-gray-300">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col text-left">
                      <span className="text-xs">Hello, {currentUser.name}</span>
                      <span className="font-bold">Account &amp; Lists</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 text-white">
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Link href="/profile/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setModalOpen(true)}
                className="text-white hover:text-gray-300"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col text-left">
                    <span className="text-xs">Hello, Sign in</span>
                    <span className="font-bold">Account &amp; Lists</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            )}
            <CartSheet />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTitle></SheetTitle>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <AlignJustify className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-64 p-4 bg-gray-800 text-white"
              >
                <div className="flex flex-col space-y-4 mt-4">
                  <Link
                    href="/shops"
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Shops
                  </Link>
                  <Link
                    href="/offers"
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Offers
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/orders"
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Your Orders
                  </Link>
                  <Link
                    href="/cart"
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Cart
                  </Link>

                  {currentUser ? (
                    <div className="px-4 py-2 border-b">
                      <p className="text-lg font-bold">
                        Hello, {currentUser.name}
                      </p>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-primaryx text-black"
                      onClick={() => setModalOpen(true)}
                    >
                      Sign In
                    </Button>
                  )}

                  {currentUser && (
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-red-400 hover:text-red-600"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Bottom Nav Bar for Desktop */}
        <div className="bg-gray-800 text-white py-2 px-4 hidden md:block">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button variant="ghost" className="text-white mr-4">
                <AlignJustify className="w-6 h-6 mr-2" /> All
              </Button>
              <nav className="flex space-x-6">
                <Link
                  href="/shops"
                  className="text-sm text-white hover:text-gray-300"
                >
                  Shops
                </Link>
                <Link
                  href="/offers"
                  className="text-sm text-white hover:text-gray-300"
                >
                  Today&apos;s Deals
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-white hover:text-gray-300"
                >
                  Customer Service
                </Link>
                <Link
                  href="/registry"
                  className="text-sm text-white hover:text-gray-300"
                >
                  Registry
                </Link>
                <Link
                  href="/gift-cards"
                  className="text-sm text-white hover:text-gray-300"
                >
                  Gift Cards
                </Link>
                <Link
                  href="/sell"
                  className="text-sm text-white hover:text-gray-300"
                >
                  Sell
                </Link>
              </nav>
            </div>
            <UserLocation />
          </div>
        </div>
      </motion.header>

      {/* Modal for Sign In */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <Auth setCloseModal={setModalOpen} />
      </Modal>

      {/* Floating "Go to Admin" Button - Only visible for admin users */}
      {currentUser && currentUser.role === "admin" && (
        <Link href="/admin">
          <Button className="fixed bottom-4 right-4 z-50 bg-teal-500 hover:bg-teal-600 text-white">
            Go to Admin
          </Button>
        </Link>
      )}
    </>
  );
};

export default Navbar;
