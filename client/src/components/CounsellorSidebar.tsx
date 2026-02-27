"use client";
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  X
} from "lucide-react";
import logo from "../../../public/logo1.jpeg";

interface CounsellorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavItem = ({ href, icon: Icon, label, onClose }: { href: string; icon: any; label: string; onClose: () => void }) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <a
        onClick={onClose}
        className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-200 ${isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-semibold"
            : "hover:bg-gray-800 text-gray-400 hover:text-white"
          }`}
      >
        <Icon size={22} />
        <span className="text-sm font-medium">{label}</span>
      </a>
    </Link>
  );
};

export default function CounsellorSidebar({ isOpen, onClose }: CounsellorSidebarProps) {
  const [username, setUsername] = useState("Counsellor");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/counsellor/dashboard" },
    { label: "My Schedule", icon: Calendar, href: "/counsellor/schedule" },
    { label: "Clients", icon: Users, href: "/counsellor/clients" },
    { label: "Messages", icon: MessageSquare, href: "/counsellor/messages" },
    { label: "Resources", icon: BookOpen, href: "/counsellor/resources" },
    { label: "Settings", icon: Settings, href: "/counsellor/settings" },
  ];

  return (
    <aside className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-gray-100 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl">
              <img src={logo} alt="Zenture" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight">Zenture</span>
          </div>
          <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-800 rounded-lg text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mt-4">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              icon={item.icon}
              label={item.label}
              onClose={onClose}
            />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-6 p-2 rounded-xl bg-gray-800/50">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{username}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Counsellor Account</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-4 p-3 rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all duration-200 w-full"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
