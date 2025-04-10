import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LucideIcon, 
  BarChart2, 
  CalendarCheck, 
  FileText, 
  User, 
  UserRound, 
  Star, 
  Bell, 
  Heart, 
  X,
  Menu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: BarChart2
  },
  {
    title: "Appointments",
    path: "/appointments",
    icon: CalendarCheck
  },
  {
    title: "Medical Records",
    path: "/records",
    icon: FileText
  },
  {
    title: "Patients",
    path: "/patients",
    icon: User
  },
  {
    title: "Doctors",
    path: "/doctors",
    icon: UserRound
  },
  {
    title: "Feedback",
    path: "/feedback",
    icon: Star
  },
  {
    title: "Reminders",
    path: "/reminders",
    icon: Bell
  }
];

export function Sidebar({ isMobile, isOpen, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@telemed.com"
  });

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isMobile && isOpen && (event.target as HTMLElement).id === "sidebar-overlay") {
        onToggle();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen, onToggle]);

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobile && isOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-20">
        <Button
          onClick={onToggle}
          size="icon"
          className="rounded-full w-12 h-12 shadow-lg bg-primary-600 hover:bg-primary-700"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-primary-800 text-white z-30 transition-transform duration-300 ease-in-out transform ${
          isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 overflow-y-auto scrollbar-hide`}
      >
        <div className="p-4 flex items-center justify-between border-b border-primary-700">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-white" />
            <span className="text-xl font-semibold">TeleMed Admin</span>
          </div>
          {isMobile && (
            <button
              className="text-white focus:outline-none"
              onClick={onToggle}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="px-4 py-2">
                <Link href={item.path}>
                  <a
                    className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                      location === item.path
                        ? "bg-primary-700 text-white"
                        : "text-gray-300 hover:bg-primary-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 w-full border-t border-primary-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-300">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full mt-3 text-gray-300 hover:text-white hover:bg-primary-700"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
