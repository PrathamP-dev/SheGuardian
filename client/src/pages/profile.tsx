import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BottomNavigation from "@/components/bottom-navigation";
import { ArrowLeft, Check, Shield, Users, HelpCircle, Lock, Headphones, Star } from "lucide-react";
import type { User } from "@shared/schema";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [preferences, setPreferences] = useState({
    shakeToAlert: true,
    silentMode: false,
    autoRecord: true,
    isVolunteer: false,
  });

  const { data: userData } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (userData) {
      setPreferences({
        shakeToAlert: userData.shakeToAlert ?? true,
        silentMode: userData.silentMode ?? false,
        autoRecord: userData.autoRecord ?? true,
        isVolunteer: userData.isVolunteer ?? false,
      });
    }
  }, [userData]);

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

  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: any) => {
      await apiRequest("PUT", "/api/user/preferences", newPreferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Preferences Updated",
        description: "Your safety preferences have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateVolunteerStatusMutation = useMutation({
    mutationFn: async (data: { isVolunteer: boolean; radius?: number }) => {
      await apiRequest("PUT", "/api/volunteer-status", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Volunteer Status Updated",
        description: preferences.isVolunteer 
          ? "You're now available to help others in emergency situations."
          : "You're no longer receiving emergency response requests.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update volunteer status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePreferenceChange = (key: string, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    if (key === 'isVolunteer') {
      updateVolunteerStatusMutation.mutate({ 
        isVolunteer: value, 
        radius: 500 
      });
    } else {
      updatePreferencesMutation.mutate({ [key]: value });
    }
  };

  const handleLogout = () => {
    if (user?.id === 'guest-user') {
      // For guest users, just reload the page to return to landing
      window.location.reload();
    } else {
      // For regular users, use the logout endpoint
      window.location.href = "/api/logout";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="mobile-container flex items-center justify-between">
          <button 
            className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold">Profile & Settings</h1>
          <button 
            className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <Check className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="mobile-container p-4 space-y-6">
        {/* Profile Section */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-primary-foreground text-2xl font-bold">
              {userData?.firstName?.[0] || userData?.email?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <h2 className="text-lg font-semibold" data-testid="text-user-name">
            {userData?.firstName && userData?.lastName 
              ? `${userData.firstName} ${userData.lastName}`
              : userData?.email || "User"
            }
          </h2>
          <p className="text-sm text-muted-foreground" data-testid="text-user-email">
            {userData?.email || "No email provided"}
          </p>
        </div>

        {/* Emergency Preferences */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Emergency Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium text-sm">Shake to Alert</Label>
                  <p className="text-xs text-muted-foreground">Trigger SOS by shaking device</p>
                </div>
                <Switch
                  checked={preferences.shakeToAlert}
                  onCheckedChange={(checked) => handlePreferenceChange('shakeToAlert', checked)}
                  data-testid="switch-shake-alert"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium text-sm">Silent Mode</Label>
                  <p className="text-xs text-muted-foreground">Disable alert sounds</p>
                </div>
                <Switch
                  checked={preferences.silentMode}
                  onCheckedChange={(checked) => handlePreferenceChange('silentMode', checked)}
                  data-testid="switch-silent-mode"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium text-sm">Auto-Record</Label>
                  <p className="text-xs text-muted-foreground">Record audio during SOS</p>
                </div>
                <Switch
                  checked={preferences.autoRecord}
                  onCheckedChange={(checked) => handlePreferenceChange('autoRecord', checked)}
                  data-testid="switch-auto-record"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Status */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Volunteer Status</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="font-medium text-sm">Available to Help</Label>
                <p className="text-xs text-muted-foreground">Receive nearby emergency alerts</p>
              </div>
              <Switch
                checked={preferences.isVolunteer}
                onCheckedChange={(checked) => handlePreferenceChange('isVolunteer', checked)}
                disabled={updateVolunteerStatusMutation.isPending}
                data-testid="switch-volunteer-status"
              />
            </div>
            
            {preferences.isVolunteer && (
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Response Radius</span>
                    <span className="font-medium">500m</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>Total Responses</span>
                    <span className="font-medium">{userData?.totalResponses || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="font-medium">
                        {userData?.volunteerRating || "New"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Support & Resources</h3>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center space-x-3 p-3 hover:bg-muted rounded-lg transition-colors"
                data-testid="button-help"
              >
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">Help & FAQ</span>
                <svg className="h-4 w-4 text-muted-foreground ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                className="w-full flex items-center space-x-3 p-3 hover:bg-muted rounded-lg transition-colors"
                data-testid="button-privacy"
              >
                <Lock className="h-5 w-5 text-primary" />
                <span className="text-sm">Privacy & Security</span>
                <svg className="h-4 w-4 text-muted-foreground ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                className="w-full flex items-center space-x-3 p-3 hover:bg-muted rounded-lg transition-colors"
                data-testid="button-contact-support"
              >
                <Headphones className="h-5 w-5 text-primary" />
                <span className="text-sm">Contact Support</span>
                <svg className="h-4 w-4 text-muted-foreground ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
          data-testid="button-logout-main"
        >
          Sign Out
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
}
