import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Share, Headphones } from "lucide-react";
import FakeCallModal from "./fake-call-modal";
import SafePlacesModal from "./safe-places-modal";
import AnonymousChatModal from "./anonymous-chat-modal";

export default function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isSafePlacesOpen, setIsSafePlacesOpen] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);

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
    setIsFakeCallOpen(true);
  };

  const handleFindSafePlaces = () => {
    setIsSafePlacesOpen(true);
  };

  const handleOpenSupport = () => {
    setIsSupportChatOpen(true);
  };

  return (
    <>
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
    
    {isFakeCallOpen && (
      <FakeCallModal 
        isOpen={isFakeCallOpen} 
        onClose={() => setIsFakeCallOpen(false)} 
      />
    )}
    
    {isSafePlacesOpen && (
      <SafePlacesModal 
        isOpen={isSafePlacesOpen} 
        onClose={() => setIsSafePlacesOpen(false)} 
      />
    )}
    
    {isSupportChatOpen && (
      <AnonymousChatModal 
        isOpen={isSupportChatOpen} 
        onClose={() => setIsSupportChatOpen(false)} 
      />
    )}
    </>
  );
}
