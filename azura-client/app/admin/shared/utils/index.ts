import {
  Home,
  Users,
  ShoppingCart,
  Box,
  Tag,
  // Star,
  Settings,
} from "lucide-react";
export const menuItems = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { name: "Products", icon: Box, href: "/admin/products" },
  { name: "Categories", icon: Tag, href: "/admin/categories" },
  // { name: "Reviews", icon: Star, href: "/admin/reviews" },
  { name: "Settings", icon: Settings, href: "/admin/settings", disable: true },
];
