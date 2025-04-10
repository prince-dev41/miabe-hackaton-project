import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const { isMobile } = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Extract page title from location
  const getPageTitle = () => {
    if (location === "/") return "Dashboard";
    return location.slice(1).charAt(0).toUpperCase() + location.slice(2);
  };

  // Close sidebar on mobile when changing routes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
      />
      <div className={`transition-all duration-300 ${isMobile ? "" : "lg:ml-64"}`}>
        <Header
          pageTitle={getPageTitle()}
          onSidebarToggle={handleSidebarToggle}
        />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
