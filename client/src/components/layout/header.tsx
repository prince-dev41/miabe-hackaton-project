import { Bell, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  pageTitle: string;
  onSidebarToggle: () => void;
}

export function Header({ pageTitle, onSidebarToggle }: HeaderProps) {
  return (
    <header className="sticky-header">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={onSidebarToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <h1 className="text-xl font-medium capitalize">{pageTitle}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
