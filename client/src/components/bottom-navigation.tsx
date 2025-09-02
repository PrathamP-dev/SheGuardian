import { useLocation } from "wouter";
import { Home, FileText, AlertCircle, Heart, User } from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navigationItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/reports", icon: FileText, label: "Reports" },
    { path: "/incidents", icon: AlertCircle, label: "Incidents" },
    { path: "/support", icon: Heart, label: "Support" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="bg-card border-t border-border fixed bottom-0 left-0 right-0 z-50" data-testid="bottom-navigation">
      <div className="mobile-container px-4 py-2">
        <div className="flex justify-around">
          {navigationItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                className={`flex flex-col items-center py-2 px-3 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setLocation(item.path)}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
