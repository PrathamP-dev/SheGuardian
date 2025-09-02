import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Share, Headphones } from "lucide-react";

export default function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const shareLocationMutation = useMutation({
    mutationFn: async () => {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      await apiRequest("POST", "/api/share-location", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: "Current location"
      });
    },
    onSuccess: () => {
      toast({
        title: "Location Shared",
        description: "Your location has been shared with all trusted contacts.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activity-logs"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to share location. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFakeCall = () => {
    // Simulate incoming call interface
    toast({
      title: "Fake Call Activated",
      description: "Incoming call simulation started. Perfect for getting out of uncomfortable situations.",
    });
    
    // In a real implementation, this would:
    // - Show a realistic incoming call interface
    // - Play ringtone sounds
    // - Allow answering/declining the fake call
    // - Have customizable caller information
  };

  const handleFindSafePlaces = () => {
    toast({
      title: "Safe Places Nearby",
      description: "Showing nearby police stations, hospitals, and safe zones on map.",
    });
    
    // In a real implementation, this would:
    // - Open the map component
    // - Highlight nearby safe locations
    // - Provide directions to the nearest safe place
    // - Show operating hours and contact information
  };

  const handleOpenSupport = () => {
    toast({
      title: "Support Services",
      description: "Connecting you to 24/7 support and counseling services.",
    });
    
    // In a real implementation, this would:
    // - Open a support chat interface
    // - Connect to counselors or helplines
    // - Provide crisis support resources
    // - Offer anonymous support options
  };

  return (
    <Card data-testid="quick-actions-section">
      <CardContent className="p-4">
        <h3 className="font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="p-3 bg-muted rounded-lg text-center hover:bg-accent transition-colors"
            onClick={handleFakeCall}
            data-testid="button-fake-call"
          >
            <Phone className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Fake Call</p>
          </button>
          
          <button 
            className="p-3 bg-muted rounded-lg text-center hover:bg-accent transition-colors"
            onClick={handleFindSafePlaces}
            data-testid="button-safe-places"
          >
            <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Safe Places</p>
          </button>
          
          <button 
            className="p-3 bg-muted rounded-lg text-center hover:bg-accent transition-colors"
            onClick={() => shareLocationMutation.mutate()}
            disabled={shareLocationMutation.isPending}
            data-testid="button-share-location"
          >
            <Share className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Share Location</p>
          </button>
          
          <button 
            className="p-3 bg-muted rounded-lg text-center hover:bg-accent transition-colors"
            onClick={handleOpenSupport}
            data-testid="button-support"
          >
            <Headphones className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Get Support</p>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
