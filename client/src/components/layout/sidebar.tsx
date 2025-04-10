import { useEffect } from "react";
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
  Menu,
  Settings,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  role?: 'doctor' | 'patient' | 'all';
}

const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    path: "/",
    icon: BarChart2,
    role: 'all'
  },
  {
    title: "Rendez-vous",
    path: "/appointments",
    icon: CalendarCheck,
    role: 'all'
  },
  {
    title: "Dossiers médicaux",
    path: "/records",
    icon: FileText,
    role: 'all'
  },
  {
    title: "Mes patients",
    path: "/patients",
    icon: User,
    role: 'doctor'
  },
  {
    title: "Médecins",
    path: "/doctors",
    icon: UserRound,
    role: 'patient'
  },
  {
    title: "Retours & Avis",
    path: "/feedback",
    icon: Star,
    role: 'all'
  },
  {
    title: "Rappels",
    path: "/reminders",
    icon: Bell,
    role: 'all'
  },
  {
    title: "Paramètres",
    path: "/settings",
    icon: Settings,
    role: 'all'
  }
];

export function Sidebar({ isMobile, isOpen, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { toast } = useToast();
  const { user, logout } = useAuth();

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
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès."
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
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-30 transition-transform duration-300 ease-in-out transform ${
          isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 overflow-y-auto scrollbar-hide shadow-xl`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary-500" />
            <span className="text-xl font-semibold text-white">TeleMed Doc</span>
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
            {navItems
              .filter(item => item.role === 'all' || item.role === user?.userType)
              .map((item) => (
                <li key={item.path} className="px-4 py-2">
                  <Link 
                    href={item.path}
                    className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                      location === item.path
                        ? "bg-primary-600 text-white"
                        : "text-gray-100 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4 bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name || 'Médecin'}</p>
              <p className="text-xs text-gray-300">{user?.email || 'medecin@telemed.com'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full mt-3 text-white border-gray-700 hover:text-white hover:bg-gray-800 flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>
    </>
  );
}
