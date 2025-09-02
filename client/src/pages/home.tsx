import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import EmergencyStatus from "@/components/emergency-status";
import SOSButton from "@/components/sos-button";
import QuickActions from "@/components/quick-actions";
import TrustedContacts from "@/components/trusted-contacts";
import VolunteerCard from "@/components/volunteer-card";
import LocationMap from "@/components/location-map";
import RecentActivity from "@/components/recent-activity";
import EmergencyServices from "@/components/emergency-services";
import BottomNavigation from "@/components/bottom-navigation";
import { Shield, Users } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading your safety dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="mobile-container flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">SheGuardian</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full volunteer-status"></div>
              <span className="text-sm text-muted-foreground">Volunteers nearby</span>
            </div>
            <button 
              className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"
              onClick={() => window.location.href = "/profile"}
              data-testid="button-profile"
            >
              <Users className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-container px-4 py-6 space-y-6">
        <EmergencyStatus />
        <SOSButton />
        <QuickActions />
        <TrustedContacts />
        <VolunteerCard />
        <LocationMap />
        <RecentActivity />
        <EmergencyServices />
      </main>

      <BottomNavigation />
    </div>
  );
}
